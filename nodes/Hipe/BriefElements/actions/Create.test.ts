import { execute } from './Create';

describe('BriefElements Create action', () => {
	it('should call the correct endpoint with dimensions, alias, and fields (happy path)', async () => {
		const mockThis = {
			getCredentials: async () => ({ url: 'https://fake.api' }),
			helpers: {
				requestWithAuthentication: {
					call: jest.fn().mockResolvedValue({
						id: 'be-1',
						briefId: 'brief-1',
						position: 1,
						productCategoryId: 'cat-1',
						productId: 'prod-1',
						lengthDimension: 100,
						widthDimension: 50,
						heightDimension: 30,
						alias: { length: 100, width: 50, height: 30 },
					}),
				},
			},
			getNodeParameter: (name: string, _i: number, fallback?: unknown) => {
				const params: Record<string, unknown> = {
					briefId: 'brief-1',
					position: 1,
					productCategoryId: 'cat-1',
					productId: 'prod-1',
					lengthDimension: 100,
					widthDimension: 50,
					heightDimension: 30,
					decorationsCount: '[{"quantity":1000}]',
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
				url: 'https://fake.api/api/brief-elements',
				json: true,
				body: {
					briefId: 'brief-1',
					position: 1,
					productCategoryId: 'cat-1',
					productId: 'prod-1',
					decorationsCount: [{ quantity: 1000 }],
					lengthDimension: 100,
					widthDimension: 50,
					heightDimension: 30,
					alias: { length: 100, width: 50, height: 30 },
				},
			}),
		);
		expect(result[0].json).toEqual(expect.objectContaining({ id: 'be-1' }));
	});

	it('should omit zero-valued dimensions and empty fields from the body', async () => {
		const mockThis = {
			getCredentials: async () => ({ url: 'https://fake.api' }),
			helpers: {
				requestWithAuthentication: {
					call: jest.fn().mockResolvedValue({ id: 'be-2' }),
				},
			},
			getNodeParameter: (name: string, _i: number, fallback?: unknown) => {
				const params: Record<string, unknown> = {
					briefId: 'brief-1',
					position: 0,
					productCategoryId: 'cat-1',
					productId: 'prod-1',
					lengthDimension: 200,
					widthDimension: 0,
					heightDimension: 0,
					decorationsCount: '[]',
				};
				return params[name] ?? fallback;
			},
			continueOnFail: () => false,
		} as any;

		const items = [{ json: {} }];
		await execute.call(mockThis, items);

		const callArgs = (mockThis.helpers.requestWithAuthentication.call as any).mock.calls[0][2];
		expect(callArgs.body.lengthDimension).toBe(200);
		expect(callArgs.body.alias).toEqual({ length: 200 });
		expect(callArgs.body.widthDimension).toBeUndefined();
		expect(callArgs.body.heightDimension).toBeUndefined();
		// position 0 is falsy, so omitted
		expect(callArgs.body.decorationsCount).toBeUndefined();
	});

	it('should send empty body when all fields are defaults', async () => {
		const mockThis = {
			getCredentials: async () => ({ url: 'https://fake.api' }),
			helpers: {
				requestWithAuthentication: {
					call: jest.fn().mockResolvedValue({ id: 'be-3' }),
				},
			},
			getNodeParameter: (name: string, _i: number, fallback?: unknown) => {
				const params: Record<string, unknown> = {
					briefId: '',
					position: 0,
					productCategoryId: '',
					productId: '',
					lengthDimension: 0,
					widthDimension: 0,
					heightDimension: 0,
					decorationsCount: '[]',
				};
				return params[name] ?? fallback;
			},
			continueOnFail: () => false,
		} as any;

		const items = [{ json: {} }];
		await execute.call(mockThis, items);

		const callArgs = (mockThis.helpers.requestWithAuthentication.call as any).mock.calls[0][2];
		expect(callArgs.body).toEqual({});
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
					briefId: 'brief-1',
					position: 0,
					productCategoryId: 'cat-1',
					productId: 'prod-1',
					lengthDimension: 0,
					widthDimension: 0,
					heightDimension: 0,
					decorationsCount: '[]',
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
