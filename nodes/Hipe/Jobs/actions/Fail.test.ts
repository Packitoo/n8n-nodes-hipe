import { execute } from './Fail';

describe('Jobs Fail action', () => {
	it('should mark job as failed with error details (happy path)', async () => {
		const mockThis = {
			getCredentials: async () => ({ url: 'https://fake.api' }),
			helpers: {
				requestWithAuthentication: {
					call: jest.fn().mockResolvedValue({ id: 'job-1', status: 4 }),
				},
			},
			getNodeParameter: (name: string, i: number, defaultValue?: any) => {
				const params: { [key: string]: any } = {
					id: 'job-1',
					error: '{"message":"Import failed","code":"PARSE_ERROR"}',
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
				url: 'https://fake.api/api/jobs/job-1/fail',
				body: { error: { message: 'Import failed', code: 'PARSE_ERROR' } },
				json: true,
			}),
		);
		expect(result[0].json).toEqual({ id: 'job-1', status: 4 });
	});

	it('should accept error as pre-parsed object', async () => {
		const mockThis = {
			getCredentials: async () => ({ url: 'https://fake.api' }),
			helpers: {
				requestWithAuthentication: {
					call: jest.fn().mockResolvedValue({ id: 'job-1', status: 4 }),
				},
			},
			getNodeParameter: (name: string, i: number, defaultValue?: any) => {
				const params: { [key: string]: any } = {
					id: 'job-1',
					error: { message: 'Direct object', stack: 'line 42' },
				};
				return params[name] !== undefined ? params[name] : defaultValue;
			},
			continueOnFail: () => false,
		} as any;
		const items = [{ json: {} }];
		await execute.call(mockThis, items);
		const body = mockThis.helpers.requestWithAuthentication.call.mock.calls[0][2].body;
		expect(body.error).toEqual({ message: 'Direct object', stack: 'line 42' });
	});

	it('should throw on malformed error JSON string', async () => {
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
					error: '{broken json!!',
				};
				return params[name] !== undefined ? params[name] : defaultValue;
			},
			continueOnFail: () => false,
		} as any;
		const items = [{ json: {} }];
		await expect(execute.call(mockThis, items)).rejects.toThrow();
		expect(mockThis.helpers.requestWithAuthentication.call).not.toHaveBeenCalled();
	});

	it('should send deeply nested error payload correctly', async () => {
		const nestedError = {
			message: 'Validation failed',
			details: {
				fields: [
					{ name: 'email', reason: 'invalid_format' },
					{ name: 'phone', reason: 'too_short' },
				],
			},
		};
		const mockThis = {
			getCredentials: async () => ({ url: 'https://fake.api' }),
			helpers: {
				requestWithAuthentication: {
					call: jest.fn().mockResolvedValue({ id: 'job-1', status: 4 }),
				},
			},
			getNodeParameter: (name: string, i: number, defaultValue?: any) => {
				const params: { [key: string]: any } = {
					id: 'job-1',
					error: JSON.stringify(nestedError),
				};
				return params[name] !== undefined ? params[name] : defaultValue;
			},
			continueOnFail: () => false,
		} as any;
		const items = [{ json: {} }];
		await execute.call(mockThis, items);
		const body = mockThis.helpers.requestWithAuthentication.call.mock.calls[0][2].body;
		expect(body.error).toEqual(nestedError);
	});

	it('should continue processing remaining items when one fails with continueOnFail', async () => {
		const mockThis = {
			getCredentials: async () => ({ url: 'https://fake.api' }),
			helpers: {
				requestWithAuthentication: {
					call: jest
						.fn()
						.mockRejectedValueOnce(new Error('server error'))
						.mockResolvedValueOnce({ id: 'job-2', status: 4 }),
				},
			},
			getNodeParameter: (name: string, i: number, defaultValue?: any) => {
				if (name === 'id') return `job-${i + 1}`;
				if (name === 'error') return '{"message":"test"}';
				return defaultValue;
			},
			continueOnFail: () => true,
		} as any;
		const items = [{ json: {} }, { json: {} }];
		const result = await execute.call(mockThis, items);
		expect(result).toHaveLength(2);
		expect(result[0].json).toEqual({ error: 'server error' });
		expect(result[1].json).toEqual({ id: 'job-2', status: 4 });
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
					error: '{"message":"test"}',
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
