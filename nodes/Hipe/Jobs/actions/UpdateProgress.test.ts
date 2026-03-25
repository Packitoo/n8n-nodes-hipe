import { execute } from './UpdateProgress';

describe('Jobs UpdateProgress action', () => {
	it('should update progress without log entry (happy path)', async () => {
		const mockThis = {
			getCredentials: async () => ({ url: 'https://fake.api' }),
			helpers: {
				requestWithAuthentication: {
					call: jest.fn().mockResolvedValue({ id: 'job-1', completeness: 50 }),
				},
			},
			getNodeParameter: (name: string, i: number, defaultValue?: any) => {
				const params: { [key: string]: any } = {
					id: 'job-1',
					completeness: 50,
					log: {},
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
				url: 'https://fake.api/api/jobs/job-1/progress',
				body: { completeness: 50 },
				json: true,
			}),
		);
		expect(result[0].json).toEqual({ id: 'job-1', completeness: 50 });
	});

	it('should include log entry with context when provided', async () => {
		const mockThis = {
			getCredentials: async () => ({ url: 'https://fake.api' }),
			helpers: {
				requestWithAuthentication: {
					call: jest.fn().mockResolvedValue({ id: 'job-1', completeness: 75 }),
				},
			},
			getNodeParameter: (name: string, i: number, defaultValue?: any) => {
				const params: { [key: string]: any } = {
					id: 'job-1',
					completeness: 75,
					log: {
						level: 'info',
						message: 'Batch 2 complete',
						context: '{"batch":2,"created":50}',
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
					completeness: 75,
					log: {
						level: 'info',
						message: 'Batch 2 complete',
						context: { batch: 2, created: 50 },
					},
				},
			}),
		);
	});

	it('should not include log when level is provided but message is missing', async () => {
		const mockThis = {
			getCredentials: async () => ({ url: 'https://fake.api' }),
			helpers: {
				requestWithAuthentication: {
					call: jest.fn().mockResolvedValue({ id: 'job-1', completeness: 30 }),
				},
			},
			getNodeParameter: (name: string, i: number, defaultValue?: any) => {
				const params: { [key: string]: any } = {
					id: 'job-1',
					completeness: 30,
					log: { level: 'warn' },
				};
				return params[name] !== undefined ? params[name] : defaultValue;
			},
			continueOnFail: () => false,
		} as any;
		const items = [{ json: {} }];
		await execute.call(mockThis, items);
		const body = mockThis.helpers.requestWithAuthentication.call.mock.calls[0][2].body;
		expect(body).toEqual({ completeness: 30 });
		expect(body).not.toHaveProperty('log');
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
					completeness: 60,
					log: {
						level: 'error',
						message: 'Row failed',
						context: { row: 5, field: 'name' },
					},
				};
				return params[name] !== undefined ? params[name] : defaultValue;
			},
			continueOnFail: () => false,
		} as any;
		const items = [{ json: {} }];
		await execute.call(mockThis, items);
		const body = mockThis.helpers.requestWithAuthentication.call.mock.calls[0][2].body;
		expect(body.log.context).toEqual({ row: 5, field: 'name' });
	});

	it('should omit context from log when not provided', async () => {
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
					completeness: 40,
					log: { level: 'info', message: 'Processing' },
				};
				return params[name] !== undefined ? params[name] : defaultValue;
			},
			continueOnFail: () => false,
		} as any;
		const items = [{ json: {} }];
		await execute.call(mockThis, items);
		const body = mockThis.helpers.requestWithAuthentication.call.mock.calls[0][2].body;
		expect(body.log).toEqual({ level: 'info', message: 'Processing' });
		expect(body.log).not.toHaveProperty('context');
	});

	it('should process multiple items with different progress values', async () => {
		const mockThis = {
			getCredentials: async () => ({ url: 'https://fake.api' }),
			helpers: {
				requestWithAuthentication: {
					call: jest
						.fn()
						.mockResolvedValueOnce({ id: 'job-1', completeness: 25 })
						.mockResolvedValueOnce({ id: 'job-1', completeness: 50 }),
				},
			},
			getNodeParameter: (name: string, i: number, defaultValue?: any) => {
				if (name === 'id') return 'job-1';
				if (name === 'completeness') return i === 0 ? 25 : 50;
				if (name === 'log') return {};
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
					completeness: 50,
					log: {},
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
