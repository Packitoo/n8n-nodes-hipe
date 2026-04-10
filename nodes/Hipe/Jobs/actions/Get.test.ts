import { execute } from './Get';

describe('Jobs Get action', () => {
	it('should call GET /api/jobs/:id and return the job (happy path)', async () => {
		const mockThis = {
			getCredentials: async () => ({ url: 'https://fake.api' }),
			helpers: {
				requestWithAuthentication: {
					call: jest.fn().mockResolvedValue({ id: 'job-1', status: 1 }),
				},
			},
			getNodeParameter: (name: string) => {
				if (name === 'id') return 'job-1';
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
				url: 'https://fake.api/api/jobs/job-1',
				json: true,
			}),
		);
		expect(result[0].json).toEqual({ id: 'job-1', status: 1 });
	});

	it('should strip trailing slash from base URL', async () => {
		const mockThis = {
			getCredentials: async () => ({ url: 'https://fake.api/' }),
			helpers: {
				requestWithAuthentication: {
					call: jest.fn().mockResolvedValue({ id: 'job-1' }),
				},
			},
			getNodeParameter: () => 'job-1',
			continueOnFail: () => false,
		} as any;
		const items = [{ json: {} }];
		await execute.call(mockThis, items);
		expect(mockThis.helpers.requestWithAuthentication.call).toHaveBeenCalledWith(
			mockThis,
			'hipeApi',
			expect.objectContaining({ url: 'https://fake.api/api/jobs/job-1' }),
		);
	});

	it('should throw if base URL is not a string', async () => {
		const mockThis = {
			getCredentials: async () => ({ url: undefined }),
		} as any;
		const items = [{ json: {} }];
		await expect(execute.call(mockThis, items)).rejects.toThrow('HIPE base URL is not a string');
	});

	it('should process multiple items sequentially', async () => {
		const mockThis = {
			getCredentials: async () => ({ url: 'https://fake.api' }),
			helpers: {
				requestWithAuthentication: {
					call: jest
						.fn()
						.mockResolvedValueOnce({ id: 'job-1' })
						.mockResolvedValueOnce({ id: 'job-2' }),
				},
			},
			getNodeParameter: (name: string, i: number) => {
				if (name === 'id') return `job-${i + 1}`;
				return undefined;
			},
			continueOnFail: () => false,
		} as any;
		const items = [{ json: {} }, { json: {} }];
		const result = await execute.call(mockThis, items);
		expect(result).toHaveLength(2);
		expect(mockThis.helpers.requestWithAuthentication.call).toHaveBeenCalledTimes(2);
		expect(result[0].json).toEqual({ id: 'job-1' });
		expect(result[1].json).toEqual({ id: 'job-2' });
	});

	it('should continue processing when one item fails with continueOnFail', async () => {
		const mockThis = {
			getCredentials: async () => ({ url: 'https://fake.api' }),
			helpers: {
				requestWithAuthentication: {
					call: jest
						.fn()
						.mockRejectedValueOnce(new Error('not found'))
						.mockResolvedValueOnce({ id: 'job-2' }),
				},
			},
			getNodeParameter: (name: string, i: number) => {
				if (name === 'id') return `job-${i + 1}`;
				return undefined;
			},
			continueOnFail: () => true,
		} as any;
		const items = [{ json: {} }, { json: {} }];
		const result = await execute.call(mockThis, items);
		expect(result).toHaveLength(2);
		expect(result[0].json).toEqual({ error: 'not found' });
		expect(result[1].json).toEqual({ id: 'job-2' });
	});

	it('should handle errors and push error object when continueOnFail is true', async () => {
		const mockThis = {
			getCredentials: async () => ({ url: 'https://fake.api' }),
			helpers: {
				requestWithAuthentication: {
					call: jest.fn().mockRejectedValue(new Error('fail!')),
				},
			},
			getNodeParameter: () => 'job-1',
			continueOnFail: () => true,
		} as any;
		const items = [{ json: {} }];
		const result = await execute.call(mockThis, items);
		expect(result[0].json).toEqual({ error: 'fail!' });
	});
});
