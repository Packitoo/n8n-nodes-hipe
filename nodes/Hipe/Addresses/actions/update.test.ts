import { execute } from './update';

describe('Addresses update action', () => {
	it('should call helpers.requestWithAuthentication and return correct data (happy path)', async () => {
		const mockThis = {
			getCredentials: async () => ({ url: 'https://fake.api' }),
			helpers: {
				requestWithAuthentication: { call: jest.fn().mockResolvedValue({ updated: true }) },
			},
			getNodeParameter: (name: string, i: number, defaultValue?: any) => {
				const params: { [key: string]: any } = {
					id: 'address-1',
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
					asyncMode: false,
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
				method: 'PATCH',
				url: 'https://fake.api/api/addresses/address-1',
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
				headers: {},
			}),
		);
		expect(result[0].json).toEqual({ updated: true });
	});

	it('should handle errors and push error object when continueOnFail is true (edge case)', async () => {
		const mockThis = {
			getCredentials: async () => ({ url: 'https://fake.api' }),
			helpers: {
				requestWithAuthentication: { call: jest.fn().mockRejectedValue(new Error('fail!')) },
			},
			getNodeParameter: (name: string, i: number, defaultValue?: any) => {
				const params: { [key: string]: any } = {
					id: 'address-1',
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
					asyncMode: false,
				};
				return params[name] !== undefined ? params[name] : defaultValue;
			},
			continueOnFail: () => true,
		} as any;
		const items = [{ json: {} }];
		const result = await execute.call(mockThis, items);
		expect(result[0].json).toEqual({ error: 'fail!' });
	});

	it('should add Prefer: respond-async header when asyncMode is true', async () => {
		const mockThis = {
			getCredentials: async () => ({ url: 'https://fake.api' }),
			helpers: {
				requestWithAuthentication: {
					call: jest.fn().mockResolvedValue({ id: 'job-123', status: 'pending', entity: 'address' }),
				},
			},
			getNodeParameter: (name: string, i: number, defaultValue?: any) => {
				const params: { [key: string]: any } = {
					id: 'address-1',
					companyId: 'company-1',
					address: '456 Oak Ave',
					city: 'Lyon',
					country: 'France',
					firstComplementaryAddress: 'Suite 2',
					name: 'Branch',
					position: 2,
					secondComplementaryAddress: 'Floor 3',
					state: 'ARA',
					zipCode: '69000',
					asyncMode: true,
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
				method: 'PATCH',
				url: 'https://fake.api/api/addresses/address-1',
				headers: { 'Prefer': 'respond-async' },
			}),
		);
		expect(result[0].json).toEqual({ id: 'job-123', status: 'pending', entity: 'address' });
	});

	it('should only include provided fields in request body', async () => {
		const mockThis = {
			getCredentials: async () => ({ url: 'https://fake.api' }),
			helpers: {
				requestWithAuthentication: {
					call: jest.fn().mockResolvedValue({ updated: true }),
				},
			},
			getNodeParameter: (name: string, i: number, defaultValue?: any) => {
				const params: { [key: string]: any } = {
					id: 'address-1',
					companyId: '',
					address: 'Updated Address',
					city: '',
					country: '',
					firstComplementaryAddress: '',
					name: '',
					position: 0,
					secondComplementaryAddress: '',
					state: '',
					zipCode: '',
					externalId: '',
					asyncMode: false,
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
				body: {
					address: 'Updated Address',
				},
			}),
		);
		expect(result[0].json).toEqual({ updated: true });
	});

	it('should throw error when base URL is not a string', async () => {
		const mockThis = {
			getCredentials: async () => ({ url: 123 }),
			helpers: {
				requestWithAuthentication: {
					call: jest.fn(),
				},
			},
			getNodeParameter: (name: string, i: number, defaultValue?: any) => {
				return defaultValue;
			},
			continueOnFail: () => false,
		} as any;
		const items = [{ json: {} }];
		await expect(execute.call(mockThis, items)).rejects.toThrow('HIPE base URL is not a string');
	});
});
