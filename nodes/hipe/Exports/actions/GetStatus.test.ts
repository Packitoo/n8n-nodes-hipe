import { execute } from './GetStatus';

describe('Exports GetStatus action', () => {
	it('should call helpers.requestWithAuthentication and return status data (happy path)', async () => {
		const mockStatusResponse = [
			{ id: 'pending', name: 'Pending', description: 'Export is pending processing' },
			{ id: 'processing', name: 'Processing', description: 'Export is being processed' },
			{ id: 'completed', name: 'Completed', description: 'Export has been completed' },
			{ id: 'failed', name: 'Failed', description: 'Export has failed' },
		];

		const mockThis = {
			getCredentials: async () => ({ url: 'https://fake.api' }),
			helpers: {
				requestWithAuthentication: { call: jest.fn().mockResolvedValue(mockStatusResponse) },
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
				url: 'https://fake.api/api/exports/utils/get-status',
				json: true,
			}),
		);
		expect(result[0].json).toEqual(mockStatusResponse);
	});

	it('should handle errors and push error object when continueOnFail is true', async () => {
		const mockThis = {
			getCredentials: async () => ({ url: 'https://fake.api' }),
			helpers: {
				requestWithAuthentication: {
					call: jest.fn().mockRejectedValue(new Error('Status fetch failed')),
				},
			},
			getNodeParameter: () => undefined,
			continueOnFail: () => true,
		} as any;

		const items = [{ json: {} }];
		const result = await execute.call(mockThis, items);
		expect(result[0].json).toEqual({ error: 'Status fetch failed' });
	});

	it('should throw error when continueOnFail is false', async () => {
		const mockThis = {
			getCredentials: async () => ({ url: 'https://fake.api' }),
			helpers: {
				requestWithAuthentication: { call: jest.fn().mockRejectedValue(new Error('Server error')) },
			},
			getNodeParameter: () => undefined,
			continueOnFail: () => false,
		} as any;

		const items = [{ json: {} }];
		await expect(execute.call(mockThis, items)).rejects.toThrow('Server error');
	});
});
