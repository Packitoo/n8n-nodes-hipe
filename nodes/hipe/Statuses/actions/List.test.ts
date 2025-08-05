import { execute } from './List';

describe('Statuses List action', () => {
	it('should call helpers.requestWithAuthentication and return correct data (happy path, array)', async () => {
		const mockThis = {
			getCredentials: async () => ({ url: 'https://fake.api' }),
			helpers: {
				requestWithAuthentication: {
					call: jest.fn().mockResolvedValue([{ id: '1', entity: 'QUOTES' }]),
				},
			},
			getNodeParameter: (name: string) => {
				if (name === 'entity') return 'QUOTES';
				return undefined;
			},
			continueOnFail: () => false,
		} as any;
		const items = [{ json: {} }];
		const result: any = await execute.call(mockThis, items);
		expect(result[0].json).toEqual({ id: '1', entity: 'QUOTES' });
	});

	it('should call helpers.requestWithAuthentication and return correct data (happy path, object)', async () => {
		const mockThis = {
			getCredentials: async () => ({ url: 'https://fake.api' }),
			helpers: {
				requestWithAuthentication: {
					call: jest.fn().mockResolvedValue({ id: '2', entity: 'ORDERS' }),
				},
			},
			getNodeParameter: (name: string) => {
				if (name === 'entity') return 'ORDERS';
				return undefined;
			},
			continueOnFail: () => false,
		} as any;
		const items = [{ json: {} }];
		const result: any = await execute.call(mockThis, items);
		expect(result[0].json).toEqual({ id: '2', entity: 'ORDERS' });
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
		const result: any = await execute.call(mockThis, items);
		expect(result[0].json).toEqual({ error: 'fail!' });
	});
});
