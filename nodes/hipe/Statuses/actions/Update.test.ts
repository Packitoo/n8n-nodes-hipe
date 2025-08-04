import { execute } from './Update';

describe('Statuses Update action', () => {
  it('should call helpers.requestWithAuthentication and return correct data (happy path)', async () => {
    const mockThis = {
      getCredentials: async () => ({ url: 'https://fake.api' }),
      helpers: {
        requestWithAuthentication: { call: jest.fn().mockResolvedValue({ id: '1', entity: 'QUOTES', updated: true }) },
        request: jest.fn().mockResolvedValue({ success: true }),
      },
      getNodeParameter: (name: string) => {
        if (name === 'statusId') return '1';
        if (name === 'additionalFields') return { entity: 'QUOTES', updated: true };
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
        url: 'https://fake.api/api/statuses/1',
        body: { entity: 'QUOTES', updated: true },
        json: true,
      })
    );
    expect(result[0].json).toEqual({ id: '1', entity: 'QUOTES', updated: true });
  });

  it('should handle errors and push error object when continueOnFail is true', async () => {
    const mockThis = {
      getCredentials: async () => ({ url: 'https://fake.api' }),
      helpers: {
  requestWithAuthentication: { call: jest.fn().mockRejectedValue(new Error('fail!')) },
  request: jest.fn(),
},
      getNodeParameter: () => undefined,
      continueOnFail: () => true,
    } as any;
    const items = [{ json: {} }];
    const result = await execute.call(mockThis, items);
    expect(result[0].json).toEqual({ error: 'fail!' });
  });
});
