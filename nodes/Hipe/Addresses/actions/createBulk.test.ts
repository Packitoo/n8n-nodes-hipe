import { execute } from './createBulk';

describe('Addresses createBulk action', () => {
	it('should call helpers.requestWithAuthentication with bulk array (happy path)', async () => {
		const addresses = [
			{
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
			},
			{
				companyId: 'company-1',
				address: '456 Oak Ave',
				city: 'Lyon',
				country: 'France',
				firstComplementaryAddress: 'Suite 2',
				name: 'Branch Office',
				position: 2,
				secondComplementaryAddress: 'Floor 3',
				state: 'ARA',
				zipCode: '69000',
			},
		];

		const mockThis = {
			getCredentials: async () => ({ url: 'https://fake.api' }),
			helpers: {
				requestWithAuthentication: {
					call: jest.fn().mockResolvedValue([
						{ id: 'addr-1', ...addresses[0] },
						{ id: 'addr-2', ...addresses[1] },
					]),
				},
			},
			getNodeParameter: (name: string, i: number, defaultValue?: any) => {
				if (name === 'addresses') {
					return JSON.stringify(addresses);
				}
				return defaultValue;
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
				url: 'https://fake.api/api/addresses/bulk',
				json: true,
				body: {
					bulk: addresses,
				},
			}),
		);
		expect(result).toHaveLength(2);
		expect(result[0].json).toEqual({ id: 'addr-1', ...addresses[0] });
		expect(result[1].json).toEqual({ id: 'addr-2', ...addresses[1] });
	});

	it('should handle addresses as array object', async () => {
		const addresses = [
			{
				address: '123 Main St',
				city: 'Paris',
				country: 'France',
				firstComplementaryAddress: 'Apt 1',
				name: 'HQ',
				position: 1,
				secondComplementaryAddress: 'Building B',
				state: 'IDF',
				zipCode: '75000',
			},
		];

		const mockThis = {
			getCredentials: async () => ({ url: 'https://fake.api' }),
			helpers: {
				requestWithAuthentication: {
					call: jest.fn().mockResolvedValue([{ id: 'addr-1', ...addresses[0] }]),
				},
			},
			getNodeParameter: (name: string, i: number, defaultValue?: any) => {
				if (name === 'addresses') {
					return addresses; // Return as array, not string
				}
				return defaultValue;
			},
			continueOnFail: () => false,
		} as any;

		const items = [{ json: {} }];
		const result = await execute.call(mockThis, items);

		expect(result).toHaveLength(1);
	});

	it('should handle API errors and push error object when continueOnFail is true', async () => {
		const addresses = [
			{
				address: '123 Main St',
				city: 'Paris',
				country: 'France',
				firstComplementaryAddress: 'Apt 1',
				name: 'HQ',
				position: 1,
				secondComplementaryAddress: 'Building B',
				state: 'IDF',
				zipCode: '75000',
			},
		];

		const mockThis = {
			getCredentials: async () => ({ url: 'https://fake.api' }),
			helpers: {
				requestWithAuthentication: { call: jest.fn().mockRejectedValue(new Error('API error')) },
			},
			getNodeParameter: (name: string, i: number, defaultValue?: any) => {
				if (name === 'addresses') {
					return JSON.stringify(addresses);
				}
				return defaultValue;
			},
			continueOnFail: () => true,
		} as any;

		const items = [{ json: {} }];
		const result = await execute.call(mockThis, items);
		expect(result[0].json).toEqual({ error: 'API error' });
	});

	it('should handle empty array error when continueOnFail is true', async () => {
		const mockThis = {
			getCredentials: async () => ({ url: 'https://fake.api' }),
			helpers: {
				requestWithAuthentication: { call: jest.fn() },
			},
			getNodeParameter: (name: string, i: number, defaultValue?: any) => {
				if (name === 'addresses') {
					return '[]';
				}
				return defaultValue;
			},
			continueOnFail: () => true,
		} as any;

		const items = [{ json: {} }];
		const result = await execute.call(mockThis, items);
		expect(result[0].json).toEqual({ error: 'Addresses array cannot be empty' });
	});

	it('should throw error when addresses is not an array', async () => {
		const mockThis = {
			getCredentials: async () => ({ url: 'https://fake.api' }),
			helpers: {
				requestWithAuthentication: { call: jest.fn() },
			},
			getNodeParameter: (name: string, i: number, defaultValue?: any) => {
				if (name === 'addresses') {
					return '{"not": "array"}';
				}
				return defaultValue;
			},
			continueOnFail: () => false,
		} as any;

		const items = [{ json: {} }];
		await expect(execute.call(mockThis, items)).rejects.toThrow('Addresses must be an array');
	});
});
