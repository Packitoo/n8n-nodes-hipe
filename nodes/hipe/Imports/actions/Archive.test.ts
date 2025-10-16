import { execute } from './Archive';

describe('Imports Archive action', () => {
	it('should call helpers.requestWithAuthentication and return correct data (happy path)', async () => {
		const mockThis = {
			getCredentials: async () => ({ url: 'https://fake.api' }),
			helpers: {
				requestWithAuthentication: {
					call: jest.fn().mockResolvedValue({ id: 'import-123', archived: true }),
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
				method: 'PATCH',
				url: 'https://fake.api/api/imports/import-123/archive',
				json: true,
			}),
		);
		expect(result[0].json).toEqual({ id: 'import-123', archived: true });
	});

	it('should handle null response and return success object', async () => {
		const mockThis = {
			getCredentials: async () => ({ url: 'https://fake.api' }),
			helpers: {
				requestWithAuthentication: { call: jest.fn().mockResolvedValue(null) },
			},
			getNodeParameter: (name: string, i: number) => {
				if (name === 'id') return 'import-456';
				return undefined;
			},
			continueOnFail: () => false,
		} as any;

		const items = [{ json: {} }];
		const result = await execute.call(mockThis, items);

		expect(result[0].json).toEqual({ success: true });
	});

	it('should properly encode special characters in ID', async () => {
		const mockThis = {
			getCredentials: async () => ({ url: 'https://fake.api' }),
			helpers: {
				requestWithAuthentication: { call: jest.fn().mockResolvedValue({ success: true }) },
			},
			getNodeParameter: (name: string, i: number) => {
				if (name === 'id') return 'import/with/slashes';
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
				url: 'https://fake.api/api/imports/import%2Fwith%2Fslashes/archive',
			}),
		);
	});

	it('should handle errors and push error object when continueOnFail is true', async () => {
		const mockThis = {
			getCredentials: async () => ({ url: 'https://fake.api' }),
			helpers: {
				requestWithAuthentication: {
					call: jest.fn().mockRejectedValue(new Error('Archive failed')),
				},
			},
			getNodeParameter: (name: string, i: number) => {
				if (name === 'id') return 'import-789';
				return undefined;
			},
			continueOnFail: () => true,
		} as any;

		const items = [{ json: {} }];
		const result = await execute.call(mockThis, items);
		expect(result[0].json).toEqual({ error: 'Archive failed' });
	});

	it('should throw error when continueOnFail is false', async () => {
		const mockThis = {
			getCredentials: async () => ({ url: 'https://fake.api' }),
			helpers: {
				requestWithAuthentication: {
					call: jest.fn().mockRejectedValue(new Error('Permission denied')),
				},
			},
			getNodeParameter: (name: string, i: number) => {
				if (name === 'id') return 'import-999';
				return undefined;
			},
			continueOnFail: () => false,
		} as any;

		const items = [{ json: {} }];
		await expect(execute.call(mockThis, items)).rejects.toThrow('Permission denied');
	});
});
