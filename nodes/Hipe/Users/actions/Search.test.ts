import { execute } from './Search';
import type { IExecuteFunctions } from 'n8n-workflow';

describe('Users Search action', () => {
	it('calls GET /api/users/search with qs and wraps array response', async () => {
		const mockThis: Partial<IExecuteFunctions> = {
			getCredentials: async () => ({ url: 'https://fake.api' }) as any,
			helpers: {
				requestWithAuthentication: {
					call: jest.fn().mockResolvedValue([{ id: '1' }, { id: '2' }]),
				} as any,
			} as any,
			getNodeParameter: (name: string) => {
				if (name === 's') return '{"name":{"$contL":"john"}}';
				if (name === 'limit') return 25;
				return undefined as any;
			},
			continueOnFail: () => false as any,
		};
		const items = [{ json: {} }];
		const result = await (execute as any).call(mockThis, items);
		const call = ((mockThis.helpers as any).requestWithAuthentication.call as jest.Mock).mock
			.calls[0];
		expect(call[0]).toBe(mockThis);
		expect(call[1]).toBe('hipeApi');
		expect(call[2]).toMatchObject({
			method: 'GET',
			url: 'https://fake.api/api/users/search',
			qs: { s: '{"name":{"$contL":"john"}}', limit: 25 },
			json: true,
		});
		expect(result[0].json).toEqual({ data: [{ id: '1' }, { id: '2' }] });
	});

	it('pushes error object when continueOnFail is true', async () => {
		const mockThis: Partial<IExecuteFunctions> = {
			getCredentials: async () => ({ url: 'https://fake.api' }) as any,
			helpers: {
				requestWithAuthentication: {
					call: jest.fn().mockRejectedValue(new Error('boom')),
				} as any,
			} as any,
			getNodeParameter: (name: string) => (name === 's' ? '{}' : 10) as any,
			continueOnFail: () => true as any,
		};
		const items = [{ json: {} }];
		const result = await (execute as any).call(mockThis, items);
		expect(result[0].json).toEqual({ error: 'boom' });
	});
});
