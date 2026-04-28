import { execute } from './Update';

describe('BriefElements Update action', () => {
	it('should call the correct endpoint with dimensions, alias, and update fields (happy path)', async () => {
		const mockThis = {
			getCredentials: async () => ({ url: 'https://fake.api' }),
			helpers: {
				requestWithAuthentication: {
					call: jest.fn().mockResolvedValue({
						id: 'be-1',
						lengthDimension: 100,
						widthDimension: 50,
						heightDimension: 30,
						alias: { length: 100, width: 50, height: 30 },
					}),
				},
			},
			getNodeParameter: (name: string, _i: number, fallback?: unknown) => {
				const params: Record<string, unknown> = {
					id: 'be-1',
					lengthDimension: 100,
					widthDimension: 50,
					heightDimension: 30,
					updateFields: { position: 2 },
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
				method: 'PATCH',
				url: 'https://fake.api/api/brief-elements/be-1',
				json: true,
				body: {
					position: 2,
					lengthDimension: 100,
					widthDimension: 50,
					heightDimension: 30,
					alias: { length: 100, width: 50, height: 30 },
				},
			}),
		);
		expect(result[0].json).toEqual(expect.objectContaining({ id: 'be-1' }));
	});

	it('should omit zero-valued dimensions from the body and alias', async () => {
		const mockThis = {
			getCredentials: async () => ({ url: 'https://fake.api' }),
			helpers: {
				requestWithAuthentication: {
					call: jest.fn().mockResolvedValue({ id: 'be-2' }),
				},
			},
			getNodeParameter: (name: string, _i: number, fallback?: unknown) => {
				const params: Record<string, unknown> = {
					id: 'be-2',
					lengthDimension: 200,
					widthDimension: 0,
					heightDimension: 0,
					updateFields: {},
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
				body: {
					lengthDimension: 200,
					alias: { length: 200 },
				},
			}),
		);
	});

	it('should not include alias when all dimensions are zero', async () => {
		const mockThis = {
			getCredentials: async () => ({ url: 'https://fake.api' }),
			helpers: {
				requestWithAuthentication: {
					call: jest.fn().mockResolvedValue({ id: 'be-3' }),
				},
			},
			getNodeParameter: (name: string, _i: number, fallback?: unknown) => {
				const params: Record<string, unknown> = {
					id: 'be-3',
					lengthDimension: 0,
					widthDimension: 0,
					heightDimension: 0,
					updateFields: { position: 1 },
				};
				return params[name] ?? fallback;
			},
			continueOnFail: () => false,
		} as any;

		const items = [{ json: {} }];
		await execute.call(mockThis, items);

		const callArgs = (mockThis.helpers.requestWithAuthentication.call as any).mock.calls[0][2];
		expect(callArgs.body.alias).toBeUndefined();
		expect(callArgs.body).toEqual({ position: 1 });
	});

	it('should omit null updateFields keys from PATCH body', async () => {
		const mockThis = {
			getCredentials: async () => ({ url: 'https://fake.api' }),
			helpers: {
				requestWithAuthentication: {
					call: jest.fn().mockResolvedValue({ id: 'be-1' }),
				},
			},
			getNodeParameter: (name: string, _i: number, fallback?: unknown) => {
				const params: Record<string, unknown> = {
					id: 'be-1',
					lengthDimension: 0,
					widthDimension: 0,
					heightDimension: 0,
					updateFields: {
						position: null,
						productId: 'prod-1',
						briefId: null,
					},
				};
				return params[name] ?? fallback;
			},
			continueOnFail: () => false,
		} as any;

		const items = [{ json: {} }];
		await execute.call(mockThis, items);

		const callArgs = (mockThis.helpers.requestWithAuthentication.call as any).mock.calls[0][2];
		expect(callArgs.body).toEqual({ productId: 'prod-1' });
		expect(callArgs.body).not.toHaveProperty('position');
		expect(callArgs.body).not.toHaveProperty('briefId');
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
					id: 'be-1',
					lengthDimension: 0,
					widthDimension: 0,
					heightDimension: 0,
					updateFields: {},
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
