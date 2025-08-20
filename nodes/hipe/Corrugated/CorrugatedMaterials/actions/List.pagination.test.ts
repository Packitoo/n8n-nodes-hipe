import { execute } from './List';
import type { IExecuteFunctions } from 'n8n-workflow';

jest.mock('../../shared/pagination', () => ({
	listWithPagination: jest.fn().mockResolvedValue({ data: [{ id: 'm1' }] }),
}));
const pagination = require('../../shared/pagination');

describe('CorrugatedMaterials List uses shared pagination', () => {
	function makeThis(params: Record<string, any>): IExecuteFunctions {
		return {
			getNodeParameter: (name: string) => params[name],
			continueOnFail: () => false,
		} as any;
	}

	it('returnAll true: passes undefined limit and correct endpoint', async () => {
		const self = makeThis({ returnAll: true, filters: { name: 'Kraft' }, sort: { sortBy: 'name', sortOrder: 'asc' }, page: 1 });
		const res = await (execute as any).call(self, [{ json: {} }]);
		expect(pagination.listWithPagination).toHaveBeenCalledWith(self, '/api/corrugated-materials', {
			returnAll: true,
			limit: undefined,
			page: 1,
			filters: { name: 'Kraft' },
			sort: { sortBy: 'name', sortOrder: 'asc' },
		});
		expect(res[0].json).toEqual({ data: [{ id: 'm1' }] });
	});

	it('paged: passes page and limit when returnAll is false', async () => {
		const self = makeThis({ returnAll: false, limit: 20, page: 5, filters: {}, sort: {} });
		await (execute as any).call(self, [{ json: {} }]);
		expect(pagination.listWithPagination).toHaveBeenCalledWith(self, '/api/corrugated-materials', {
			returnAll: false,
			limit: 20,
			page: 5,
			filters: {},
			sort: {},
		});
	});
});
