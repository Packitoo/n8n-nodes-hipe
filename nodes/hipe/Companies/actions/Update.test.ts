import { execute } from './Update';

describe('Update action', () => {
  it('should call helpers.request and return correct data (happy path)', async () => {
    const mockThis = {
      getCredentials: async () => ({ url: 'https://fake.api' }),
      helpers: {
        requestWithAuthentication: { call: jest.fn().mockResolvedValue({ updated: true }) },
      },
      getNodeParameter: (name: string, i: number, defaultValue?: any) => {
        if (name === 'id') return '1';
        if (name === 'updateFields') return { name: 'Acme Updated' };
        return defaultValue;
      },
      continueOnFail: () => false,
    } as any;
    const items = [{ json: {} }];
    const result = await execute.call(mockThis, items);
    expect(mockThis.helpers.requestWithAuthentication.call).toHaveBeenCalledWith(
      mockThis,
      'hipe',
      expect.objectContaining({
        method: 'PATCH',
        url: 'https://fake.api/api/companies/1',
        body: { name: 'Acme Updated' },
      })
    );
    expect(result[0].json).toEqual({ updated: true });
  });

  it('should handle errors and push error object when continueOnFail is true (edge case)', async () => {
    const mockThis = {
      getCredentials: async () => ({ url: 'https://fake.api' }),
      helpers: { requestWithAuthentication: { call: jest.fn().mockRejectedValue(new Error('fail!')) } },
      getNodeParameter: (name: string, i: number, defaultValue?: any) => {
        if (name === 'id') return '1';
        if (name === 'updateFields') return { name: 'Acme Updated' };
        return defaultValue;
      },
      continueOnFail: () => true,
    } as any;
    const items = [{ json: {} }];
    const result = await execute.call(mockThis, items);
    expect(result[0].json).toEqual({ error: 'fail!' });
  });
});
