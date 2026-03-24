import { execute } from './List';

describe('Jobs List action', () => {
	it('should call listWithPaginationFlat with returnAll=true (happy path)', async () => {
		const mockThis = {
			getCredentials: async () => ({ url: 'https://fake.api' }),
			helpers: {
				requestWithAuthentication: {
					call: jest.fn().mockResolvedValue([{ id: 'job-1' }, { id: 'job-2' }]),
				},
			},
			getNodeParameter: (name: string, i: number, defaultValue?: any) => {
				if (name === 'returnAll') return true;
				if (name === 'filters') return {};
				if (name === 'sort') return {};
				return defaultValue;
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
				url: 'https://fake.api/api/jobs',
				json: true,
			}),
		);
		expect(result[0].json).toEqual({ data: [{ id: 'job-1' }, { id: 'job-2' }] });
	});

	it('should pass page/limit/filters and sort (non-returnAll)', async () => {
		const mockThis = {
			getCredentials: async () => ({ url: 'https://fake.api' }),
			helpers: {
				requestWithAuthentication: {
					call: jest.fn().mockResolvedValue({ data: [{ id: 'job-3' }] }),
				},
			},
			getNodeParameter: (name: string, i: number, defaultValue?: any) => {
				if (name === 'returnAll') return false;
				if (name === 'limit') return 25;
				if (name === 'page') return 2;
				if (name === 'filters') return { type: 'import', status: '4' };
				if (name === 'sort') return { sortBy: 'createdAt', sortOrder: 'desc' };
				return defaultValue;
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
				url: 'https://fake.api/api/jobs',
				qs: expect.objectContaining({
					page: 2,
					limit: 25,
					type: 'import',
					status: '4',
					sort: 'createdAt,DESC',
				}),
				json: true,
			}),
		);
	});

	it('should iterate all pages when returnAll is true using pageCount', async () => {
		const page1 = Array.from({ length: 100 }, (_, i) => ({ id: `j${i + 1}` }));
		const page2 = [{ id: 'j101' }];
		const mockThis = {
			getCredentials: async () => ({ url: 'https://fake.api' }),
			helpers: {
				requestWithAuthentication: {
					call: jest
						.fn()
						.mockResolvedValueOnce({ data: page1, pageCount: 2 })
						.mockResolvedValueOnce({ data: page2, pageCount: 2 }),
				},
			},
			getNodeParameter: (name: string, i: number, defaultValue?: any) => {
				if (name === 'returnAll') return true;
				if (name === 'filters') return {};
				if (name === 'sort') return {};
				return defaultValue;
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

	it('should exclude empty filter values from query string', async () => {
		const mockThis = {
			getCredentials: async () => ({ url: 'https://fake.api' }),
			helpers: {
				requestWithAuthentication: {
					call: jest.fn().mockResolvedValue({ data: [] }),
				},
			},
			getNodeParameter: (name: string, i: number, defaultValue?: any) => {
				if (name === 'returnAll') return false;
				if (name === 'limit') return 50;
				if (name === 'page') return 1;
				if (name === 'filters') return { type: 'import', subType: '', entityType: '' };
				if (name === 'sort') return {};
				return defaultValue;
			},
			continueOnFail: () => false,
		} as any;
		const items = [{ json: {} }];
		await execute.call(mockThis, items);
		const qs = mockThis.helpers.requestWithAuthentication.call.mock.calls[0][2].qs;
		expect(qs.type).toBe('import');
		expect(qs).not.toHaveProperty('subType');
		expect(qs).not.toHaveProperty('entityType');
	});

	it('should default page to 1 when invalid value provided', async () => {
		const mockThis = {
			getCredentials: async () => ({ url: 'https://fake.api' }),
			helpers: {
				requestWithAuthentication: {
					call: jest.fn().mockResolvedValue({ data: [] }),
				},
			},
			getNodeParameter: (name: string, i: number, defaultValue?: any) => {
				if (name === 'returnAll') return false;
				if (name === 'limit') return 50;
				if (name === 'page') return -1;
				if (name === 'filters') return {};
				if (name === 'sort') return {};
				return defaultValue;
			},
			continueOnFail: () => false,
		} as any;
		const items = [{ json: {} }];
		await execute.call(mockThis, items);
		const qs = mockThis.helpers.requestWithAuthentication.call.mock.calls[0][2].qs;
		expect(qs.page).toBe(1);
	});

	it('should handle errors and push error object when continueOnFail is true', async () => {
		const mockThis = {
			getCredentials: async () => ({ url: 'https://fake.api' }),
			helpers: {
				requestWithAuthentication: {
					call: jest.fn().mockRejectedValue(new Error('fail!')),
				},
			},
			getNodeParameter: (name: string, i: number, defaultValue?: any) => {
				if (name === 'returnAll') return true;
				if (name === 'filters') return {};
				if (name === 'sort') return {};
				return defaultValue;
			},
			continueOnFail: () => true,
		} as any;
		const items = [{ json: {} }];
		const result = await execute.call(mockThis, items);
		expect(result[0].json).toEqual({ error: 'fail!' });
	});
});
