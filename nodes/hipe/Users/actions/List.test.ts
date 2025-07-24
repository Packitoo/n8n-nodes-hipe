import { execute } from './List';

describe('List action', () => {
  it('should call helpers.requestWithAuthentication and return correct data (happy path)', async () => {
    const mockThis = {
      getCredentials: async () => ({ url: 'https://fake.api' }),
      helpers: {
        requestWithAuthentication: {
          call: jest.fn().mockResolvedValue([{ id: '1', name: 'John Doe' }]),
        },
      },
      getNodeParameter: (name: string, i: number) => {
        if (name === 'returnAll') return true;
        if (name === 'filters') return {};
        if (name === 'sort') return {};
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
        method: 'GET',
        url: 'https://fake.api/api/users',
        qs: {},
        json: true,
      })
    );
    expect(result[0].json).toEqual({ data: [{ id: '1', name: 'John Doe' }] });
  });

  it('should handle paginated response (edge case)', async () => {
    const mockThis = {
      getCredentials: async () => ({ url: 'https://fake.api' }),
      helpers: {
        requestWithAuthentication: {
          call: jest.fn().mockResolvedValue({ data: [{ id: '2', name: 'Jane' }], pagination: { total: 1 } }),
        },
      },
      getNodeParameter: (name: string, i: number) => {
        if (name === 'returnAll') return true;
        if (name === 'filters') return {};
        if (name === 'sort') return {};
        return undefined;
      },
      continueOnFail: () => false,
    } as any;
    const items = [{ json: {} }];
    const result = await execute.call(mockThis, items);
    expect(result[0].json).toEqual({ data: [{ id: '2', name: 'Jane' }], pagination: { total: 1 } });
  });

  it('should handle errors and push error object when continueOnFail is true (edge case)', async () => {
    const mockThis = {
      getCredentials: async () => ({ url: 'https://fake.api' }),
      helpers: {
        requestWithAuthentication: {
          call: jest.fn().mockRejectedValue(new Error('fail!')),
        },
      },
      getNodeParameter: (name: string, i: number) => {
        if (name === 'returnAll') return true;
        if (name === 'filters') return {};
        if (name === 'sort') return {};
        if (name === 'limit') return 50;
        return undefined;
      },
      continueOnFail: () => true,
    } as any;
    const items = [{ json: {} }];
    const result = await execute.call(mockThis, items);
    expect(result[0].json).toEqual({ error: 'fail!' });
  });
});
