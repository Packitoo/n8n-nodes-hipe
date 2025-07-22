import { execute } from './Create';

describe('Create action', () => {
  it('should call helpers.request and return correct data (happy path)', async () => {
    const mockThis = {
      getCredentials: async () => ({ url: 'https://fake.api' }),
      helpers: {
        request: jest.fn().mockResolvedValue({ created: true }),
      },
      getNodeParameter: (name: string, i: number) => {
        const params: { [key: string]: any } = {
          name: 'Acme',
          managedById: 'mgr-1',
          externalId: 'ext-1',
          collaboraterIds: ['collab-1'],
          parentId: 'parent-1',
          email: 'info@acme.com',
          website: 'acme.com',
          phone: '555-0000',
          vat: 'FR123',
          customFields: {},
        };
        return params[name];
      },
      continueOnFail: () => false,
    } as any;
    const items = [{ json: {} }];
    const result = await execute.call(mockThis, items);
    expect(mockThis.helpers.request).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'POST',
        url: 'https://fake.api/api/companies',
        body: expect.objectContaining({ name: 'Acme' }),
      })
    );
    expect(result[0].json).toEqual({ created: true });
  });

  it('should handle errors and push error object when continueOnFail is true (edge case)', async () => {
    const mockThis = {
      getCredentials: async () => ({ url: 'https://fake.api' }),
      helpers: {
        request: jest.fn().mockRejectedValue(new Error('fail!')),
      },
      getNodeParameter: () => undefined,
      continueOnFail: () => true,
    } as any;
    const items = [{ json: {} }];
    const result = await execute.call(mockThis, items);
    expect(result[0].json).toEqual({ error: 'fail!' });
  });
});
