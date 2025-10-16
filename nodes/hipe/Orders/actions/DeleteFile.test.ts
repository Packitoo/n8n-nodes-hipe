import { execute } from './DeleteFile';

describe('Orders DeleteFile action', () => {
	it('should call helpers.requestWithAuthentication and return success (happy path)', async () => {
		const mockThis = {
			getCredentials: async () => ({ url: 'https://fake.api' }),
			helpers: {
				requestWithAuthentication: {
					call: jest.fn().mockResolvedValue(undefined),
				},
			},
			getNodeParameter: (name: string) => {
				if (name === 'orderId') return 'order-123';
				if (name === 'fileId') return 'file-456';
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
				url: 'https://fake.api/api/orders/order-123/files/file-456',
				json: true,
			}),
		);
		expect(result[0].json).toEqual({ success: true, orderId: 'order-123', fileId: 'file-456' });
	});

	it('should handle errors and push error object when continueOnFail is true', async () => {
		const mockThis = {
			getCredentials: async () => ({ url: 'https://fake.api' }),
			helpers: {
				requestWithAuthentication: {
					call: jest.fn().mockRejectedValue(new Error('File not found')),
				},
			},
			getNodeParameter: (name: string) => {
				if (name === 'orderId') return 'order-123';
				if (name === 'fileId') return 'invalid-file';
				return undefined;
			},
			continueOnFail: () => true,
		} as any;
		const items = [{ json: {} }];
		const result = await execute.call(mockThis, items);
		expect(result[0].json).toEqual({ error: 'File not found' });
	});

	it('should handle multiple deletions', async () => {
		const mockThis = {
			getCredentials: async () => ({ url: 'https://fake.api' }),
			helpers: {
				requestWithAuthentication: {
					call: jest.fn().mockResolvedValue(undefined),
				},
			},
			getNodeParameter: jest.fn((name: string, i: number) => {
				if (name === 'orderId') return i === 0 ? 'order-1' : 'order-2';
				if (name === 'fileId') return i === 0 ? 'file-1' : 'file-2';
				return undefined;
			}),
			continueOnFail: () => false,
		} as any;
		const items = [{ json: {} }, { json: {} }];
		const result = await execute.call(mockThis, items);
		expect(result).toHaveLength(2);
		expect(mockThis.helpers.requestWithAuthentication.call).toHaveBeenCalledTimes(2);
		expect(result[0].json).toEqual({ success: true, orderId: 'order-1', fileId: 'file-1' });
		expect(result[1].json).toEqual({ success: true, orderId: 'order-2', fileId: 'file-2' });
	});
});
