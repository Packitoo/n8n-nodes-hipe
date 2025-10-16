import { execute } from './List';
import type { IExecuteFunctions } from 'n8n-workflow';

jest.mock('../../shared/pagination', () => ({
	listWithPagination: jest.fn().mockResolvedValue({ data: [{ id: 'price1' }] }),
}));
const pagination = require('../../shared/pagination');

describe('CorrugatedMaterialCompositionPrices List uses shared pagination', () => {
	function makeThis(params: Record<string, any>): IExecuteFunctions {
		return {
			getNodeParameter: (name: string) => params[name],
			continueOnFail: () => false,
		} as any;
	}

	it('returnAll true: passes undefined limit and correct endpoint', async () => {
		const self = makeThis({
			returnAll: true,
			filters: { currency: 'EUR' },
			sort: { sortBy: 'validFrom', sortOrder: 'asc' },
			page: 1,
		});
		const res = await (execute as any).call(self, [{ json: {} }]);
		expect(pagination.listWithPagination).toHaveBeenCalledWith(
			self,
			'/api/corrugated-material-composition-prices',
			{
				returnAll: true,
				limit: undefined,
				page: 1,
				filters: { currency: 'EUR' },
				sort: { sortBy: 'validFrom', sortOrder: 'asc' },
			},
		);
		expect(res[0].json).toEqual({ data: [{ id: 'price1' }] });
	});

	it('paged: passes page and limit when returnAll is false', async () => {
		const self = makeThis({ returnAll: false, limit: 40, page: 2, filters: {}, sort: {} });
		await (execute as any).call(self, [{ json: {} }]);
		expect(pagination.listWithPagination).toHaveBeenCalledWith(
			self,
			'/api/corrugated-material-composition-prices',
			{
				returnAll: false,
				limit: 40,
				page: 2,
				filters: {},
				sort: {},
			},
		);
	});
});
