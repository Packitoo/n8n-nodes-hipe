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

	it('should handle errors and push error object when continueOnFail is true', async () => {
		const mockThis = {
			getCredentials: async () => ({ url: 'https://fake.api' }),
			helpers: {
				requestWithAuthentication: {
					call: jest.fn().mockRejectedValue(new Error('fail!')),
				},
			},
			getNodeParameter: () => undefined,
			continueOnFail: () => true,
		} as any;
		const items = [{ json: {} }];
		const result = await execute.call(mockThis, items);
		expect(result[0].json).toEqual({ error: 'fail!' });
	});
});
