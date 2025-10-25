import { execute } from './List';

// Mock the pagination utility
jest.mock('../../Corrugated/shared/pagination', () => ({
	listWithPaginationFlat: jest.fn(),
}));

import { listWithPaginationFlat } from '../../Corrugated/shared/pagination';

describe('Imports List action', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('should call listWithPaginationFlat with correct parameters (happy path)', async () => {
		const mockResponse = {
			data: [
				{ id: 'import-1', status: 'completed' },
				{ id: 'import-2', status: 'pending' },
			],
		};
		(listWithPaginationFlat as jest.Mock).mockResolvedValue(mockResponse);

		const mockThis = {
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

		expect(listWithPaginationFlat).toHaveBeenCalledWith(
			mockThis,
			'/api/imports',
			expect.objectContaining({
				returnAll: true,
				limit: undefined,
				page: 1,
				filters: {},
				sort: {},
			}),
		);
		expect(result[0].json).toEqual(mockResponse);
	});

	it('should handle pagination parameters correctly (non-returnAll)', async () => {
		const mockResponse = { data: [{ id: 'import-3' }], pagination: { total: 1 } };
		(listWithPaginationFlat as jest.Mock).mockResolvedValue(mockResponse);

		const mockThis = {
			getNodeParameter: (name: string, i: number, defaultValue?: any) => {
				if (name === 'returnAll') return false;
				if (name === 'limit') return 25;
				if (name === 'page') return 2;
				if (name === 'filters') return {};
				if (name === 'sort') return {};
				return defaultValue;
			},
			continueOnFail: () => false,
		} as any;

		const items = [{ json: {} }];
		await execute.call(mockThis, items);

		expect(listWithPaginationFlat).toHaveBeenCalledWith(
			mockThis,
			'/api/imports',
			expect.objectContaining({
				returnAll: false,
				limit: 25,
				page: 2,
				filters: {},
				sort: {},
			}),
		);
	});

	it('should map UI search parameter to API s parameter', async () => {
		const mockResponse = { data: [] };
		(listWithPaginationFlat as jest.Mock).mockResolvedValue(mockResponse);

		const mockThis = {
			getNodeParameter: (name: string, i: number, defaultValue?: any) => {
				if (name === 'returnAll') return false;
				if (name === 'limit') return 50;
				if (name === 'page') return 1;
				if (name === 'filters') return { search: 'test query', status: 'completed' };
				if (name === 'sort') return {};
				return defaultValue;
			},
			continueOnFail: () => false,
		} as any;

		const items = [{ json: {} }];
		await execute.call(mockThis, items);

		expect(listWithPaginationFlat).toHaveBeenCalledWith(
			mockThis,
			'/api/imports',
			expect.objectContaining({
				filters: { s: 'test query', status: 'completed' },
			}),
		);
	});

	it('should handle all filter parameters correctly', async () => {
		const mockResponse = { data: [] };
		(listWithPaginationFlat as jest.Mock).mockResolvedValue(mockResponse);

		const mockThis = {
			getNodeParameter: (name: string, i: number, defaultValue?: any) => {
				if (name === 'returnAll') return false;
				if (name === 'limit') return 10;
				if (name === 'page') return 1;
				if (name === 'filters')
					return {
						delimiter: ',',
						status: 'pending',
						type: '1',
						filterId: 'filter-123',
						start: '2024-01-01',
						end: '2024-12-31',
					};
				if (name === 'sort') return { sortBy: 'createdAt', sortOrder: 'desc' };
				return defaultValue;
			},
			continueOnFail: () => false,
		} as any;

		const items = [{ json: {} }];
		await execute.call(mockThis, items);

		expect(listWithPaginationFlat).toHaveBeenCalledWith(
			mockThis,
			'/api/imports',
			expect.objectContaining({
				filters: {
					delimiter: ',',
					status: 'pending',
					type: '1',
					filterId: 'filter-123',
					start: '2024-01-01',
					end: '2024-12-31',
				},
				sort: { sortBy: 'createdAt', sortOrder: 'desc' },
			}),
		);
	});

	it('should handle invalid page numbers by defaulting to 1', async () => {
		const mockResponse = { data: [] };
		(listWithPaginationFlat as jest.Mock).mockResolvedValue(mockResponse);

		const mockThis = {
			getNodeParameter: (name: string, i: number, defaultValue?: any) => {
				if (name === 'returnAll') return false;
				if (name === 'limit') return 50;
				if (name === 'page') return -5; // Invalid page number
				if (name === 'filters') return {};
				if (name === 'sort') return {};
				return defaultValue;
			},
			continueOnFail: () => false,
		} as any;

		const items = [{ json: {} }];
		await execute.call(mockThis, items);

		expect(listWithPaginationFlat).toHaveBeenCalledWith(
			mockThis,
			'/api/imports',
			expect.objectContaining({
				page: 1, // Should default to 1
			}),
		);
	});

	it('should handle errors and push error object when continueOnFail is true', async () => {
		(listWithPaginationFlat as jest.Mock).mockRejectedValue(new Error('API error'));

		const mockThis = {
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
		expect(result[0].json).toEqual({ error: 'API error' });
	});

	it('should throw error when continueOnFail is false', async () => {
		(listWithPaginationFlat as jest.Mock).mockRejectedValue(new Error('Network failure'));

		const mockThis = {
			getNodeParameter: (name: string, i: number, defaultValue?: any) => {
				if (name === 'returnAll') return true;
				if (name === 'filters') return {};
				if (name === 'sort') return {};
				return defaultValue;
			},
			continueOnFail: () => false,
		} as any;

		const items = [{ json: {} }];
		await expect(execute.call(mockThis, items)).rejects.toThrow('Network failure');
	});
});
