import { execute } from './Create';
import type { IExecuteFunctions } from 'n8n-workflow';

describe('Exports Create credential error handling', () => {
	function makeThis(continueOnFail: boolean, creds: any, helpers?: any): IExecuteFunctions {
		return {
			getCredentials: async () => creds,
			getNodeParameter: (name: string) => {
				if (name === 'type') return 1;
				if (name === 'startDate') return '';
				if (name === 'endDate') return '';
				if (name === 'userIds') return {};
				return undefined as any;
			},
			continueOnFail: () => continueOnFail,
			helpers,
		} as any;
	}

	it('throws when base URL is invalid (outside try/catch)', async () => {
		const self = makeThis(true, { url: false as any });
		await expect((execute as any).call(self, [{ json: {} }])).rejects.toThrow(
			'HIPE base URL is not set or is invalid',
		);
	});

	it('throws when base URL is missing protocol', async () => {
		const self = makeThis(true, { url: 'example.com' });
		await expect((execute as any).call(self, [{ json: {} }])).rejects.toThrow(
			'HIPE base URL is not set or is invalid',
		);
	});

	it('continueOnFail=true: returns error object when requestWithAuthentication fails', async () => {
		const self = makeThis(
			true,
			{ url: 'https://hipe.test' },
			{ requestWithAuthentication: jest.fn().mockRejectedValue(new Error('401 Unauthorized')) },
		);
		const res = await (execute as any).call(self, [{ json: {} }]);
		expect(res[0].json).toEqual({ error: '401 Unauthorized' });
	});

	it('continueOnFail=false: bubbles the error when requestWithAuthentication fails', async () => {
		const self = makeThis(
			false,
			{ url: 'https://hipe.test' },
			{ requestWithAuthentication: jest.fn().mockRejectedValue(new Error('403 Forbidden')) },
		);
		await expect((execute as any).call(self, [{ json: {} }])).rejects.toThrow('403 Forbidden');
	});
});
