import { execute } from './Create';

describe('Projects Create action', () => {
  it('should call helpers.requestWithAuthentication and return correct data (happy path)', async () => {
    const mockThis = {
      getCredentials: async () => ({ url: 'https://fake.api' }),
      helpers: {
        requestWithAuthentication: {
          call: jest.fn().mockResolvedValue({ id: '1', name: 'Project X' }),
        },
      },
      getNodeParameter: (name: string, i: number) => {
        const params = {
          name: 'Project X',
          companyId: 'comp1',
          managerId: 'mgr1',
          externalId: 'ext1',
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
        url: 'https://fake.api/api/projects',
        json: true,
        body: expect.objectContaining({ name: 'Project X', companyId: 'comp1', managerId: 'mgr1', externalId: 'ext1' }),
      })
    );
    expect(result[0].json).toEqual({ id: '1', name: 'Project X' });
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
    const result = await execute.call(mockThis, items);
    expect(result[0].json).toEqual({ error: 'fail!' });
  });
});
