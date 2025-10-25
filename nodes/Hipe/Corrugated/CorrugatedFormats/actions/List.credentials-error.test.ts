import { execute } from './List';
import type { IExecuteFunctions } from 'n8n-workflow';

jest.mock('../../shared/pagination', () => ({
	listWithPagination: jest.fn(),
}));
const pagination = require('../../shared/pagination');

describe('CorrugatedFormats List credential error handling', () => {
	function makeThis(params: Record<string, any>, continueOnFail: boolean): IExecuteFunctions {
		return {
			getNodeParameter: (name: string) => params[name],
			continueOnFail: () => continueOnFail,
		} as any;
	}

	beforeEach(() => jest.clearAllMocks());

	it('continueOnFail=true: returns error object when pagination throws', async () => {
		pagination.listWithPagination.mockRejectedValueOnce(new Error('HIPE base URL is not a string'));
		const self = makeThis({ returnAll: false, limit: 10, page: 1, filters: {}, sort: {} }, true);
		const res = await (execute as any).call(self, [{ json: {} }]);
		expect(res[0].json).toEqual({ error: 'HIPE base URL is not a string' });
	});

	it('continueOnFail=false: bubbles the error', async () => {
		pagination.listWithPagination.mockRejectedValueOnce(new Error('HIPE base URL is not a string'));
		const self = makeThis({ returnAll: false, limit: 10, page: 1, filters: {}, sort: {} }, false);
		await expect((execute as any).call(self, [{ json: {} }])).rejects.toThrow(
			'HIPE base URL is not a string',
		);
	});
});
