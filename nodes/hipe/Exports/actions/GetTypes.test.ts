import { execute } from './GetTypes';

describe('Exports GetTypes action', () => {
	it('should call helpers.requestWithAuthentication and return types data (happy path)', async () => {
		const mockTypesResponse = [
			{ id: 1, name: 'CSV Export', description: 'Export CSV files' },
			{ id: 2, name: 'Excel Export', description: 'Export Excel files' },
		];

		const mockThis = {
			getCredentials: async () => ({ url: 'https://fake.api' }),
			helpers: {
				requestWithAuthentication: { call: jest.fn().mockResolvedValue(mockTypesResponse) },
			},
			getNodeParameter: () => undefined,
			continueOnFail: () => false,
		} as any;

		const items = [{ json: {} }];
		const result = await execute.call(mockThis, items);

		expect(mockThis.helpers.requestWithAuthentication.call).toHaveBeenCalledWith(
			mockThis,
			'hipeApi',
			expect.objectContaining({
				method: 'GET',
				url: 'https://fake.api/api/exports/utils/get-types',
				json: true,
			}),
		);
		expect(result[0].json).toEqual(mockTypesResponse);
	});

	it('should handle errors and push error object when continueOnFail is true', async () => {
		const mockThis = {
			getCredentials: async () => ({ url: 'https://fake.api' }),
			helpers: {
				requestWithAuthentication: {
					call: jest.fn().mockRejectedValue(new Error('Types fetch failed')),
				},
			},
			getNodeParameter: () => undefined,
			continueOnFail: () => true,
		} as any;

		const items = [{ json: {} }];
		const result = await execute.call(mockThis, items);
		expect(result[0].json).toEqual({ error: 'Types fetch failed' });
	});

	it('should throw error when continueOnFail is false', async () => {
		const mockThis = {
			getCredentials: async () => ({ url: 'https://fake.api' }),
			helpers: {
				requestWithAuthentication: {
					call: jest.fn().mockRejectedValue(new Error('API unavailable')),
				},
			},
			getNodeParameter: () => undefined,
			continueOnFail: () => false,
		} as any;

		const items = [{ json: {} }];
		await expect(execute.call(mockThis, items)).rejects.toThrow('API unavailable');
	});
});
