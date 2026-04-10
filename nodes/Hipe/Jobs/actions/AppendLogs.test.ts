import { execute } from './AppendLogs';

describe('Jobs AppendLogs action', () => {
	it('should append log entries to a job (happy path)', async () => {
		const mockThis = {
			getCredentials: async () => ({ url: 'https://fake.api' }),
			helpers: {
				requestWithAuthentication: {
					call: jest.fn().mockResolvedValue({ id: 'job-1', logs: [] }),
				},
			},
			getNodeParameter: (name: string, i: number, defaultValue?: any) => {
				const params: { [key: string]: any } = {
					id: 'job-1',
					entries: {
						entryFields: [
							{ level: 'info', message: 'Row 1 imported' },
							{ level: 'error', message: 'Row 2 failed', context: '{"row":2,"field":"name"}' },
						],
					},
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
				url: 'https://fake.api/api/jobs/job-1/logs',
				body: {
					entries: [
						{ level: 'info', message: 'Row 1 imported' },
						{ level: 'error', message: 'Row 2 failed', context: { row: 2, field: 'name' } },
					],
				},
				json: true,
			}),
		);
		expect(result[0].json).toEqual({ id: 'job-1', logs: [] });
	});

	it('should throw error when entries array is empty', async () => {
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
					entries: { entryFields: [] },
				};
				return params[name] !== undefined ? params[name] : defaultValue;
			},
			continueOnFail: () => false,
		} as any;
		const items = [{ json: {} }];
		await expect(execute.call(mockThis, items)).rejects.toThrow('At least one log entry or a completeness value is required');
		expect(mockThis.helpers.requestWithAuthentication.call).not.toHaveBeenCalled();
	});

	it('should catch empty entries error when continueOnFail is true', async () => {
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
					entries: { entryFields: [] },
				};
				return params[name] !== undefined ? params[name] : defaultValue;
			},
			continueOnFail: () => true,
		} as any;
		const items = [{ json: {} }];
		const result = await execute.call(mockThis, items);
		expect(result[0].json).toEqual({ error: 'At least one log entry or a completeness value is required' });
	});

	it('should handle undefined entryFields gracefully (empty fixedCollection)', async () => {
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
					entries: {},
				};
				return params[name] !== undefined ? params[name] : defaultValue;
			},
			continueOnFail: () => false,
		} as any;
		const items = [{ json: {} }];
		await expect(execute.call(mockThis, items)).rejects.toThrow('At least one log entry or a completeness value is required');
	});

	it('should accept context as pre-parsed object', async () => {
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
					entries: {
						entryFields: [
							{ level: 'warn', message: 'Bad zip', context: { row: 63, field: 'zipCode' } },
						],
					},
				};
				return params[name] !== undefined ? params[name] : defaultValue;
			},
			continueOnFail: () => false,
		} as any;
		const items = [{ json: {} }];
		await execute.call(mockThis, items);
		const body = mockThis.helpers.requestWithAuthentication.call.mock.calls[0][2].body;
		expect(body.entries[0].context).toEqual({ row: 63, field: 'zipCode' });
	});

	it('should omit context from entries that have none', async () => {
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
					entries: {
						entryFields: [{ level: 'info', message: 'All good' }],
					},
				};
				return params[name] !== undefined ? params[name] : defaultValue;
			},
			continueOnFail: () => false,
		} as any;
		const items = [{ json: {} }];
		await execute.call(mockThis, items);
		const body = mockThis.helpers.requestWithAuthentication.call.mock.calls[0][2].body;
		expect(body.entries[0]).toEqual({ level: 'info', message: 'All good' });
		expect(body.entries[0]).not.toHaveProperty('context');
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
					entries: {
						entryFields: [{ level: 'info', message: 'test' }],
					},
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
