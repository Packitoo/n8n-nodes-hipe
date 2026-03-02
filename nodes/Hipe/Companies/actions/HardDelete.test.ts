import { execute } from './HardDelete';
import type { IExecuteFunctions } from 'n8n-workflow';

describe('Companies HardDelete action', () => {
	it('calls DELETE /api/companies/:id and returns response (happy path)', async () => {
		const mockThis: Partial<IExecuteFunctions> = {
			getCredentials: async () => ({ url: 'https://fake.api' }) as any,
			helpers: {
				requestWithAuthentication: {
					call: jest.fn().mockResolvedValue({ success: true }),
				} as any,
			} as any,
			getNodeParameter: (name: string) => {
				if (name === 'id') return '123';
				return undefined as any;
			},
			continueOnFail: () => false as any,
		};
		const items = [{ json: {} }];
		const result = await (execute as any).call(mockThis, items);
		expect((mockThis.helpers as any).requestWithAuthentication.call).toHaveBeenCalledWith(
			mockThis,
			'hipeApi',
			expect.objectContaining({
				method: 'DELETE',
				url: 'https://fake.api/api/companies/123',
				json: true,
			}),
		);
		expect(result[0].json).toEqual({ success: true });
	});

	it('pushes error object when continueOnFail is true', async () => {
		const mockThis: Partial<IExecuteFunctions> = {
			getCredentials: async () => ({ url: 'https://fake.api' }) as any,
			helpers: {
				requestWithAuthentication: {
					call: jest.fn().mockRejectedValue(new Error('boom')),
				} as any,
			} as any,
			getNodeParameter: () => '123' as any,
			continueOnFail: () => true as any,
		};
		const items = [{ json: {} }];
		const result = await (execute as any).call(mockThis, items);
		expect(result[0].json).toEqual({ error: 'boom' });
	});
});
