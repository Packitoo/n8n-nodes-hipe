import { execute } from './Create';
import { CREATED_AT } from '../../constants';

describe('OrderItems Create action', () => {
	it('should call helpers.requestWithAuthentication and return correct data (happy path)', async () => {
		const mockThis = {
			getCredentials: async () => ({ url: 'https://fake.api' }),
			helpers: {
				requestWithAuthentication: {
					call: jest.fn().mockResolvedValue({
						id: 'item-1',
						orderId: 'order-123',
						quantity: 5,
						unitPrice: 10,
						totalPrice: 50,
						articleId: 'art-1',
					}),
				},
			},
			getNodeParameter: (name: string, i: number) => {
				const params = {
					orderId: 'order-123',
					quantity: 5,
					additionalFields: {
						articleId: 'art-1',
						[CREATED_AT.name]: '2025-01-15T10:00:00.000Z',
						unitPrice: 10,
						totalPrice: 50,
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
				url: 'https://fake.api/api/order-items',
				json: true,
				body: expect.objectContaining({
					orderId: 'order-123',
					quantity: 5,
					articleId: 'art-1',
					[CREATED_AT.name]: '2025-01-15T10:00:00.000Z',
					unitPrice: 10,
					totalPrice: 50,
				}),
			}),
		);
		expect(result[0].json).toEqual({
			id: 'item-1',
			orderId: 'order-123',
			quantity: 5,
			unitPrice: 10,
			totalPrice: 50,
			articleId: 'art-1',
		});
	});

	it('should omit null additionalFields keys from request body', async () => {
		const mockThis = {
			getCredentials: async () => ({ url: 'https://fake.api' }),
			helpers: {
				requestWithAuthentication: {
					call: jest.fn().mockResolvedValue({ id: 'item-2' }),
				},
			},
			getNodeParameter: (name: string, i: number) => {
				const params = {
					orderId: 'order-123',
					quantity: 1,
					additionalFields: {
						articleId: null,
						unitPrice: 10,
						unit: null,
					},
				};
				return (params as any)[name];
			},
			continueOnFail: () => false,
		} as any;
		const items = [{ json: {} }];
		await execute.call(mockThis, items);
		const callArgs = (mockThis.helpers.requestWithAuthentication.call as any).mock.calls[0][2];
		expect(callArgs.body).toEqual({
			orderId: 'order-123',
			quantity: 1,
			unitPrice: 10,
		});
		expect(callArgs.body).not.toHaveProperty('articleId');
		expect(callArgs.body).not.toHaveProperty('unit');
	});

	it('should send only orderId and quantity when all additionalFields are null', async () => {
		const mockThis = {
			getCredentials: async () => ({ url: 'https://fake.api' }),
			helpers: {
				requestWithAuthentication: {
					call: jest.fn().mockResolvedValue({ id: 'item-3' }),
				},
			},
			getNodeParameter: (name: string, i: number) => {
				const params = {
					orderId: 'order-456',
					quantity: 3,
					additionalFields: {
						articleId: null,
						unitPrice: null,
					},
				};
				return (params as any)[name];
			},
			continueOnFail: () => false,
		} as any;
		const items = [{ json: {} }];
		await execute.call(mockThis, items);
		const callArgs = (mockThis.helpers.requestWithAuthentication.call as any).mock.calls[0][2];
		expect(callArgs.body).toEqual({
			orderId: 'order-456',
			quantity: 3,
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
				if (name === 'orderId') return 'order-123';
				if (name === 'quantity') return 1;
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
