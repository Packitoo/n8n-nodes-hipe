import { execute } from './List';
import type { IExecuteFunctions } from 'n8n-workflow';

jest.mock('../../shared/pagination', () => ({
	listWithPagination: jest.fn().mockResolvedValue({ data: [{ id: 'ln1' }] }),
}));
const pagination = require('../../shared/pagination');

describe('CorrugatedLiners List uses shared pagination', () => {
	function makeThis(params: Record<string, any>): IExecuteFunctions {
		return {
			getNodeParameter: (name: string) => params[name],
			continueOnFail: () => false,
		} as any;
	}

	it('returnAll true: passes undefined limit and correct endpoint', async () => {
		const self = makeThis({
			returnAll: true,
			filters: { name: 'K', weight: 100 },
			sort: { sortBy: 'name', sortOrder: 'desc' },
			page: 1,
		});
		const res = await (execute as any).call(self, [{ json: {} }]);
		expect(pagination.listWithPagination).toHaveBeenCalledWith(self, '/api/corrugated-liners', {
			returnAll: true,
			limit: undefined,
			page: 1,
			filters: { name: 'K', weight: 100 },
			sort: { sortBy: 'name', sortOrder: 'desc' },
		});
		expect(res[0].json).toEqual({ data: [{ id: 'ln1' }] });
	});

	it('paged: passes page and limit when returnAll is false', async () => {
		const self = makeThis({ returnAll: false, limit: 15, page: 4, filters: {}, sort: {} });
		await (execute as any).call(self, [{ json: {} }]);
		expect(pagination.listWithPagination).toHaveBeenCalledWith(self, '/api/corrugated-liners', {
			returnAll: false,
			limit: 15,
			page: 4,
			filters: {},
			sort: {},
		});
	});
});
