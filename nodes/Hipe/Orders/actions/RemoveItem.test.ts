import { execute } from './RemoveItem';

describe('Orders RemoveItem action', () => {
	it('should call helpers.requestWithAuthentication and return updated order (happy path)', async () => {
		const mockThis = {
			getCredentials: async () => ({ url: 'https://fake.api' }),
			helpers: {
				requestWithAuthentication: {
					call: jest.fn().mockResolvedValue({
						id: 'order-123',
						items: [{ id: 'item-2', articleId: 'art-2', quantity: 2 }],
					}),
				},
			},
			getNodeParameter: (name: string) => {
				if (name === 'orderId') return 'order-123';
				if (name === 'itemId') return 'item-1';
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
				method: 'DELETE',
				url: 'https://fake.api/api/orders/order-123/order-items/item-1',
				json: true,
			}),
		);
		expect(result[0].json).toHaveProperty('items');
	});

	it('should handle errors and push error object when continueOnFail is true', async () => {
		const mockThis = {
			getCredentials: async () => ({ url: 'https://fake.api' }),
			helpers: {
				requestWithAuthentication: {
					call: jest.fn().mockRejectedValue(new Error('Item not found')),
				},
			},
			getNodeParameter: (name: string) => {
				if (name === 'orderId') return 'order-123';
				if (name === 'itemId') return 'invalid-item';
				return undefined;
			},
			continueOnFail: () => true,
		} as any;
		const items = [{ json: {} }];
		const result = await execute.call(mockThis, items);
		expect(result[0].json).toEqual({ error: 'Item not found' });
	});

	it('should handle multiple input items (batch removal)', async () => {
		const mockThis = {
			getCredentials: async () => ({ url: 'https://fake.api' }),
			helpers: {
				requestWithAuthentication: {
					call: jest
						.fn()
						.mockResolvedValueOnce({ id: 'order-123', items: [] })
						.mockResolvedValueOnce({ id: 'order-456', items: [] }),
				},
			},
			getNodeParameter: jest.fn((name: string, i: number) => {
				if (name === 'orderId') return i === 0 ? 'order-123' : 'order-456';
				if (name === 'itemId') return i === 0 ? 'item-1' : 'item-2';
				return undefined;
			}),
			continueOnFail: () => false,
		} as any;
		const items = [{ json: {} }, { json: {} }];
		const result = await execute.call(mockThis, items);
		expect(result).toHaveLength(2);
		expect(mockThis.helpers.requestWithAuthentication.call).toHaveBeenCalledTimes(2);
	});
});
