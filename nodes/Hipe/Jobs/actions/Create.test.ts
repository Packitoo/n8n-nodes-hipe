import { execute } from './Create';

describe('Jobs Create action', () => {
	it('should create a job with required fields (happy path)', async () => {
		const mockThis = {
			getCredentials: async () => ({ url: 'https://fake.api' }),
			helpers: {
				requestWithAuthentication: {
					call: jest.fn().mockResolvedValue({ id: 'job-1', type: 'n8n_workflow', subType: 'My Workflow' }),
				},
			},
			getNodeParameter: (name: string, i: number, defaultValue?: any) => {
				const params: { [key: string]: any } = {
					type: 'n8n_workflow',
					subType: 'My Workflow',
					externalId: 'exec-123',
					additionalFields: {},
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
				method: 'POST',
				url: 'https://fake.api/api/jobs',
				body: { type: 'n8n_workflow', subType: 'My Workflow', externalId: 'exec-123' },
				json: true,
			}),
		);
		expect(result[0].json).toEqual({ id: 'job-1', type: 'n8n_workflow', subType: 'My Workflow' });
	});

	it('should include additional fields (entityType, entityId, metadata)', async () => {
		const mockThis = {
			getCredentials: async () => ({ url: 'https://fake.api' }),
			helpers: {
				requestWithAuthentication: {
					call: jest.fn().mockResolvedValue({ id: 'job-2' }),
				},
			},
			getNodeParameter: (name: string, i: number, defaultValue?: any) => {
				const params: { [key: string]: any } = {
					type: 'import',
					subType: 'CSV Import',
					externalId: '',
					additionalFields: {
						entityType: 'company',
						entityId: 'comp-1',
						metadata: '{"source":"csv","rows":100}',
					},
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
				body: {
					type: 'import',
					subType: 'CSV Import',
					entityType: 'company',
					entityId: 'comp-1',
					metadata: { source: 'csv', rows: 100 },
				},
			}),
		);
	});

	it('should strip trailing slash from base URL', async () => {
		const mockThis = {
			getCredentials: async () => ({ url: 'https://fake.api/' }),
			helpers: {
				requestWithAuthentication: {
					call: jest.fn().mockResolvedValue({ id: 'job-1' }),
				},
			},
			getNodeParameter: (name: string, i: number, defaultValue?: any) => {
				const params: { [key: string]: any } = {
					type: 'n8n_workflow',
					subType: 'test',
					externalId: '',
					additionalFields: {},
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
			expect.objectContaining({ url: 'https://fake.api/api/jobs' }),
		);
	});

	it('should throw if base URL is not a string', async () => {
		const mockThis = {
			getCredentials: async () => ({ url: 12345 }),
		} as any;
		const items = [{ json: {} }];
		await expect(execute.call(mockThis, items)).rejects.toThrow('HIPE base URL is not a string');
	});

	it('should exclude externalId from body when empty string', async () => {
		const mockThis = {
			getCredentials: async () => ({ url: 'https://fake.api' }),
			helpers: {
				requestWithAuthentication: {
					call: jest.fn().mockResolvedValue({ id: 'job-1' }),
				},
			},
			getNodeParameter: (name: string, i: number, defaultValue?: any) => {
				const params: { [key: string]: any } = {
					type: 'export',
					subType: 'test',
					externalId: '',
					additionalFields: {},
				};
				return params[name] !== undefined ? params[name] : defaultValue;
			},
			continueOnFail: () => false,
		} as any;
		const items = [{ json: {} }];
		await execute.call(mockThis, items);
		const body = mockThis.helpers.requestWithAuthentication.call.mock.calls[0][2].body;
		expect(body).not.toHaveProperty('externalId');
	});

	it('should accept metadata as object (not just string)', async () => {
		const mockThis = {
			getCredentials: async () => ({ url: 'https://fake.api' }),
			helpers: {
				requestWithAuthentication: {
					call: jest.fn().mockResolvedValue({ id: 'job-1' }),
				},
			},
			getNodeParameter: (name: string, i: number, defaultValue?: any) => {
				const params: { [key: string]: any } = {
					type: 'n8n_workflow',
					subType: 'test',
					externalId: '',
					additionalFields: {
						metadata: { already: 'parsed' },
					},
				};
				return params[name] !== undefined ? params[name] : defaultValue;
			},
			continueOnFail: () => false,
		} as any;
		const items = [{ json: {} }];
		await execute.call(mockThis, items);
		const body = mockThis.helpers.requestWithAuthentication.call.mock.calls[0][2].body;
		expect(body.metadata).toEqual({ already: 'parsed' });
	});

	it('should process multiple items and call API for each', async () => {
		const mockThis = {
			getCredentials: async () => ({ url: 'https://fake.api' }),
			helpers: {
				requestWithAuthentication: {
					call: jest
						.fn()
						.mockResolvedValueOnce({ id: 'job-1' })
						.mockResolvedValueOnce({ id: 'job-2' })
						.mockResolvedValueOnce({ id: 'job-3' }),
				},
			},
			getNodeParameter: (name: string, i: number, defaultValue?: any) => {
				const params: { [key: string]: any } = {
					type: 'import',
					subType: `workflow-${i}`,
					externalId: `exec-${i}`,
					additionalFields: {},
				};
				return params[name] !== undefined ? params[name] : defaultValue;
			},
			continueOnFail: () => false,
		} as any;
		const items = [{ json: {} }, { json: {} }, { json: {} }];
		const result = await execute.call(mockThis, items);
		expect(result).toHaveLength(3);
		expect(mockThis.helpers.requestWithAuthentication.call).toHaveBeenCalledTimes(3);
		expect(result[0].json).toEqual({ id: 'job-1' });
		expect(result[2].json).toEqual({ id: 'job-3' });
	});

	it('should continue processing remaining items when one fails with continueOnFail', async () => {
		const mockThis = {
			getCredentials: async () => ({ url: 'https://fake.api' }),
			helpers: {
				requestWithAuthentication: {
					call: jest
						.fn()
						.mockResolvedValueOnce({ id: 'job-1' })
						.mockRejectedValueOnce(new Error('item 2 failed'))
						.mockResolvedValueOnce({ id: 'job-3' }),
				},
			},
			getNodeParameter: (name: string, i: number, defaultValue?: any) => {
				const params: { [key: string]: any } = {
					type: 'n8n_workflow',
					subType: 'test',
					externalId: '',
					additionalFields: {},
				};
				return params[name] !== undefined ? params[name] : defaultValue;
			},
			continueOnFail: () => true,
		} as any;
		const items = [{ json: {} }, { json: {} }, { json: {} }];
		const result = await execute.call(mockThis, items);
		expect(result).toHaveLength(3);
		expect(result[0].json).toEqual({ id: 'job-1' });
		expect(result[1].json).toEqual({ error: 'item 2 failed' });
		expect(result[2].json).toEqual({ id: 'job-3' });
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
					type: 'n8n_workflow',
					subType: 'test',
					externalId: '',
					additionalFields: {},
				};
				return params[name] !== undefined ? params[name] : defaultValue;
			},
			continueOnFail: () => true,
		} as any;
		const items = [{ json: {} }];
		const result = await execute.call(mockThis, items);
		expect(result[0].json).toEqual({ error: 'fail!' });
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
					type: 'n8n_workflow',
					subType: 'test',
					externalId: '',
					additionalFields: {
						metadata: '{invalid json',
					},
				};
				return params[name] !== undefined ? params[name] : defaultValue;
			},
			continueOnFail: () => false,
		} as any;
		const items = [{ json: {} }];
		await expect(execute.call(mockThis, items)).rejects.toThrow();
		expect(mockThis.helpers.requestWithAuthentication.call).not.toHaveBeenCalled();
	});
});
