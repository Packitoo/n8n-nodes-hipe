import { execute } from './Create';

describe('Exports Create action', () => {
	it('should call helpers.requestWithAuthentication and return correct data (happy path)', async () => {
		const mockThis = {
			getCredentials: async () => ({ url: 'https://fake.api' }),
			helpers: {
				requestWithAuthentication: {
					call: jest.fn().mockResolvedValue({ id: 'export-123', status: 'pending' }),
				},
			},
			getNodeParameter: (name: string, i: number, defaultValue?: any) => {
				if (name === 'type') return 1;
				if (name === 'startDate') return '2024-01-01T00:00:00Z';
				if (name === 'endDate') return '2024-12-31T23:59:59Z';
				if (name === 'userIds')
					return {
						userIdFields: [{ id: 'user-1' }, { id: 'user-2' }],
					};
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
				url: 'https://fake.api/api/exports',
				body: expect.objectContaining({
					type: 1,
					start_date: '2024-01-01T00:00:00Z',
					end_date: '2024-12-31T23:59:59Z',
					user_ids: ['user-1', 'user-2'],
				}),
				json: true,
			}),
		);
		expect(result[0].json).toEqual({ id: 'export-123', status: 'pending' });
	});

	it('should handle empty userIds correctly', async () => {
		const mockThis = {
			getCredentials: async () => ({ url: 'https://fake.api' }),
			helpers: {
				requestWithAuthentication: { call: jest.fn().mockResolvedValue({ id: 'export-456' }) },
			},
			getNodeParameter: (name: string, i: number, defaultValue?: any) => {
				if (name === 'type') return 2;
				if (name === 'startDate') return '';
				if (name === 'endDate') return '';
				if (name === 'userIds') return {}; // Empty userIds
				return defaultValue;
			},
			continueOnFail: () => false,
		} as any;

		const items = [{ json: {} }];
		await execute.call(mockThis, items);

		expect(mockThis.helpers.requestWithAuthentication.call).toHaveBeenCalledWith(
			mockThis,
			'hipeApi',
			expect.objectContaining({
				body: expect.objectContaining({
					type: 2,
					start_date: '',
					end_date: '',
					user_ids: [],
				}),
			}),
		);
	});

	it('should filter out empty user IDs', async () => {
		const mockThis = {
			getCredentials: async () => ({ url: 'https://fake.api' }),
			helpers: {
				requestWithAuthentication: { call: jest.fn().mockResolvedValue({ id: 'export-789' }) },
			},
			getNodeParameter: (name: string, i: number, defaultValue?: any) => {
				if (name === 'type') return 3;
				if (name === 'startDate') return '';
				if (name === 'endDate') return '';
				if (name === 'userIds')
					return {
						userIdFields: [{ id: 'user-1' }, { id: '' }, { id: 'user-3' }, { id: null }],
					};
				return defaultValue;
			},
			continueOnFail: () => false,
		} as any;

		const items = [{ json: {} }];
		await execute.call(mockThis, items);

		expect(mockThis.helpers.requestWithAuthentication.call).toHaveBeenCalledWith(
			mockThis,
			'hipeApi',
			expect.objectContaining({
				body: expect.objectContaining({
					user_ids: ['user-1', 'user-3'], // Empty and null IDs filtered out
				}),
			}),
		);
	});

	it('should handle malformed userIds structure', async () => {
		const mockThis = {
			getCredentials: async () => ({ url: 'https://fake.api' }),
			helpers: {
				requestWithAuthentication: { call: jest.fn().mockResolvedValue({ id: 'export-999' }) },
			},
			getNodeParameter: (name: string, i: number, defaultValue?: any) => {
				if (name === 'type') return 1;
				if (name === 'startDate') return '';
				if (name === 'endDate') return '';
				if (name === 'userIds') return 'invalid-structure'; // Invalid structure
				return defaultValue;
			},
			continueOnFail: () => false,
		} as any;

		const items = [{ json: {} }];
		await execute.call(mockThis, items);

		expect(mockThis.helpers.requestWithAuthentication.call).toHaveBeenCalledWith(
			mockThis,
			'hipeApi',
			expect.objectContaining({
				body: expect.objectContaining({
					user_ids: [], // Should default to empty array
				}),
			}),
		);
	});

	it('should handle errors and push error object when continueOnFail is true', async () => {
		const mockThis = {
			getCredentials: async () => ({ url: 'https://fake.api' }),
			helpers: {
				requestWithAuthentication: {
					call: jest.fn().mockRejectedValue(new Error('Export creation failed')),
				},
			},
			getNodeParameter: (name: string, i: number, defaultValue?: any) => {
				if (name === 'type') return 1;
				if (name === 'startDate') return '';
				if (name === 'endDate') return '';
				if (name === 'userIds') return {};
				return defaultValue;
			},
			continueOnFail: () => true,
		} as any;

		const items = [{ json: {} }];
		const result = await execute.call(mockThis, items);
		expect(result[0].json).toEqual({ error: 'Export creation failed' });
	});

	it('should throw error when continueOnFail is false', async () => {
		const mockThis = {
			getCredentials: async () => ({ url: 'https://fake.api' }),
			helpers: {
				requestWithAuthentication: {
					call: jest.fn().mockRejectedValue(new Error('Validation error')),
				},
			},
			getNodeParameter: (name: string, i: number, defaultValue?: any) => {
				if (name === 'type') return 1;
				if (name === 'startDate') return '';
				if (name === 'endDate') return '';
				if (name === 'userIds') return {};
				return defaultValue;
			},
			continueOnFail: () => false,
		} as any;

		const items = [{ json: {} }];
		await expect(execute.call(mockThis, items)).rejects.toThrow('Validation error');
	});
});
