import { execute } from './Create';

describe('Articles Create action', () => {
	it('should call helpers.requestWithAuthentication and return correct data (happy path)', async () => {
		const mockThis = {
			getCredentials: async () => ({ url: 'https://fake.api' }),
			helpers: {
				requestWithAuthentication: {
					call: jest.fn().mockResolvedValue({ id: '1', name: 'Test Article', code: 'ART-001' }),
				},
			},
			getNodeParameter: (name: string, i: number) => {
				const params = {
					name: 'Test Article',
					code: 'ART-001',
					additionalFields: {
						price: 99.99,
						companyId: 'comp-1',
						currencyId: 'curr-1',
						enabled: true,
					},
				};
				return (params as any)[name];
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
				url: 'https://fake.api/api/articles',
				json: true,
				body: expect.objectContaining({
					name: 'Test Article',
					code: 'ART-001',
					price: 99.99,
					companyId: 'comp-1',
					currencyId: 'curr-1',
					enabled: true,
				}),
			}),
		);
		expect(result[0].json).toEqual({ id: '1', name: 'Test Article', code: 'ART-001' });
	});

	it('should handle errors and push error object when continueOnFail is true', async () => {
		const mockThis = {
			getCredentials: async () => ({ url: 'https://fake.api' }),
			helpers: {
				requestWithAuthentication: {
					call: jest.fn().mockRejectedValue(new Error('fail!')),
				},
			},
			getNodeParameter: () => undefined,
			continueOnFail: () => true,
		} as any;
		const items = [{ json: {} }];
		const result = await execute.call(mockThis, items);
		expect(result[0].json).toEqual({ error: 'fail!' });
	});
});
