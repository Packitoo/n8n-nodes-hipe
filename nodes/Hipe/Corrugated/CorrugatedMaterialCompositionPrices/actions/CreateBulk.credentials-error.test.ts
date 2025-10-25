import { execute } from './CreateBulk';
import type { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';

describe('MaterialCompositionPrices CreateBulk credential error handling', () => {
	function makeThis(
		continueOnFail: boolean,
		creds: any,
		helpers?: any,
		options: any = {},
	): IExecuteFunctions {
		return {
			getCredentials: async () => creds,
			getNodeParameter: (name: string) => {
				if (name === 'inputDataField') return 'data';
				if (name === 'options') return options;
				return undefined as any;
			},
			continueOnFail: () => continueOnFail,
			helpers,
		} as any;
	}

	const items: INodeExecutionData[] = [{ json: { data: [{ price: 1 }] } }];

	it('throws when base URL is invalid (outside try/catch)', async () => {
		const self = makeThis(true, { url: 123 as any });
		await expect((execute as any).call(self, items)).rejects.toThrow(
			'HIPE base URL is not a string',
		);
	});

	it('continueOnFail=true: returns error object when requestWithAuthentication fails (invalid token)', async () => {
		const self = makeThis(
			true,
			{ url: 'https://hipe.test' },
			{ requestWithAuthentication: jest.fn().mockRejectedValue(new Error('401 Unauthorized')) },
		);
		const res = await (execute as any).call(self, items);
		expect(res[0].json).toEqual({ error: '401 Unauthorized' });
	});

	it('continueOnFail=false: bubbles the error when requestWithAuthentication fails', async () => {
		const self = makeThis(
			false,
			{ url: 'https://hipe.test' },
			{ requestWithAuthentication: jest.fn().mockRejectedValue(new Error('401 Unauthorized')) },
		);
		await expect((execute as any).call(self, items)).rejects.toThrow('401 Unauthorized');
	});
});
