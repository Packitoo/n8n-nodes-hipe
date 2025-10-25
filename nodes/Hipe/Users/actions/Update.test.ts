import { IExecuteFunctions } from 'n8n-workflow';
import { execute } from './Update';

describe('Update action', () => {
	it('should call helpers.request and return correct data (happy path)', async () => {
		const mockThis: IExecuteFunctions = {
			getCredentials: async () => ({ url: 'https://fake.api' }),
			helpers: {
				requestWithAuthentication: jest.fn().mockResolvedValue({ updated: true }),
			},
			getNodeParameter: (name: string, i: number) => {
				if (name === 'id') return '1';
				if (name === 'updateFields') return { firstName: 'Jane' };
				return undefined;
			},
			continueOnFail: () => false,
		} as any;
		const items = [{ json: {} }];
		const result = await execute.call(mockThis, items);
		expect(mockThis.helpers.requestWithAuthentication).toHaveBeenCalledWith(
			'hipeApi',
			expect.objectContaining({
				method: 'PATCH',
				url: 'https://fake.api/api/users/1',
				body: { firstName: 'Jane' },
			}),
		);
		expect(result[0].json).toEqual({ updated: true });
	});

	it('should handle errors and push error object when continueOnFail is true (edge case)', async () => {
		const mockThis = {
			getCredentials: async () => ({ url: 'https://fake.api' }),
			helpers: {
				requestWithAuthentication: jest.fn().mockRejectedValue(new Error('fail!')),
			},
			getNodeParameter: (name: string, i: number) => {
				if (name === 'id') return '1';
				if (name === 'updateFields') return { firstName: 'Jane' };
				return undefined;
			},
			continueOnFail: () => true,
		} as any;
		const items = [{ json: {} }];
		const result = await execute.call(mockThis, items);
		expect(result[0].json).toEqual({ error: 'fail!' });
	});
});
