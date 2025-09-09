import { execute } from './List';
import type { IExecuteFunctions } from 'n8n-workflow';

jest.mock('../../shared/pagination', () => ({
	listWithPagination: jest.fn().mockResolvedValue({ data: [{ id: 'f1' }] }),
}));
const pagination = require('../../shared/pagination');

describe('CorrugatedFormats List uses shared pagination', () => {
	function makeThis(params: Record<string, any>): IExecuteFunctions {
		return {
			getNodeParameter: (name: string) => params[name],
			continueOnFail: () => false,
		} as any;
	}

	it('returnAll true: passes undefined limit and correct endpoint', async () => {
		const self = makeThis({
			returnAll: true,
			filters: { width: 100 },
			sort: { sortBy: 'width', sortOrder: 'desc' },
			page: 1,
		});
		const items = [{ json: {} }];
		const res = await (execute as any).call(self, items);
		expect(pagination.listWithPagination).toHaveBeenCalledWith(self, '/api/corrugated-formats', {
			returnAll: true,
			limit: undefined,
			page: 1,
			filters: { width: 100 },
			sort: { sortBy: 'width', sortOrder: 'desc' },
		});
		expect(res[0].json).toEqual({ data: [{ id: 'f1' }] });
	});

	it('paged: passes page and limit when returnAll is false', async () => {
		const self = makeThis({ returnAll: false, limit: 25, page: 3, filters: {}, sort: {} });
		await (execute as any).call(self, [{ json: {} }]);
		expect(pagination.listWithPagination).toHaveBeenCalledWith(self, '/api/corrugated-formats', {
			returnAll: false,
			limit: 25,
			page: 3,
			filters: {},
			sort: {},
		});
	});
});
