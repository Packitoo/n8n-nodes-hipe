import { execute } from './Get';
import type { IExecuteFunctions } from 'n8n-workflow';

describe('Imports Get credential error handling', () => {
	function makeThis(continueOnFail: boolean, creds: any, helpers?: any): IExecuteFunctions {
		return {
			getCredentials: async () => creds,
			getNodeParameter: (name: string) => {
				if (name === 'id') return 'import-123';
				return undefined as any;
			},
			continueOnFail: () => continueOnFail,
			helpers,
		} as any;
	}

	it('throws when base URL is invalid (outside try/catch)', async () => {
		const self = makeThis(true, { url: null as any });
		await expect((execute as any).call(self, [{ json: {} }])).rejects.toThrow(
			'HIPE base URL is not set or is invalid',
		);
	});

	it('throws when base URL is not a string', async () => {
		const self = makeThis(true, { url: 456 as any });
		await expect((execute as any).call(self, [{ json: {} }])).rejects.toThrow(
			'HIPE base URL is not set or is invalid',
		);
	});

	it('continueOnFail=true: returns error object when requestWithAuthentication fails', async () => {
		const self = makeThis(
			true,
			{ url: 'https://hipe.test' },
			{ requestWithAuthentication: jest.fn().mockRejectedValue(new Error('403 Forbidden')) },
		);
		const res = await (execute as any).call(self, [{ json: {} }]);
		expect(res[0].json).toEqual({ error: '403 Forbidden' });
	});

	it('continueOnFail=false: bubbles the error when requestWithAuthentication fails', async () => {
		const self = makeThis(
			false,
			{ url: 'https://hipe.test' },
			{
				requestWithAuthentication: jest
					.fn()
					.mockRejectedValue(new Error('500 Internal Server Error')),
			},
		);
		await expect((execute as any).call(self, [{ json: {} }])).rejects.toThrow(
			'500 Internal Server Error',
		);
	});
});
