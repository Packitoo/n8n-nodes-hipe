import { execute } from './GetDelimiters';

describe('Imports GetDelimiters action', () => {
	it('should call helpers.requestWithAuthentication and return delimiters data (happy path)', async () => {
		const mockDelimitersResponse = [
			{ id: ',', name: 'Comma', description: 'Comma separated values' },
			{ id: ';', name: 'Semicolon', description: 'Semicolon separated values' },
			{ id: '\t', name: 'Tab', description: 'Tab separated values' },
			{ id: '|', name: 'Pipe', description: 'Pipe separated values' },
		];

		const mockThis = {
			getCredentials: async () => ({ url: 'https://fake.api' }),
			helpers: {
				requestWithAuthentication: { call: jest.fn().mockResolvedValue(mockDelimitersResponse) },
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
				url: 'https://fake.api/api/imports/utils/get-delimiters',
				json: true,
			}),
		);
		expect(result[0].json).toEqual(mockDelimitersResponse);
	});

	it('should handle errors and push error object when continueOnFail is true', async () => {
		const mockThis = {
			getCredentials: async () => ({ url: 'https://fake.api' }),
			helpers: {
				requestWithAuthentication: {
					call: jest.fn().mockRejectedValue(new Error('Delimiters fetch failed')),
				},
			},
			getNodeParameter: () => undefined,
			continueOnFail: () => true,
		} as any;

		const items = [{ json: {} }];
		const result = await execute.call(mockThis, items);
		expect(result[0].json).toEqual({ error: 'Delimiters fetch failed' });
	});

	it('should throw error when continueOnFail is false', async () => {
		const mockThis = {
			getCredentials: async () => ({ url: 'https://fake.api' }),
			helpers: {
				requestWithAuthentication: {
					call: jest.fn().mockRejectedValue(new Error('Connection timeout')),
				},
			},
			getNodeParameter: () => undefined,
			continueOnFail: () => false,
		} as any;

		const items = [{ json: {} }];
		await expect(execute.call(mockThis, items)).rejects.toThrow('Connection timeout');
	});
});
