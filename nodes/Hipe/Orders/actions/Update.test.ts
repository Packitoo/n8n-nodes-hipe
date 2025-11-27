import { execute } from './Update';

describe('Orders Update action', () => {
	it('should call helpers.requestWithAuthentication and return correct data (happy path)', async () => {
		const mockThis = {
			getCredentials: async () => ({ url: 'https://fake.api' }),
			helpers: {
				requestWithAuthentication: {
					call: jest.fn().mockResolvedValue({ id: '1', billedAmount: 1500, trackingId: 'NEW123' }),
				},
			},
			getNodeParameter: (name: string) => {
				if (name === 'id') return '1';
				if (name === 'updateFields') return { billedAmount: 1500, trackingId: 'NEW123' };
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
				method: 'PATCH',
				url: 'https://fake.api/api/orders/1',
				json: true,
				body: { billedAmount: 1500, trackingId: 'NEW123' },
			}),
		);
		expect(result[0].json).toEqual({ id: '1', billedAmount: 1500, trackingId: 'NEW123' });
	});

	it('should omit null updateFields keys from PATCH body', async () => {
		const mockThis = {
			getCredentials: async () => ({ url: 'https://fake.api' }),
			helpers: {
				requestWithAuthentication: {
					call: jest.fn().mockResolvedValue({ id: '1' }),
				},
			},
			getNodeParameter: (name: string) => {
				if (name === 'id') return '1';
				if (name === 'updateFields')
					return {
						billedAmount: null,
						trackingId: 'KEEP',
						statusId: null,
					};
				return undefined;
			},
			continueOnFail: () => false,
		} as any;
		const items = [{ json: {} }];
		await execute.call(mockThis, items);
		const callArgs =
			(mockThis.helpers.requestWithAuthentication.call as any).mock.calls[0][2];
		expect(callArgs.body).toEqual({ trackingId: 'KEEP' });
		expect(callArgs.body).not.toHaveProperty('billedAmount');
		expect(callArgs.body).not.toHaveProperty('statusId');
	});

	it('should send empty body when all updateFields values are null', async () => {
		const mockThis = {
			getCredentials: async () => ({ url: 'https://fake.api' }),
			helpers: {
				requestWithAuthentication: {
					call: jest.fn().mockResolvedValue({ id: '1' }),
				},
			},
			getNodeParameter: (name: string) => {
				if (name === 'id') return '1';
				if (name === 'updateFields')
					return {
						billedAmount: null,
						trackingId: null,
					};
				return undefined;
			},
			continueOnFail: () => false,
		} as any;
		const items = [{ json: {} }];
		await execute.call(mockThis, items);
		const callArgs =
			(mockThis.helpers.requestWithAuthentication.call as any).mock.calls[0][2];
		expect(callArgs.body).toEqual({});
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
				if (name === 'id') return '1';
				if (name === 'updateFields') return {};
				return undefined;
			},
			continueOnFail: () => true,
		} as any;
		const items = [{ json: {} }];
		const result = await execute.call(mockThis, items);
		expect(result[0].json).toEqual({ error: 'fail!' });
	});
});
