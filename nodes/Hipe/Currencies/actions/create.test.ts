import { execute } from './create';

describe('Currencies create action', () => {
	it('should call helpers.requestWithAuthentication and return correct data (happy path)', async () => {
		const mockThis = {
			getCredentials: async () => ({ url: 'https://fake.api' }),
			helpers: {
				requestWithAuthentication: { call: jest.fn().mockResolvedValue({ created: true }) },
			},
			getNodeParameter: (name: string, i: number, defaultValue?: any) => {
				const params: { [key: string]: any } = {
					name: 'EURO',
					code: 'EUR',
					symbol: '€',
					countryCode: 'eu',
					externalId: 'ext-123',
					enable: true,
					default: false,
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
				method: 'POST',
				url: 'https://fake.api/api/currencies',
				json: true,
				body: expect.objectContaining({
					name: 'EURO',
					code: 'EUR',
					symbol: '€',
					countryCode: 'eu',
					externalId: 'ext-123',
					enable: true,
					default: false,
				}),
			}),
		);
		expect(result[0].json).toEqual({ created: true });
	});

	it('should handle optional fields correctly', async () => {
		const mockThis = {
			getCredentials: async () => ({ url: 'https://fake.api' }),
			helpers: {
				requestWithAuthentication: { call: jest.fn().mockResolvedValue({ created: true }) },
			},
			getNodeParameter: (name: string, i: number, defaultValue?: any) => {
				const params: { [key: string]: any } = {
					name: 'EURO',
					code: 'EUR',
					symbol: '€',
					countryCode: '',
					externalId: '',
					enable: true,
					default: false,
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
			{
				method: 'POST',
				url: 'https://fake.api/api/currencies',
				json: true,
				body: {
					name: 'EURO',
					code: 'EUR',
					symbol: '€',
					countryCode: '',
					externalId: '',
					enable: true,
					default: false,
				},
			},
		);
		expect(result[0].json).toEqual({ created: true });
	});

	it('should handle errors and push error object when continueOnFail is true (edge case)', async () => {
		const mockThis = {
			getCredentials: async () => ({ url: 'https://fake.api' }),
			helpers: {
				requestWithAuthentication: { call: jest.fn().mockRejectedValue(new Error('fail!')) },
			},
			getNodeParameter: (name: string, i: number, defaultValue?: any) => {
				const params: { [key: string]: any } = {
					name: 'EURO',
					code: 'EUR',
					symbol: '€',
					countryCode: '',
					externalId: '',
					enable: true,
					default: false,
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
