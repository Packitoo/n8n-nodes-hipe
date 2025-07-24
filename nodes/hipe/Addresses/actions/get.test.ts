import { execute } from './get';

describe('Addresses get action', () => {
  it('should call helpers.requestWithAuthentication and return correct data (happy path)', async () => {
    const mockThis = {
      getCredentials: async () => ({ url: 'https://fake.api' }),
      helpers: {
        requestWithAuthentication: { call: jest.fn().mockResolvedValue({ id: 'address-1', city: 'Paris' }) },
      },
      getNodeParameter: (name: string, i: number, defaultValue?: any) => {
        if (name === 'id') return 'address-1';
        return defaultValue;
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
        url: 'https://fake.api/api/addresses/address-1',
        json: true,
      })
    );
    expect(result[0].json).toEqual({ id: 'address-1', city: 'Paris' });
  });

  it('should handle errors and push error object when continueOnFail is true (edge case)', async () => {
    const mockThis = {
      getCredentials: async () => ({ url: 'https://fake.api' }),
      helpers: {
        requestWithAuthentication: { call: jest.fn().mockRejectedValue(new Error('fail!')) },
      },
      getNodeParameter: (name: string, i: number, defaultValue?: any) => {
        if (name === 'id') return 'address-1';
        return defaultValue;
      },
      continueOnFail: () => true,
    } as any;
    const items = [{ json: {} }];
    const result = await execute.call(mockThis, items);
    expect(result[0].json).toEqual({ error: 'fail!' });
  });
});
