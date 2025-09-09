import { execute } from './List';

// Mock the pagination utility
jest.mock('../../Corrugated/shared/pagination', () => ({
	listWithPaginationFlat: jest.fn(),
}));

import { listWithPaginationFlat } from '../../Corrugated/shared/pagination';

describe('Exports List pagination tests', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('should use shared pagination utility with correct endpoint', async () => {
		const mockResponse = { data: [{ id: 'export-1' }] };
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
		await execute.call(mockThis, items);

		expect(listWithPaginationFlat).toHaveBeenCalledWith(
			mockThis,
			'/api/exports',
			expect.any(Object),
		);
	});

	it('should pass correct pagination parameters to shared utility', async () => {
		const mockResponse = { data: [] };
		(listWithPaginationFlat as jest.Mock).mockResolvedValue(mockResponse);

		const mockThis = {
			getNodeParameter: (name: string, i: number, defaultValue?: any) => {
				if (name === 'returnAll') return false;
				if (name === 'limit') return 100;
				if (name === 'page') return 3;
				if (name === 'filters') return { status: 'completed' };
				if (name === 'sort') return { sortBy: 'createdAt', sortOrder: 'desc' };
				return defaultValue;
			},
			continueOnFail: () => false,
		} as any;

		const items = [{ json: {} }];
		await execute.call(mockThis, items);

		expect(listWithPaginationFlat).toHaveBeenCalledWith(mockThis, '/api/exports', {
			returnAll: false,
			limit: 100,
			page: 3,
			filters: { status: 'completed' },
			sort: { sortBy: 'createdAt', sortOrder: 'desc' },
		});
	});

	it('should handle returnAll=true with undefined limit', async () => {
		const mockResponse = { data: Array.from({ length: 300 }, (_, i) => ({ id: `export-${i}` })) };
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
			'/api/exports',
			expect.objectContaining({
				returnAll: true,
				limit: undefined,
			}),
		);
		expect(result[0].json.data).toHaveLength(300);
	});
});
