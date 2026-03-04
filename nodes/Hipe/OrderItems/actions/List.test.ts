import { execute } from './List';

describe('OrderItems List action', () => {
	it('should call helpers.requestWithAuthentication and return correct data (happy path, array)', async () => {
		const mockThis = {
			getCredentials: async () => ({ url: 'https://fake.api' }),
			helpers: {
				requestWithAuthentication: {
					call: jest.fn().mockResolvedValue([{ id: 'item-1', quantity: 5, totalPrice: 50 }]),
				},
			},
			getNodeParameter: (name: string) => {
				if (name === 'returnAll') return true;
				if (name === 'filters') return {};
				if (name === 'sort') return {};
				return undefined;
			},
			continueOnFail: () => false,
		} as any;
		const items = [{ json: {} }];
		const result = await execute.call(mockThis, items);
		expect(result[0].json).toEqual({ data: [{ id: 'item-1', quantity: 5, totalPrice: 50 }] });
	});

	it('should call helpers.requestWithAuthentication and return correct data (happy path, paginated)', async () => {
		const mockThis = {
			getCredentials: async () => ({ url: 'https://fake.api' }),
			helpers: {
				requestWithAuthentication: {
					call: jest.fn().mockResolvedValue({
						data: [{ id: 'item-2', quantity: 10 }],
						pagination: { total: 1 },
					}),
				},
			},
			getNodeParameter: (name: string) => {
				if (name === 'returnAll') return true;
				if (name === 'filters') return {};
				if (name === 'sort') return {};
				return undefined;
			},
			continueOnFail: () => false,
		} as any;
		const items = [{ json: {} }];
		const result = await execute.call(mockThis, items);
		expect(result[0].json).toEqual({
			data: [{ id: 'item-2', quantity: 10 }],
		});
	});

	it('should handle errors and push error object when continueOnFail is true', async () => {
		const mockThis = {
			getCredentials: async () => ({ url: 'https://fake.api' }),
			helpers: {
				requestWithAuthentication: {
					call: jest.fn().mockRejectedValue(new Error('fail!')),
				},
			},
			getNodeParameter: (name: string) => {
				if (name === 'returnAll') return true;
				if (name === 'filters') return {};
				if (name === 'sort') return {};
				return undefined;
			},
			continueOnFail: () => true,
		} as any;
		const items = [{ json: {} }];
		const result = await execute.call(mockThis, items);
		expect(result[0].json).toEqual({ error: 'fail!' });
	});

	it('should pass page/limit/filters and sort to flat qs (non-returnAll)', async () => {
		const mockThis = {
			getCredentials: async () => ({ url: 'https://fake.api' }),
			helpers: {
				requestWithAuthentication: {
					call: jest.fn().mockResolvedValue({
						data: [{ id: 'item-3', quantity: 2 }],
					}),
				},
			},
			getNodeParameter: (name: string) => {
				if (name === 'returnAll') return false;
				if (name === 'limit') return 25;
				if (name === 'page') return 3;
				if (name === 'filters') return { search: 'packaging', externalId: 'EXT-123' };
				if (name === 'sort') return { sortBy: 'createdAt', sortOrder: 'desc' };
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
				method: 'GET',
				url: 'https://fake.api/api/order-items',
				qs: expect.objectContaining({
					page: 3,
					limit: 25,
					search: 'packaging',
					externalId: 'EXT-123',
					sort: 'createdAt,DESC',
				}),
				json: true,
			}),
		);
	});

	it('should iterate all pages when returnAll is true using pageCount', async () => {
		const page1 = Array.from({ length: 100 }, (_, i) => ({ id: `item-${i + 1}` }));
		const page2 = [{ id: 'item-101' }];
		const mockThis = {
			getCredentials: async () => ({ url: 'https://fake.api' }),
			helpers: {
				requestWithAuthentication: {
					call: jest
						.fn()
						.mockResolvedValueOnce({ data: page1, pagination: { pageCount: 2 } })
						.mockResolvedValueOnce({ data: page2, pagination: { pageCount: 2 } }),
				},
			},
			getNodeParameter: (name: string) => {
				if (name === 'returnAll') return true;
				if (name === 'filters') return {};
				if (name === 'sort') return {};
				return undefined;
			},
			continueOnFail: () => false,
		} as any;
		const items = [{ json: {} }];
		const result = await execute.call(mockThis, items);
		const calls = (mockThis.helpers.requestWithAuthentication.call as jest.Mock).mock.calls;
		expect(calls.length).toBe(2);
		expect(calls[0][2].qs.page).toBe(1);
		expect(calls[1][2].qs.page).toBe(2);
		expect(result[0].json).toEqual({ data: [...page1, ...page2] });
	});
});
