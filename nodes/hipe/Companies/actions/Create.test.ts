import { execute } from './Create';

describe('Create action', () => {
  it('should call helpers.request and return correct data (happy path)', async () => {
    const mockThis = {
      getCredentials: async () => ({ url: 'https://fake.api' }),
      helpers: {
        requestWithAuthentication: { call: jest.fn().mockResolvedValue({ created: true }) },
      },
      getNodeParameter: (name: string, i: number, defaultValue?: any) => {
        // Simulate n8n parameter structure
        if (name === 'additionalFields') {
          return {
            parentId: 'parent-1',
            email: 'info@acme.com',
            website: 'acme.com',
            phone: '555-0000',
            vat: 'FR123',
            customFields: {},
            collaboratorIds: { collaboratorIdFields: [ { id: 'collab-1' }, { id: 'collab-2' } ] },
          };
        }
        const params: { [key: string]: any } = {
          name: 'Acme',
          managedById: 'mgr-1',
          externalId: 'ext-1',
        };
        return params[name] !== undefined ? params[name] : defaultValue;
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
        url: 'https://fake.api/api/companies',
        body: expect.objectContaining({
          name: 'Acme',
          managedById: 'mgr-1',
          externalId: 'ext-1',
          parentId: 'parent-1',
          email: 'info@acme.com',
          website: 'acme.com',
          phone: '555-0000',
          vat: 'FR123',
          customFields: {},
          collaboratorIds: ['collab-1', 'collab-2'],
        }),
      })
    );
    expect(result[0].json).toEqual({ created: true });
  });

  it('should handle errors and push error object when continueOnFail is true (edge case)', async () => {
    const mockThis = {
      getCredentials: async () => ({ url: 'https://fake.api' }),
      helpers: {
        requestWithAuthentication: { call: jest.fn().mockRejectedValue(new Error('fail!')) },
      },
      getNodeParameter: (name: string, i: number, defaultValue?: any) => {
        if (name === 'additionalFields') {
          return { collaboratorIds: { collaboratorIdFields: [ { id: 'collab-1' }, { id: 'collab-2' } ] } };
        }
        return defaultValue;
      },
      continueOnFail: () => true,
    } as any;
    const items = [{ json: {} }];
    const result = await execute.call(mockThis, items);
    expect(result[0].json).toEqual({ error: 'fail!' });
  });
});
