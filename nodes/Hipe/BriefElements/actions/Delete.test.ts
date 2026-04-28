import { execute } from './Delete';

describe('BriefElements Delete action', () => {
	it('should call the correct endpoint and return the response (happy path)', async () => {
		const mockThis = {
			getCredentials: async () => ({ url: 'https://fake.api' }),
			helpers: {
				requestWithAuthentication: {
					call: jest.fn().mockResolvedValue({ success: true }),
				},
			},
			getNodeParameter: (name: string, _i: number, fallback?: unknown) => {
				const params: Record<string, unknown> = {
					briefElementId: 'be-1',
				};
				return params[name] ?? fallback;
			},
			continueOnFail: () => false,
		} as any;

		const items = [{ json: {} }];
		const result = await execute.call(mockThis, items);

		expect(mockThis.helpers.requestWithAuthentication.call).toHaveBeenCalledWith(
			mockThis,
			'hipeApi',
			expect.objectContaining({
				method: 'DELETE',
				url: 'https://fake.api/api/brief-elements/be-1',
				json: true,
			}),
		);
		expect(result[0].json).toEqual({ success: true });
	});

	it('should return success true when response is null/undefined', async () => {
		const mockThis = {
			getCredentials: async () => ({ url: 'https://fake.api' }),
			helpers: {
				requestWithAuthentication: {
					call: jest.fn().mockResolvedValue(undefined),
				},
			},
			getNodeParameter: (name: string, _i: number, fallback?: unknown) => {
				const params: Record<string, unknown> = {
					briefElementId: 'be-1',
				};
				return params[name] ?? fallback;
			},
			continueOnFail: () => false,
		} as any;

		const items = [{ json: {} }];
		const result = await execute.call(mockThis, items);
		expect(result[0].json).toEqual({ success: true });
	});

	it('should handle errors and push error object when continueOnFail is true', async () => {
		const mockThis = {
			getCredentials: async () => ({ url: 'https://fake.api' }),
			helpers: {
				requestWithAuthentication: {
					call: jest.fn().mockRejectedValue(new Error('fail!')),
				},
			},
			getNodeParameter: (name: string, _i: number, fallback?: unknown) => {
				const params: Record<string, unknown> = {
					briefElementId: 'be-1',
				};
				return params[name] ?? fallback;
			},
			continueOnFail: () => true,
		} as any;

		const items = [{ json: {} }];
		const result = await execute.call(mockThis, items);
		expect(result[0].json).toEqual({ error: 'fail!' });
	});
});
