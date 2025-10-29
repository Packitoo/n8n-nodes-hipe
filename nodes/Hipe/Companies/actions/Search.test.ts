import { execute } from './Search';
import type { IExecuteFunctions } from 'n8n-workflow';

describe('Companies Search action', () => {
	it('calls GET /api/companies with search query and limit', async () => {
		const requestMock = jest.fn().mockResolvedValue({ data: [{ id: '1' }] });
		const mockThis: Partial<IExecuteFunctions> = {
			getCredentials: async () => ({ url: 'https://fake.api/' }) as any,
			helpers: {
				requestWithAuthentication: {
					call: requestMock,
				} as any,
			} as any,
			getNodeParameter: (name: string) => {
				if (name === 'search') return 'Acme';
				if (name === 'limit') return 25;
				return undefined as any;
			},
			continueOnFail: () => false as any,
		};

		const items = [{ json: {} }];
		const result = await (execute as any).call(mockThis, items);

		const [call] = (requestMock as jest.Mock).mock.calls;
		expect(call[0]).toBe(mockThis);
		expect(call[1]).toBe('hipeApi');
		expect(call[2]).toMatchObject({
			method: 'GET',
			url: 'https://fake.api/api/companies',
			json: true,
			qs: { limit: 25, s: 'Acme' },
		});
		expect(result[0].json).toEqual({ data: [{ id: '1' }] });
	});

	it('pushes error object when continueOnFail is true', async () => {
		const requestMock = jest.fn().mockRejectedValue(new Error('boom'));
		const mockThis: Partial<IExecuteFunctions> = {
			getCredentials: async () => ({ url: 'https://fake.api' }) as any,
			helpers: {
				requestWithAuthentication: {
					call: requestMock,
				} as any,
			} as any,
			getNodeParameter: (name: string) => {
				if (name === 'search') return '';
				if (name === 'limit') return 10;
				return undefined as any;
			},
			continueOnFail: () => true as any,
		};

		const items = [{ json: {} }];
		const result = await (execute as any).call(mockThis, items);

		expect(result[0].json).toEqual({ error: 'boom' });
	});
});
