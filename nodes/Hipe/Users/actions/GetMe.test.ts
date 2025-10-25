import { execute } from './GetMe';
import type { IExecuteFunctions } from 'n8n-workflow';

describe('Users GetMe action', () => {
	it('calls GET /api/users/me and returns response (happy path)', async () => {
		const mockThis: Partial<IExecuteFunctions> = {
			getCredentials: async () => ({ url: 'https://fake.api' }) as any,
			helpers: {
				requestWithAuthentication: {
					call: jest.fn().mockResolvedValue({ id: 'me', email: 'me@example.com' }),
				} as any,
			} as any,
			getNodeParameter: () => undefined as any,
			continueOnFail: () => false as any,
		};
		const items = [{ json: {} }];
		const result = await (execute as any).call(mockThis, items);
		expect((mockThis.helpers as any).requestWithAuthentication.call).toHaveBeenCalledWith(
			mockThis,
			'hipeApi',
			expect.objectContaining({ method: 'GET', url: 'https://fake.api/api/users/me', json: true }),
		);
		expect(result[0].json).toEqual({ id: 'me', email: 'me@example.com' });
	});

	it('pushes error object when continueOnFail is true', async () => {
		const mockThis: Partial<IExecuteFunctions> = {
			getCredentials: async () => ({ url: 'https://fake.api' }) as any,
			helpers: {
				requestWithAuthentication: {
					call: jest.fn().mockRejectedValue(new Error('boom')),
				} as any,
			} as any,
			getNodeParameter: () => undefined as any,
			continueOnFail: () => true as any,
		};
		const items = [{ json: {} }];
		const result = await (execute as any).call(mockThis, items);
		expect(result[0].json).toEqual({ error: 'boom' });
	});
});
