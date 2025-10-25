import { execute } from './AddItems';

describe('Orders AddItems action', () => {
	it('should call helpers.requestWithAuthentication and return updated order (happy path)', async () => {
		const mockThis = {
			getCredentials: async () => ({ url: 'https://fake.api' }),
			helpers: {
				requestWithAuthentication: {
					call: jest.fn().mockResolvedValue({
						id: 'order-123',
						billedAmount: 1250,
						items: [
							{ id: 'item-1', articleId: 'art-1', quantity: 5, unitPrice: 100, totalPrice: 500 },
							{ id: 'item-2', articleId: 'art-2', quantity: 2, unitPrice: 250, totalPrice: 500 },
						],
					}),
				},
			},
			getNodeParameter: (name: string) => {
				if (name === 'orderId') return 'order-123';
				if (name === 'items')
					return {
						itemValues: [{ articleId: 'art-1' }, { articleId: 'art-2' }],
					};
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
				method: 'POST',
				url: 'https://fake.api/api/orders/order-123/order-items',
				json: true,
				body: [{ articleId: 'art-1' }, { articleId: 'art-2' }],
			}),
		);
		expect(result[0].json).toHaveProperty('items');
		expect(result[0].json.items).toHaveLength(2);
		expect(result[0].json.billedAmount).toBe(1250);
	});

	it('should throw error if no items provided', async () => {
		const mockThis = {
			getCredentials: async () => ({ url: 'https://fake.api' }),
			helpers: {
				requestWithAuthentication: {
					call: jest.fn(),
				},
			},
			getNodeParameter: (name: string) => {
				if (name === 'orderId') return 'order-123';
				if (name === 'items') return { itemValues: [] };
				return undefined;
			},
			continueOnFail: () => false,
		} as any;
		const items = [{ json: {} }];
		await expect(execute.call(mockThis, items)).rejects.toThrow(
			'At least one item must be provided',
		);
	});

	it('should handle errors and push error object when continueOnFail is true', async () => {
		const mockThis = {
			getCredentials: async () => ({ url: 'https://fake.api' }),
			helpers: {
				requestWithAuthentication: {
					call: jest.fn().mockRejectedValue(new Error('Article not found')),
				},
			},
			getNodeParameter: (name: string) => {
				if (name === 'orderId') return 'order-123';
				if (name === 'items')
					return {
						itemValues: [{ articleId: 'invalid-article-id' }],
					};
				return undefined;
			},
			continueOnFail: () => true,
		} as any;
		const items = [{ json: {} }];
		const result = await execute.call(mockThis, items);
		expect(result[0].json).toEqual({ error: 'Article not found' });
	});

	it('should handle multiple articles', async () => {
		const mockThis = {
			getCredentials: async () => ({ url: 'https://fake.api' }),
			helpers: {
				requestWithAuthentication: {
					call: jest.fn().mockResolvedValue({
						id: 'order-123',
						billedAmount: 2500,
						items: [
							{ id: 'item-1', articleId: 'art-1' },
							{ id: 'item-2', articleId: 'art-2' },
							{ id: 'item-3', articleId: 'art-3' },
						],
					}),
				},
			},
			getNodeParameter: (name: string) => {
				if (name === 'orderId') return 'order-123';
				if (name === 'items')
					return {
						itemValues: [{ articleId: 'art-1' }, { articleId: 'art-2' }, { articleId: 'art-3' }],
					};
				return undefined;
			},
			continueOnFail: () => false,
		} as any;
		const items = [{ json: {} }];
		await execute.call(mockThis, items);
		expect(mockThis.helpers.requestWithAuthentication.call).toHaveBeenCalledWith(
			mockThis,
			'hipeApi',
			expect.objectContaining({
				body: [{ articleId: 'art-1' }, { articleId: 'art-2' }, { articleId: 'art-3' }],
			}),
		);
	});
});
