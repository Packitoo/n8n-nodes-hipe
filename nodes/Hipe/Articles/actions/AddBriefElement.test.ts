import { execute } from './AddBriefElement';

describe('Articles AddBriefElement action', () => {
	it('should call the correct endpoint with dimensions and return the article (happy path)', async () => {
		const mockThis = {
			getCredentials: async () => ({ url: 'https://fake.api' }),
			helpers: {
				requestWithAuthentication: {
					call: jest.fn().mockResolvedValue({
						id: 'article-1',
						name: 'Test Article',
						briefElement: {
							id: 'be-1',
							lengthDimension: 100,
							widthDimension: 50,
							heightDimension: 30,
						},
					}),
				},
			},
			getNodeParameter: (name: string, _i: number, fallback?: unknown) => {
				const params: Record<string, unknown> = {
					id: 'article-1',
					lengthDimension: 100,
					widthDimension: 50,
					heightDimension: 30,
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
				method: 'POST',
				url: 'https://fake.api/api/articles/article-1/brief-element',
				json: true,
				body: {
					lengthDimension: 100,
					widthDimension: 50,
					heightDimension: 30,
				},
			}),
		);
		expect(result[0].json).toEqual(expect.objectContaining({ id: 'article-1' }));
	});

	it('should omit zero-valued dimensions from the body', async () => {
		const mockThis = {
			getCredentials: async () => ({ url: 'https://fake.api' }),
			helpers: {
				requestWithAuthentication: {
					call: jest.fn().mockResolvedValue({ id: 'article-2' }),
				},
			},
			getNodeParameter: (name: string, _i: number, fallback?: unknown) => {
				const params: Record<string, unknown> = {
					id: 'article-2',
					lengthDimension: 200,
					widthDimension: 0,
					heightDimension: 0,
				};
				return params[name] ?? fallback;
			},
			continueOnFail: () => false,
		} as any;

		const items = [{ json: {} }];
		await execute.call(mockThis, items);

		expect(mockThis.helpers.requestWithAuthentication.call).toHaveBeenCalledWith(
			mockThis,
			'hipeApi',
			expect.objectContaining({
				body: { lengthDimension: 200 },
			}),
		);
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
					id: 'article-1',
					lengthDimension: 0,
					widthDimension: 0,
					heightDimension: 0,
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
