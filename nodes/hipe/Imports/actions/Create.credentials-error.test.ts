import { execute } from './Create';
import type { IExecuteFunctions } from 'n8n-workflow';

describe('Imports Create credential error handling', () => {
	function makeThis(continueOnFail: boolean, creds: any, helpers?: any): IExecuteFunctions {
		return {
			getCredentials: async () => creds,
			getNodeParameter: (name: string) => {
				if (name === 'type') return 1;
				if (name === 'delimiter') return ',';
				if (name === 'binaryPropertyName') return 'data';
				return undefined as any;
			},
			continueOnFail: () => continueOnFail,
			helpers,
		} as any;
	}

	it('throws when base URL is invalid (outside try/catch)', async () => {
		const self = makeThis(true, { url: 123 as any });
		const items = [{ json: {}, binary: { data: { fileName: 'test.csv' } } }];
		await expect((execute as any).call(self, items)).rejects.toThrow(
			'HIPE base URL is not set or is invalid',
		);
	});

	it('throws when base URL is missing protocol', async () => {
		const self = makeThis(true, { url: 'fake.api' });
		const items = [{ json: {}, binary: { data: { fileName: 'test.csv' } } }];
		await expect((execute as any).call(self, items)).rejects.toThrow(
			'HIPE base URL is not set or is invalid',
		);
	});

	it('continueOnFail=true: returns error object when requestWithAuthentication fails', async () => {
		const mockBuffer = Buffer.from('test');
		const self = makeThis(
			true,
			{ url: 'https://hipe.test' },
			{
				requestWithAuthentication: jest.fn().mockRejectedValue(new Error('401 Unauthorized')),
				getBinaryDataBuffer: jest.fn().mockResolvedValue(mockBuffer),
			},
		);
		const items = [{ json: {}, binary: { data: { fileName: 'test.csv' } } }];
		const res = await (execute as any).call(self, items);
		expect(res[0].json).toEqual({ error: '401 Unauthorized' });
	});

	it('continueOnFail=false: bubbles the error when requestWithAuthentication fails', async () => {
		const mockBuffer = Buffer.from('test');
		const self = makeThis(
			false,
			{ url: 'https://hipe.test' },
			{
				requestWithAuthentication: jest.fn().mockRejectedValue(new Error('401 Unauthorized')),
				getBinaryDataBuffer: jest.fn().mockResolvedValue(mockBuffer),
			},
		);
		const items = [{ json: {}, binary: { data: { fileName: 'test.csv' } } }];
		await expect((execute as any).call(self, items)).rejects.toThrow('401 Unauthorized');
	});

	it('continueOnFail=true: returns error object when getBinaryDataBuffer fails', async () => {
		const self = makeThis(
			true,
			{ url: 'https://hipe.test' },
			{
				requestWithAuthentication: jest.fn(),
				getBinaryDataBuffer: jest.fn().mockRejectedValue(new Error('Binary data error')),
			},
		);
		const items = [{ json: {}, binary: { data: { fileName: 'test.csv' } } }];
		const res = await (execute as any).call(self, items);
		expect(res[0].json).toEqual({ error: 'Binary data error' });
	});
});
