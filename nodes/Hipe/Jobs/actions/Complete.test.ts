import { execute } from './Complete';

describe('Jobs Complete action', () => {
	it('should mark job as succeeded without metadata (happy path)', async () => {
		const mockThis = {
			getCredentials: async () => ({ url: 'https://fake.api' }),
			helpers: {
				requestWithAuthentication: {
					call: jest.fn().mockResolvedValue({ id: 'job-1', status: 3, completeness: 100 }),
				},
			},
			getNodeParameter: (name: string, i: number, defaultValue?: any) => {
				const params: { [key: string]: any } = {
					id: 'job-1',
					metadata: '{}',
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
				url: 'https://fake.api/api/jobs/job-1/complete',
				body: {},
				json: true,
			}),
		);
		expect(result[0].json).toEqual({ id: 'job-1', status: 3, completeness: 100 });
	});

	it('should include metadata when provided as JSON string', async () => {
		const mockThis = {
			getCredentials: async () => ({ url: 'https://fake.api' }),
			helpers: {
				requestWithAuthentication: {
					call: jest.fn().mockResolvedValue({ id: 'job-1', status: 3 }),
				},
			},
			getNodeParameter: (name: string, i: number, defaultValue?: any) => {
				const params: { [key: string]: any } = {
					id: 'job-1',
					metadata: '{"totalCreated":100,"totalErrors":2}',
				};
				return params[name] !== undefined ? params[name] : defaultValue;
			},
			continueOnFail: () => false,
		} as any;
		const items = [{ json: {} }];
		await execute.call(mockThis, items);
		expect(mockThis.helpers.requestWithAuthentication.call).toHaveBeenCalledWith(
			mockThis,
			'hipeApi',
			expect.objectContaining({
				body: { metadata: { totalCreated: 100, totalErrors: 2 } },
			}),
		);
	});

	it('should accept metadata as pre-parsed object', async () => {
		const mockThis = {
			getCredentials: async () => ({ url: 'https://fake.api' }),
			helpers: {
				requestWithAuthentication: {
					call: jest.fn().mockResolvedValue({ id: 'job-1' }),
				},
			},
			getNodeParameter: (name: string, i: number, defaultValue?: any) => {
				const params: { [key: string]: any } = {
					id: 'job-1',
					metadata: { rows: 500, skipped: 3 },
				};
				return params[name] !== undefined ? params[name] : defaultValue;
			},
			continueOnFail: () => false,
		} as any;
		const items = [{ json: {} }];
		await execute.call(mockThis, items);
		const body = mockThis.helpers.requestWithAuthentication.call.mock.calls[0][2].body;
		expect(body.metadata).toEqual({ rows: 500, skipped: 3 });
	});

	it('should exclude metadata from body when empty object', async () => {
		const mockThis = {
			getCredentials: async () => ({ url: 'https://fake.api' }),
			helpers: {
				requestWithAuthentication: {
					call: jest.fn().mockResolvedValue({ id: 'job-1' }),
				},
			},
			getNodeParameter: (name: string, i: number, defaultValue?: any) => {
				const params: { [key: string]: any } = {
					id: 'job-1',
					metadata: '{}',
				};
				return params[name] !== undefined ? params[name] : defaultValue;
			},
			continueOnFail: () => false,
		} as any;
		const items = [{ json: {} }];
		await execute.call(mockThis, items);
		const body = mockThis.helpers.requestWithAuthentication.call.mock.calls[0][2].body;
		expect(body).not.toHaveProperty('metadata');
	});

	it('should throw on malformed metadata JSON string', async () => {
		const mockThis = {
			getCredentials: async () => ({ url: 'https://fake.api' }),
			helpers: {
				requestWithAuthentication: {
					call: jest.fn(),
				},
			},
			getNodeParameter: (name: string, i: number, defaultValue?: any) => {
				const params: { [key: string]: any } = {
					id: 'job-1',
					metadata: '{not valid json',
				};
				return params[name] !== undefined ? params[name] : defaultValue;
			},
			continueOnFail: () => false,
		} as any;
		const items = [{ json: {} }];
		await expect(execute.call(mockThis, items)).rejects.toThrow();
		expect(mockThis.helpers.requestWithAuthentication.call).not.toHaveBeenCalled();
	});

	it('should process multiple items', async () => {
		const mockThis = {
			getCredentials: async () => ({ url: 'https://fake.api' }),
			helpers: {
				requestWithAuthentication: {
					call: jest
						.fn()
						.mockResolvedValueOnce({ id: 'job-1', status: 3 })
						.mockResolvedValueOnce({ id: 'job-2', status: 3 }),
				},
			},
			getNodeParameter: (name: string, i: number, defaultValue?: any) => {
				if (name === 'id') return `job-${i + 1}`;
				if (name === 'metadata') return '{}';
				return defaultValue;
			},
			continueOnFail: () => false,
		} as any;
		const items = [{ json: {} }, { json: {} }];
		const result = await execute.call(mockThis, items);
		expect(result).toHaveLength(2);
		expect(mockThis.helpers.requestWithAuthentication.call).toHaveBeenCalledTimes(2);
	});

	it('should handle errors and push error object when continueOnFail is true', async () => {
		const mockThis = {
			getCredentials: async () => ({ url: 'https://fake.api' }),
			helpers: {
				requestWithAuthentication: {
					call: jest.fn().mockRejectedValue(new Error('fail!')),
				},
			},
			getNodeParameter: (name: string, i: number, defaultValue?: any) => {
				const params: { [key: string]: any } = {
					id: 'job-1',
					metadata: '{}',
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
