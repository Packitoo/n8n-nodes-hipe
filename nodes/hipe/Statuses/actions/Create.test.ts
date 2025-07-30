import { execute } from './Create';

describe('Statuses Create action', () => {
  it('should call helpers.requestWithAuthentication and return correct data (happy path)', async () => {
    const mockThis = {
      getCredentials: async () => ({ url: 'https://fake.api' }),
      helpers: {
        requestWithAuthentication: { call: jest.fn().mockResolvedValue({ id: '1', entity: 'QUOTES' }) },
        request: jest.fn().mockResolvedValue({ success: true }),
      },
      getNodeParameter: (name: string) => {
        const params = {
          entity: 'QUOTES',
          position: 1,
          internalLabel: '{}',
          externalLabel: '{}',
          externalId: 'ext1',
          isCompleted: false,
          isCreation: false,
          isOverdue: false,
          additionalFields: {},
        };
        return (params as any)[name];
      },
      continueOnFail: () => false,
    } as any;
    const items = [{ json: {} }];
    const result = await execute.call(mockThis, items);
    expect(mockThis.helpers.requestWithAuthentication.call).toHaveBeenCalledWith(
      mockThis,
      'hipeApi',
      expect.objectContaining({
        method: 'POST',
        url: 'https://fake.api/api/statuses',
        body: expect.objectContaining({ entity: 'QUOTES', position: 1 }),
        json: true,
      })
    );
    expect(result[0].json).toEqual({ id: '1', entity: 'QUOTES' });
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
