import { execute } from './Update';

describe('Orders Update action', () => {
	it('should call helpers.requestWithAuthentication and return correct data (happy path)', async () => {
		const mockThis = {
			getCredentials: async () => ({ url: 'https://fake.api' }),
			helpers: {
				requestWithAuthentication: {
					call: jest.fn().mockResolvedValue({ id: '1', billedAmount: 1500, trackingId: 'NEW123' }),
				},
			},
			getNodeParameter: (name: string) => {
				if (name === 'id') return '1';
				if (name === 'updateFields') return { billedAmount: 1500, trackingId: 'NEW123' };
				return undefined;
			},
			continueOnFail: () => false,
		} as any;
		const items = [{ json: {} }];
		const result = await execute.call(mockThis, items);
		expect(mockThis.helpers.requestWithAuthentication.call).toHaveBeenCalledWith(
			mockThis,
			'hipeApi',
			expect.objectContaining({
				method: 'PATCH',
				url: 'https://fake.api/api/orders/1',
				json: true,
				body: { billedAmount: 1500, trackingId: 'NEW123' },
			}),
		);
		expect(result[0].json).toEqual({ id: '1', billedAmount: 1500, trackingId: 'NEW123' });
	});

	it('should handle errors and push error object when continueOnFail is true', async () => {
		const mockThis = {
			getCredentials: async () => ({ url: 'https://fake.api' }),
			helpers: {
				requestWithAuthentication: {
					call: jest.fn().mockRejectedValue(new Error('fail!')),
				},
			},
			getNodeParameter: () => undefined,
			continueOnFail: () => true,
		} as any;
		const items = [{ json: {} }];
		const result = await execute.call(mockThis, items);
		expect(result[0].json).toEqual({ error: 'fail!' });
	});
});
