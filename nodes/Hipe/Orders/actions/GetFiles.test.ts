import { execute } from './GetFiles';

describe('Orders GetFiles action', () => {
	let mockThis: any;

	beforeEach(() => {
		mockThis = {
			getCredentials: jest.fn().mockResolvedValue({ url: 'https://fake.api' }),
			getNodeParameter: jest.fn((name: string) => {
				if (name === 'orderId') return 'order-123';
				if (name === 'options') return {};
				return undefined;
			}),
			helpers: {
				requestWithAuthentication: {
					call: jest.fn().mockResolvedValue([
						{ id: 'file-1', name: 'invoice.pdf' },
						{ id: 'file-2', name: 'receipt.pdf' },
					]),
				},
			},
			logger: { debug: jest.fn() },
			continueOnFail: jest.fn().mockReturnValue(false),
		};
	});

	it('retrieves files for an order', async () => {
		const items = [{ json: {} }];
		const result = await execute.call(mockThis, items);
		expect(result[0].json).toEqual([
			{ id: 'file-1', name: 'invoice.pdf' },
			{ id: 'file-2', name: 'receipt.pdf' },
		]);
		expect(mockThis.helpers.requestWithAuthentication.call).toHaveBeenCalledWith(
			mockThis,
			'hipeApi',
			expect.objectContaining({
				method: 'GET',
				url: expect.stringContaining('/api/orders/order-123/files'),
				json: true,
			}),
		);
	});

	it('handles API error and throws if continueOnFail is false', async () => {
		mockThis.helpers.requestWithAuthentication.call.mockRejectedValueOnce(new Error('fail!'));
		const items = [{ json: {} }];
		await expect(execute.call(mockThis, items)).rejects.toThrow('fail!');
	});

	it('handles API error and returns error if continueOnFail is true', async () => {
		mockThis.continueOnFail = jest.fn().mockReturnValue(true);
		mockThis.helpers.requestWithAuthentication.call.mockRejectedValueOnce(new Error('fail!'));
		const items = [{ json: {} }];
		const result = await execute.call(mockThis, items);
		expect(result[0].json.error).toBe('fail!');
	});

	it('handles multiple input items', async () => {
		const items = [{ json: {} }, { json: {} }];
		const result = await execute.call(mockThis, items);
		expect(result).toHaveLength(2);
		expect(mockThis.helpers.requestWithAuthentication.call).toHaveBeenCalledTimes(2);
	});
});
