import { execute } from './List';

describe('Projects List action', () => {
  it('should call helpers.requestWithAuthentication and return correct data (happy path, array)', async () => {
    const mockThis = {
      getCredentials: async () => ({ url: 'https://fake.api' }),
      helpers: {
        requestWithAuthentication: {
          call: jest.fn().mockResolvedValue([{ id: '1', name: 'Project X' }]),
        },
      },
      getNodeParameter: (name: string) => {
        if (name === 'returnAll') return true;
        if (name === 'filters') return {};
        if (name === 'sort') return {};
        return undefined;
      },
      continueOnFail: () => false,
    } as any;
    const items = [{ json: {} }];
    const result = await execute.call(mockThis, items);
    expect(result[0].json).toEqual({ data: [{ id: '1', name: 'Project X' }] });
  });

  it('should call helpers.requestWithAuthentication and return correct data (happy path, paginated)', async () => {
    const mockThis = {
      getCredentials: async () => ({ url: 'https://fake.api' }),
      helpers: {
        requestWithAuthentication: {
          call: jest.fn().mockResolvedValue({ data: [{ id: '2', name: 'Project Y' }], pagination: { total: 1 } }),
        },
      },
      getNodeParameter: (name: string) => {
        if (name === 'returnAll') return true;
        if (name === 'filters') return {};
        if (name === 'sort') return {};
        return undefined;
      },
      continueOnFail: () => false,
    } as any;
    const items = [{ json: {} }];
    const result = await execute.call(mockThis, items);
    expect(result[0].json).toEqual({ data: [{ id: '2', name: 'Project Y' }], pagination: { total: 1 } });
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
        if (name === 'returnAll') return true;
        if (name === 'filters') return {};
        if (name === 'sort') return {};
        return undefined;
      },
      continueOnFail: () => true,
    } as any;
    const items = [{ json: {} }];
    const result = await execute.call(mockThis, items);
    expect(result[0].json).toEqual({ error: 'fail!' });
  });
});
