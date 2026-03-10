import { execute } from './Update';
import { TIMESTAMP_CREATION } from '../../constants';

describe('OrderItems Update action', () => {
	it('should call helpers.requestWithAuthentication and return correct data (happy path)', async () => {
		const mockThis = {
			getCredentials: async () => ({ url: 'https://fake.api' }),
			helpers: {
				requestWithAuthentication: {
					call: jest.fn().mockResolvedValue({
						id: 'item-1',
						[TIMESTAMP_CREATION.createdAt]: '2025-01-15T10:00:00.000Z',
						quantity: 10,
						unitPrice: 15,
						totalPrice: 150,
					}),
				},
			},
			getNodeParameter: (name: string) => {
				if (name === 'id') return 'item-1';
				if (name === 'updateFields')
					return {
						[TIMESTAMP_CREATION.createdAt]: '2025-01-15T10:00:00.000Z',
						quantity: 10,
						unitPrice: 15,
						totalPrice: 150,
					};
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
				url: 'https://fake.api/api/order-items/item-1',
				json: true,
				body: {
					[TIMESTAMP_CREATION.createdAt]: '2025-01-15T10:00:00.000Z',
					quantity: 10,
					unitPrice: 15,
					totalPrice: 150,
				},
			}),
		);
		expect(result[0].json).toEqual({
			id: 'item-1',
			[TIMESTAMP_CREATION.createdAt]: '2025-01-15T10:00:00.000Z',
			quantity: 10,
			unitPrice: 15,
			totalPrice: 150,
		});
	});

	it('should omit null updateFields keys from PATCH body', async () => {
		const mockThis = {
			getCredentials: async () => ({ url: 'https://fake.api' }),
			helpers: {
				requestWithAuthentication: {
					call: jest.fn().mockResolvedValue({ id: 'item-1' }),
				},
			},
			getNodeParameter: (name: string) => {
				if (name === 'id') return 'item-1';
				if (name === 'updateFields')
					return {
						quantity: null,
						unitPrice: 20,
						unit: null,
					};
				return undefined;
			},
			continueOnFail: () => false,
		} as any;
		const items = [{ json: {} }];
		await execute.call(mockThis, items);
		const callArgs = (mockThis.helpers.requestWithAuthentication.call as any).mock.calls[0][2];
		expect(callArgs.body).toEqual({ unitPrice: 20 });
		expect(callArgs.body).not.toHaveProperty('quantity');
		expect(callArgs.body).not.toHaveProperty('unit');
	});

	it('should send empty body when all updateFields values are null', async () => {
		const mockThis = {
			getCredentials: async () => ({ url: 'https://fake.api' }),
			helpers: {
				requestWithAuthentication: {
					call: jest.fn().mockResolvedValue({ id: 'item-1' }),
				},
			},
			getNodeParameter: (name: string) => {
				if (name === 'id') return 'item-1';
				if (name === 'updateFields')
					return {
						quantity: null,
						unitPrice: null,
					};
				return undefined;
			},
			continueOnFail: () => false,
		} as any;
		const items = [{ json: {} }];
		await execute.call(mockThis, items);
		const callArgs = (mockThis.helpers.requestWithAuthentication.call as any).mock.calls[0][2];
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
				if (name === 'id') return 'item-1';
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
