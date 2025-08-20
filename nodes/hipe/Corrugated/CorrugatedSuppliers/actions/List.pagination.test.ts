import { execute } from './List';
import type { IExecuteFunctions } from 'n8n-workflow';

jest.mock('../../shared/pagination', () => ({
	listWithPagination: jest.fn().mockResolvedValue({ data: [{ id: 's1' }] }),
}));
const pagination = require('../../shared/pagination');

describe('CorrugatedSuppliers List uses shared pagination', () => {
	function makeThis(params: Record<string, any>): IExecuteFunctions {
		return {
			getNodeParameter: (name: string) => params[name],
			continueOnFail: () => false,
		} as any;
	}

	it('returnAll true: passes undefined limit and correct endpoint', async () => {
		const self = makeThis({ returnAll: true, filters: { name: 'ACME' }, sort: { sortBy: 'name', sortOrder: 'asc' }, page: 1 });
		const res = await (execute as any).call(self, [{ json: {} }]);
		expect(pagination.listWithPagination).toHaveBeenCalledWith(self, '/api/corrugated-suppliers', {
			returnAll: true,
			limit: undefined,
			page: 1,
			filters: { name: 'ACME' },
			sort: { sortBy: 'name', sortOrder: 'asc' },
		});
		expect(res[0].json).toEqual({ data: [{ id: 's1' }] });
	});

	it('paged: passes page and limit when returnAll is false', async () => {
		const self = makeThis({ returnAll: false, limit: 12, page: 7, filters: {}, sort: {} });
		await (execute as any).call(self, [{ json: {} }]);
		expect(pagination.listWithPagination).toHaveBeenCalledWith(self, '/api/corrugated-suppliers', {
			returnAll: false,
			limit: 12,
			page: 7,
			filters: {},
			sort: {},
		});
	});
});
