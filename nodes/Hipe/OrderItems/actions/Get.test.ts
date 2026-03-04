import { execute } from './Get';

describe('OrderItems Get action', () => {
	it('should call helpers.requestWithAuthentication and return correct data (happy path)', async () => {
		const mockThis = {
			getCredentials: async () => ({ url: 'https://fake.api' }),
			helpers: {
				requestWithAuthentication: {
					call: jest.fn().mockResolvedValue({
						id: 'item-1',
						orderId: 'order-123',
						quantity: 5,
						unitPrice: 10,
						totalPrice: 50,
					}),
				},
			},
			getNodeParameter: (name: string) => (name === 'orderItemId' ? 'item-1' : undefined),
			continueOnFail: () => false,
		} as any;
		const items = [{ json: {} }];
		const result = await execute.call(mockThis, items);
		expect(mockThis.helpers.requestWithAuthentication.call).toHaveBeenCalledWith(
			mockThis,
			'hipeApi',
			expect.objectContaining({
				method: 'GET',
				url: 'https://fake.api/api/order-items/item-1',
				json: true,
			}),
		);
		expect(result[0].json).toEqual({
			id: 'item-1',
			orderId: 'order-123',
			quantity: 5,
			unitPrice: 10,
			totalPrice: 50,
		});
	});

	it('should handle errors and push error object when continueOnFail is true', async () => {
		const mockThis = {
			getCredentials: async () => ({ url: 'https://fake.api' }),
			helpers: {
				requestWithAuthentication: {
					call: jest.fn().mockRejectedValue(new Error('Not found')),
				},
			},
			getNodeParameter: () => 'invalid-id',
			continueOnFail: () => true,
		} as any;
		const items = [{ json: {} }];
		const result = await execute.call(mockThis, items);
		expect(result[0].json).toEqual({ error: 'Not found' });
	});

	it('should handle multiple input items', async () => {
		const mockThis = {
			getCredentials: async () => ({ url: 'https://fake.api' }),
			helpers: {
				requestWithAuthentication: {
					call: jest
						.fn()
						.mockResolvedValueOnce({ id: 'item-1', quantity: 5 })
						.mockResolvedValueOnce({ id: 'item-2', quantity: 10 }),
				},
			},
			getNodeParameter: jest.fn((name: string, i: number) => {
				if (name === 'orderItemId') return i === 0 ? 'item-1' : 'item-2';
				return undefined;
			}),
			continueOnFail: () => false,
		} as any;
		const items = [{ json: {} }, { json: {} }];
		const result = await execute.call(mockThis, items);
		expect(result).toHaveLength(2);
		expect(mockThis.helpers.requestWithAuthentication.call).toHaveBeenCalledTimes(2);
		expect(result[0].json).toEqual({ id: 'item-1', quantity: 5 });
		expect(result[1].json).toEqual({ id: 'item-2', quantity: 10 });
	});
});
