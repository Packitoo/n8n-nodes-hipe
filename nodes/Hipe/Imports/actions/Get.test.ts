import { execute } from './Get';

describe('Imports Get action', () => {
	it('should call helpers.requestWithAuthentication and return correct data (happy path)', async () => {
		const mockThis = {
			getCredentials: async () => ({ url: 'https://fake.api' }),
			helpers: {
				requestWithAuthentication: {
					call: jest.fn().mockResolvedValue({ id: 'import-123', status: 'completed', type: 1 }),
				},
			},
			getNodeParameter: (name: string, i: number) => {
				if (name === 'id') return 'import-123';
				return undefined;
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
				url: 'https://fake.api/api/imports/import-123',
				json: true,
			}),
		);
		expect(result[0].json).toEqual({ id: 'import-123', status: 'completed', type: 1 });
	});

	it('should properly encode special characters in ID', async () => {
		const mockThis = {
			getCredentials: async () => ({ url: 'https://fake.api' }),
			helpers: {
				requestWithAuthentication: {
					call: jest.fn().mockResolvedValue({ id: 'import with spaces' }),
				},
			},
			getNodeParameter: (name: string, i: number) => {
				if (name === 'id') return 'import with spaces';
				return undefined;
			},
			continueOnFail: () => false,
		} as any;

		const items = [{ json: {} }];
		await execute.call(mockThis, items);

		expect(mockThis.helpers.requestWithAuthentication.call).toHaveBeenCalledWith(
			mockThis,
			'hipeApi',
			expect.objectContaining({
				url: 'https://fake.api/api/imports/import%20with%20spaces',
			}),
		);
	});

	it('should handle errors and push error object when continueOnFail is true', async () => {
		const mockThis = {
			getCredentials: async () => ({ url: 'https://fake.api' }),
			helpers: {
				requestWithAuthentication: {
					call: jest.fn().mockRejectedValue(new Error('Import not found')),
				},
			},
			getNodeParameter: (name: string, i: number) => {
				if (name === 'id') return 'nonexistent-import';
				return undefined;
			},
			continueOnFail: () => true,
		} as any;

		const items = [{ json: {} }];
		const result = await execute.call(mockThis, items);
		expect(result[0].json).toEqual({ error: 'Import not found' });
	});

	it('should throw error when continueOnFail is false', async () => {
		const mockThis = {
			getCredentials: async () => ({ url: 'https://fake.api' }),
			helpers: {
				requestWithAuthentication: {
					call: jest.fn().mockRejectedValue(new Error('Network error')),
				},
			},
			getNodeParameter: (name: string, i: number) => {
				if (name === 'id') return 'import-456';
				return undefined;
			},
			continueOnFail: () => false,
		} as any;

		const items = [{ json: {} }];
		await expect(execute.call(mockThis, items)).rejects.toThrow('Network error');
	});
});
