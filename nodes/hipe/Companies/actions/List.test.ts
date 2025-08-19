import { execute } from './List';

describe('List action', () => {
	it('should call helpers.requestWithAuthentication and return correct data (happy path)', async () => {
		const mockThis = {
			getCredentials: async () => ({ url: 'https://fake.api' }),
			helpers: {
				requestWithAuthentication: {
					call: jest.fn().mockResolvedValue([{ id: '1', name: 'Acme' }]),
				},
			},
			getNodeParameter: (name: string, i: number) => {
				if (name === 'returnAll') return true;
				if (name === 'filters') return {};
				if (name === 'sort') return {};
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
				method: 'GET',
				url: 'https://fake.api/api/companies/pagination',
				qs: { page: 1, limit: 100 },
				json: true,
			}),
		);
		expect(result[0].json).toEqual({ data: [{ id: '1', name: 'Acme' }] });
	});

	it('should handle paginated response (edge case)', async () => {
		const mockThis = {
			getCredentials: async () => ({ url: 'https://fake.api' }),
			helpers: {
				requestWithAuthentication: {
					call: jest
						.fn()
						.mockResolvedValue({ data: [{ id: '2', name: 'Beta' }], pagination: { total: 1 } }),
				},
			},
			getNodeParameter: (name: string, i: number) => {
				if (name === 'returnAll') return true;
				if (name === 'filters') return {};
				if (name === 'sort') return {};
				return undefined;
			},
			continueOnFail: () => false,
		} as any;
		const items = [{ json: {} }];
		const result = await execute.call(mockThis, items);
		expect(result[0].json).toEqual({ data: [{ id: '2', name: 'Beta' }] });
	});

	it('should handle errors and push error object when continueOnFail is true (edge case)', async () => {
		const mockThis = {
			getCredentials: async () => ({ url: 'https://fake.api' }),
			helpers: {
				requestWithAuthentication: {
					call: jest.fn().mockRejectedValue(new Error('fail!')),
				},
			},
			getNodeParameter: (name: string, i: number) => {
				if (name === 'returnAll') return true;
				if (name === 'filters') return {};
				if (name === 'sort') return {};
				if (name === 'limit') return 50;
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
					call: jest.fn().mockResolvedValue({ data: [{ id: '3' }] }),
				},
			},
			getNodeParameter: (name: string) => {
				if (name === 'returnAll') return false;
				if (name === 'limit') return 25;
				if (name === 'page') return 2;
				if (name === 'filters') return { status: 'active', search: 'ac' };
				if (name === 'sort') return { sortBy: 'name', sortOrder: 'asc' };
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
				url: 'https://fake.api/api/companies/pagination',
				qs: expect.objectContaining({
					page: 2,
					limit: 25,
					status: 'active',
					search: 'ac',
					sort: 'name,ASC',
				}),
				json: true,
			}),
		);
	});

	it('should iterate all pages when returnAll is true using pageCount', async () => {
		const page1 = Array.from({ length: 100 }, (_, i) => ({ id: `c${i + 1}` }));
		const page2 = [{ id: 'c101' }];
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

	it('should include type filter in flat qs', async () => {
		const mockThis = {
			getCredentials: async () => ({ url: 'https://fake.api' }),
			helpers: {
				requestWithAuthentication: {
					call: jest.fn().mockResolvedValue({ data: [{ id: '4' }] }),
				},
			},
			getNodeParameter: (name: string) => {
				if (name === 'returnAll') return false;
				if (name === 'limit') return 10;
				if (name === 'page') return 1;
				if (name === 'filters') return { type: 'CALL' };
				if (name === 'sort') return {};
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
				url: 'https://fake.api/api/companies/pagination',
				qs: expect.objectContaining({
					page: 1,
					limit: 10,
					type: 'CALL',
				}),
				json: true,
			}),
		);
	});

	it('should include date Specific with start/end in flat qs', async () => {
		const mockThis = {
			getCredentials: async () => ({ url: 'https://fake.api' }),
			helpers: {
				requestWithAuthentication: {
					call: jest.fn().mockResolvedValue({ data: [{ id: '5' }] }),
				},
			},
			getNodeParameter: (name: string) => {
				if (name === 'returnAll') return false;
				if (name === 'limit') return 25;
				if (name === 'page') return 3;
				if (name === 'filters') return { date: 'Specific', start: '1735686000000', end: '1738450800000' };
				if (name === 'sort') return { sortBy: 'updatedAt', sortOrder: 'desc' };
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
				url: 'https://fake.api/api/companies/pagination',
				qs: expect.objectContaining({
					page: 3,
					limit: 25,
					date: 'Specific',
					start: '1735686000000',
					end: '1738450800000',
					sort: 'updatedAt,DESC',
				}),
				json: true,
			}),
		);
	});
});
