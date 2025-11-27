import { execute } from './Create';

describe('Orders Create action', () => {
	it('should call helpers.requestWithAuthentication and return correct data (happy path)', async () => {
		const mockThis = {
			getCredentials: async () => ({ url: 'https://fake.api' }),
			helpers: {
				requestWithAuthentication: {
					call: jest.fn().mockResolvedValue({ id: '1', billedAmount: 1000, trackingId: 'TRACK123' }),
				},
			},
			getNodeParameter: (name: string, i: number) => {
				const params = {
					billedAmount: 1000,
					additionalFields: {
						companyId: 'comp-1',
						projectId: 'proj-1',
						trackingId: 'TRACK123',
						statusId: 'status-1',
					},
				};
				return (params as any)[name];
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
				url: 'https://fake.api/api/orders',
				json: true,
				body: expect.objectContaining({
					billedAmount: 1000,
					companyId: 'comp-1',
					projectId: 'proj-1',
					trackingId: 'TRACK123',
					statusId: 'status-1',
				}),
			}),
		);
		expect(result[0].json).toEqual({ id: '1', billedAmount: 1000, trackingId: 'TRACK123' });
	});

	it('should omit null additionalFields keys from request body', async () => {
		const mockThis = {
			getCredentials: async () => ({ url: 'https://fake.api' }),
			helpers: {
				requestWithAuthentication: {
					call: jest.fn().mockResolvedValue({ id: '2' }),
				},
			},
			getNodeParameter: (name: string, i: number) => {
				const params = {
					billedAmount: 2000,
					additionalFields: {
						companyId: null,
						projectId: 'proj-2',
						trackingId: null,
						statusId: 'status-2',
					},
				};
				return (params as any)[name];
			},
			continueOnFail: () => false,
		} as any;
		const items = [{ json: {} }];
		await execute.call(mockThis, items);
		const callArgs =
			(mockThis.helpers.requestWithAuthentication.call as any).mock.calls[0][2];
		expect(callArgs.body).toEqual({
			billedAmount: 2000,
			projectId: 'proj-2',
			statusId: 'status-2',
		});
		expect(callArgs.body).not.toHaveProperty('companyId');
		expect(callArgs.body).not.toHaveProperty('trackingId');
	});

	it('should send only billedAmount when all additionalFields values are null', async () => {
		const mockThis = {
			getCredentials: async () => ({ url: 'https://fake.api' }),
			helpers: {
				requestWithAuthentication: {
					call: jest.fn().mockResolvedValue({ id: '3' }),
				},
			},
			getNodeParameter: (name: string, i: number) => {
				const params = {
					billedAmount: 3000,
					additionalFields: {
						companyId: null,
						projectId: null,
						trackingId: null,
						statusId: null,
					},
				};
				return (params as any)[name];
			},
			continueOnFail: () => false,
		} as any;
		const items = [{ json: {} }];
		await execute.call(mockThis, items);
		const callArgs =
			(mockThis.helpers.requestWithAuthentication.call as any).mock.calls[0][2];
		expect(callArgs.body).toEqual({
			billedAmount: 3000,
		});
	});

	it('should handle errors and push error object when continueOnFail is true', async () => {
		const mockThis = {
			getCredentials: async () => ({ url: 'https://fake.api' }),
			helpers: {
				requestWithAuthentication: {
					call: jest.fn().mockRejectedValue(new Error('fail!')),
				},
			},
			getNodeParameter: (name: string) => {
				if (name === 'billedAmount') return 1000;
				if (name === 'additionalFields') return {};
				return undefined;
			},
			continueOnFail: () => true,
		} as any;
		const items = [{ json: {} }];
		const result = await execute.call(mockThis, items);
		expect(result[0].json).toEqual({ error: 'fail!' });
	});
});
