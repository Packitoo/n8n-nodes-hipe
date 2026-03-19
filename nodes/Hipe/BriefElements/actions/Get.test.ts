import { execute } from './Get';

describe('BriefElements Get action', () => {
	it('should call the correct endpoint and return the brief element (happy path)', async () => {
		const mockThis = {
			getCredentials: async () => ({ url: 'https://fake.api' }),
			helpers: {
				requestWithAuthentication: {
					call: jest.fn().mockResolvedValue({
						id: 'be-1',
						briefId: 'brief-1',
						lengthDimension: 100,
						widthDimension: 50,
						heightDimension: 30,
					}),
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
				method: 'GET',
				url: 'https://fake.api/api/brief-elements/be-1',
				json: true,
			}),
		);
		expect(result[0].json).toEqual(expect.objectContaining({ id: 'be-1' }));
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
