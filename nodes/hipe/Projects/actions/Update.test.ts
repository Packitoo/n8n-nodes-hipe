import { execute } from './Update';

describe('Projects Update action', () => {
	it('should call helpers.request and return correct data (happy path)', async () => {
		const mockThis = {
			getCredentials: async () => ({ url: 'https://fake.api' }),
			helpers: {
				request: jest.fn().mockResolvedValue({ id: '1', name: 'Project X Updated' }),
			},
			getNodeParameter: (name: string) => {
				if (name === 'id') return '1';
				if (name === 'updateFields') return { name: 'Project X Updated' };
				return undefined;
			},
			continueOnFail: () => false,
		} as any;
		const items = [{ json: {} }];
		const result = await execute.call(mockThis, items);
		expect(mockThis.helpers.request).toHaveBeenCalledWith({
			method: 'PATCH',
			url: 'https://fake.api/api/projects/1',
			json: true,
			body: { name: 'Project X Updated' },
		});
		expect(result[0].json).toEqual({ id: '1', name: 'Project X Updated' });
	});

	it('should handle errors and push error object when continueOnFail is true', async () => {
		const mockThis = {
			getCredentials: async () => ({ url: 'https://fake.api' }),
			helpers: {
				request: jest.fn().mockRejectedValue(new Error('fail!')),
			},
			getNodeParameter: () => undefined,
			continueOnFail: () => true,
		} as any;
		const items = [{ json: {} }];
		const result = await execute.call(mockThis, items);
		expect(result[0].json).toEqual({ error: 'fail!' });
	});
});
