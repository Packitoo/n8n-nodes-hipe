import { execute } from './createAddress';

describe('Companies createAddress action', () => {
	it('should call helpers.requestWithAuthentication and return correct data (happy path)', async () => {
		const mockThis = {
			getCredentials: async () => ({ url: 'https://fake.api' }),
			helpers: {
				requestWithAuthentication: { call: jest.fn().mockResolvedValue({ created: true }) },
			},
			getNodeParameter: (name: string, i: number, defaultValue?: any) => {
				const params: { [key: string]: any } = {
					companyId: 'company-1',
					address: '123 Main St',
					city: 'Paris',
					country: 'France',
					firstComplementaryAddress: 'Apt 1',
					name: 'HQ',
					position: 1,
					secondComplementaryAddress: 'Building B',
					state: 'IDF',
					zipCode: '75000',
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
				url: 'https://fake.api/api/addresses',
				json: true,
				body: expect.objectContaining({
					companyId: 'company-1',
					address: '123 Main St',
					city: 'Paris',
					country: 'France',
					firstComplementaryAddress: 'Apt 1',
					name: 'HQ',
					position: 1,
					secondComplementaryAddress: 'Building B',
					state: 'IDF',
					zipCode: '75000',
				}),
			}),
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
					companyId: 'company-1',
					address: '123 Main St',
					city: 'Paris',
					country: 'France',
					firstComplementaryAddress: 'Apt 1',
					name: 'HQ',
					position: 1,
					secondComplementaryAddress: 'Building B',
					state: 'IDF',
					zipCode: '75000',
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
