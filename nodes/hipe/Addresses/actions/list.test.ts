import { execute } from './list';

describe('Addresses list action', () => {
  it('should call helpers.requestWithAuthentication and return correct data (happy path)', async () => {
    const mockThis = {
      getCredentials: async () => ({ url: 'https://fake.api' }),
      helpers: {
        requestWithAuthentication: { call: jest.fn().mockResolvedValue([{ id: 'address-1' }, { id: 'address-2' }]) },
      },
      getNodeParameter: (name: string, i: number, defaultValue?: any) => defaultValue,
      continueOnFail: () => false,
    } as any;
    const items = [{ json: {} }];
    const result = await execute.call(mockThis, items);
    expect(mockThis.helpers.requestWithAuthentication.call).toHaveBeenCalledWith(
      mockThis,
      'hipeApi',
      expect.objectContaining({
        method: 'GET',
        url: 'https://fake.api/api/addresses',
        json: true,
      })
    );
    expect(result[0].json).toEqual([{ id: 'address-1' }, { id: 'address-2' }]);
  });

  it('should handle errors and push error object when continueOnFail is true (edge case)', async () => {
    const mockThis = {
      getCredentials: async () => ({ url: 'https://fake.api' }),
      helpers: {
        requestWithAuthentication: { call: jest.fn().mockRejectedValue(new Error('fail!')) },
      },
      getNodeParameter: (name: string, i: number, defaultValue?: any) => defaultValue,
      continueOnFail: () => true,
    } as any;
    const items = [{ json: {} }];
    const result = await execute.call(mockThis, items);
    expect(result[0].json).toEqual({ error: 'fail!' });
  });
});
