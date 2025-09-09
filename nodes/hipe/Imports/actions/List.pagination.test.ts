import { execute } from './List';

// Mock the pagination utility
jest.mock('../../Corrugated/shared/pagination', () => ({
	listWithPaginationFlat: jest.fn(),
}));

import { listWithPaginationFlat } from '../../Corrugated/shared/pagination';

describe('Imports List pagination tests', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('should use shared pagination utility with correct endpoint', async () => {
		const mockResponse = { data: [{ id: 'import-1' }] };
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
			'/api/imports',
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
				if (name === 'sort') return { sortBy: 'updatedAt', sortOrder: 'asc' };
				return defaultValue;
			},
			continueOnFail: () => false,
		} as any;

		const items = [{ json: {} }];
		await execute.call(mockThis, items);

		expect(listWithPaginationFlat).toHaveBeenCalledWith(mockThis, '/api/imports', {
			returnAll: false,
			limit: 100,
			page: 3,
			filters: { status: 'completed' },
			sort: { sortBy: 'updatedAt', sortOrder: 'asc' },
		});
	});

	it('should handle returnAll=true with undefined limit', async () => {
		const mockResponse = { data: Array.from({ length: 250 }, (_, i) => ({ id: `import-${i}` })) };
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
			}),
		);
		expect(result[0].json.data).toHaveLength(250);
	});
});
