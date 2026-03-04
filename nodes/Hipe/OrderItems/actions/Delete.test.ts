import { execute } from './Delete';

describe('OrderItems Delete action', () => {
	it('should call helpers.requestWithAuthentication and return correct data (happy path, soft delete)', async () => {
		const mockThis = {
			getCredentials: async () => ({ url: 'https://fake.api' }),
			helpers: {
				requestWithAuthentication: {
					call: jest.fn().mockResolvedValue({ success: true }),
				},
			},
			getNodeParameter: (name: string) => {
				if (name === 'orderItemId') return 'item-123';
				if (name === 'hardDelete') return false;
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
				method: 'DELETE',
				url: 'https://fake.api/api/order-items/item-123',
				json: true,
				qs: {},
			}),
		);
		expect(result[0].json).toEqual({ success: true });
	});

	it('should pass hardDelete=true as a query parameter', async () => {
		const mockThis = {
			getCredentials: async () => ({ url: 'https://fake.api' }),
			helpers: {
				requestWithAuthentication: {
					call: jest.fn().mockResolvedValue({ success: true }),
				},
			},
			getNodeParameter: (name: string) => {
				if (name === 'orderItemId') return 'item-123';
				if (name === 'hardDelete') return true;
				return undefined;
			},
			continueOnFail: () => false,
		} as any;
		const items = [{ json: {} }];
		await execute.call(mockThis, items);
		expect(mockThis.helpers.requestWithAuthentication.call).toHaveBeenCalledWith(
			mockThis,
			'hipeApi',
			expect.objectContaining({
				method: 'DELETE',
				url: 'https://fake.api/api/order-items/item-123',
				json: true,
				qs: { hardDelete: true },
			}),
		);
	});

	it('should return { success: true } when API returns void/undefined', async () => {
		const mockThis = {
			getCredentials: async () => ({ url: 'https://fake.api' }),
			helpers: {
				requestWithAuthentication: {
					call: jest.fn().mockResolvedValue(undefined),
				},
			},
			getNodeParameter: (name: string) => {
				if (name === 'orderItemId') return 'item-123';
				if (name === 'hardDelete') return false;
				return undefined;
			},
			continueOnFail: () => false,
		} as any;
		const items = [{ json: {} }];
		const result = await execute.call(mockThis, items);
		expect(result[0].json).toEqual({ success: true });
	});

	it('should handle errors and push error object when continueOnFail is true', async () => {
		const mockThis = {
			getCredentials: async () => ({ url: 'https://fake.api' }),
			helpers: {
				requestWithAuthentication: {
					call: jest.fn().mockRejectedValue(new Error('Not found')),
				},
			},
			getNodeParameter: (name: string) => {
				if (name === 'orderItemId') return 'invalid-id';
				if (name === 'hardDelete') return false;
				return undefined;
			},
			continueOnFail: () => true,
		} as any;
		const items = [{ json: {} }];
		const result = await execute.call(mockThis, items);
		expect(result[0].json).toEqual({ error: 'Not found' });
	});

	it('should handle multiple input items', async () => {
		const mockThis = {
			getCredentials: async () => ({ url: 'https://fake.api' }),
			helpers: {
				requestWithAuthentication: {
					call: jest
						.fn()
						.mockResolvedValueOnce({ success: true })
						.mockResolvedValueOnce({ success: true }),
				},
			},
			getNodeParameter: jest.fn((name: string, i: number) => {
				if (name === 'orderItemId') return i === 0 ? 'item-1' : 'item-2';
				if (name === 'hardDelete') return false;
				return undefined;
			}),
			continueOnFail: () => false,
		} as any;
		const items = [{ json: {} }, { json: {} }];
		const result = await execute.call(mockThis, items);
		expect(result).toHaveLength(2);
		expect(mockThis.helpers.requestWithAuthentication.call).toHaveBeenCalledTimes(2);
	});
});
