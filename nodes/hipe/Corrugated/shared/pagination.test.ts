import { listWithPagination } from './pagination';
import type { IExecuteFunctions } from 'n8n-workflow';

describe('Corrugated shared pagination', () => {
	const baseUrl = 'https://fake.api';

	function makeMockExec(pages: Array<{ data: any[] } | any[]>, assertQs?: (qsList: any[]) => void) {
		const qsCalls: any[] = [];
		const mockThis: Partial<IExecuteFunctions> = {
			getCredentials: async () => ({ url: baseUrl }) as any,
			helpers: {
				requestWithAuthentication: {
					call: jest
						.fn()
						.mockImplementation((_self: any, _credName: string, req: any) => {
							qsCalls.push(req.qs);
							const pageIndex = qsCalls.length - 1;
							const resp = pages[Math.min(pageIndex, pages.length - 1)];
							return Promise.resolve(resp);
						}),
				} as any,
			} as any,
		};
		return { mockThis: mockThis as IExecuteFunctions, getQsCalls: () => qsCalls };
	}

	it('returnAll aggregates multiple pages until short page (array responses)', async () => {
		const pages = [
			[{ id: 1 }, { id: 2 }], // full page
			[{ id: 3 }], // short page, stop
		];
		const { mockThis, getQsCalls } = makeMockExec(pages);

		const result = await listWithPagination(mockThis, '/api/corrugated-formats', {
			returnAll: true,
			limit: 2, // page size to 2 to force multiple calls
			filters: { width: 100 },
			sort: { sortBy: 'width', sortOrder: 'desc' },
		});

		expect(result).toEqual({ data: [{ id: 1 }, { id: 2 }, { id: 3 }] });

		const qsList = getQsCalls();
		expect(qsList.length).toBe(2);
		// Page 1
		expect(qsList[0]).toMatchObject({
			page: 1,
			itemsPerPage: 2,
			'filters[width]': 100,
			'order[width]': 'desc',
		});
		// Page 2
		expect(qsList[1]).toMatchObject({ page: 2, itemsPerPage: 2 });
	});

	it('paged mode returns single page and preserves object response with data', async () => {
		const pages = [
			{ data: [{ id: 'a' }, { id: 'b' }], pagination: { pageCount: 10 } },
		];
		const { mockThis, getQsCalls } = makeMockExec(pages);

		const result = await listWithPagination(mockThis, '/api/corrugated-formats', {
			returnAll: false,
			page: 3,
			limit: 5,
			filters: { length: 200 },
			sort: { sortBy: 'length', sortOrder: 'asc' },
		});

		expect(result).toEqual({ data: [{ id: 'a' }, { id: 'b' }], pagination: { pageCount: 10 } });

		const [qs] = getQsCalls();
		expect(qs).toMatchObject({
			page: 3,
			itemsPerPage: 5,
			'filters[length]': 200,
			'order[length]': 'asc',
		});
	});
});
