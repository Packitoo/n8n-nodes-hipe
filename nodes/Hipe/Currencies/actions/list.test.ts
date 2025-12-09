import { execute } from './list';

describe('Currencies list action', () => {
	it('should return all currencies when returnAll is true', async () => {
		const mockThis = {
			getCredentials: async () => ({ url: 'https://fake.api' }),
			helpers: {
				requestWithAuthentication: {
					call: jest.fn().mockResolvedValue([
						{ id: '1', name: 'EURO', code: 'EUR' },
						{ id: '2', name: 'US Dollar', code: 'USD' },
					]),
				},
			},
			getNodeParameter: (name: string, i: number, defaultValue?: any) => {
				const params: { [key: string]: any } = {
					returnAll: true,
					limit: 50,
				};
				return params[name] !== undefined ? params[name] : defaultValue;
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
				url: 'https://fake.api/api/currencies',
				json: true,
			}),
		);
		expect(result).toHaveLength(2);
		expect(result[0].json).toEqual({ id: '1', name: 'EURO', code: 'EUR' });
		expect(result[1].json).toEqual({ id: '2', name: 'US Dollar', code: 'USD' });
	});

	it('should return limited currencies when returnAll is false', async () => {
		const mockThis = {
			getCredentials: async () => ({ url: 'https://fake.api' }),
			helpers: {
				requestWithAuthentication: {
					call: jest.fn().mockResolvedValue([{ id: '1', name: 'EURO', code: 'EUR' }]),
				},
			},
			getNodeParameter: (name: string, i: number, defaultValue?: any) => {
				const params: { [key: string]: any } = {
					returnAll: false,
					limit: 10,
				};
				return params[name] !== undefined ? params[name] : defaultValue;
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
				url: 'https://fake.api/api/currencies',
				json: true,
				qs: {
					limit: 10,
				},
			}),
		);
		expect(result).toHaveLength(1);
	});

	it('should handle response with data property', async () => {
		const mockThis = {
			getCredentials: async () => ({ url: 'https://fake.api' }),
			helpers: {
				requestWithAuthentication: {
					call: jest.fn().mockResolvedValue({
						data: [
							{ id: '1', name: 'EURO', code: 'EUR' },
							{ id: '2', name: 'US Dollar', code: 'USD' },
						],
					}),
				},
			},
			getNodeParameter: (name: string, i: number, defaultValue?: any) => {
				const params: { [key: string]: any } = {
					returnAll: true,
					limit: 50,
				};
				return params[name] !== undefined ? params[name] : defaultValue;
			},
			continueOnFail: () => false,
		} as any;
		const items = [{ json: {} }];
		const result = await execute.call(mockThis, items);
		expect(result).toHaveLength(2);
	});

	it('should handle errors and push error object when continueOnFail is true (edge case)', async () => {
		const mockThis = {
			getCredentials: async () => ({ url: 'https://fake.api' }),
			helpers: {
				requestWithAuthentication: { call: jest.fn().mockRejectedValue(new Error('fail!')) },
			},
			getNodeParameter: (name: string, i: number, defaultValue?: any) => {
				const params: { [key: string]: any } = {
					returnAll: true,
					limit: 50,
				};
				return params[name] !== undefined ? params[name] : defaultValue;
			},
			continueOnFail: () => true,
		} as any;
		const items = [{ json: {} }];
		const result = await execute.call(mockThis, items);
		expect(result[0].json).toEqual({ error: 'fail!' });
	});
});
