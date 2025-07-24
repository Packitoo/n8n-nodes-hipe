import { execute } from './linkContact';

describe('linkContact action', () => {
  it('should call helpers.requestWithAuthentication and return correct data (happy path)', async () => {
    const mockThis = {
      getCredentials: async () => ({ url: 'https://fake.api' }),
      helpers: {
        requestWithAuthentication: { call: jest.fn().mockResolvedValue({ added: true }) },
      },
      getNodeParameter: (name: string, i: number, defaultValue?: any) => {
        const params: { [key: string]: any } = {
          contactId: 'contact-1',
          companyId: 'company-1',
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
        url: 'https://fake.api/api/companies/company-1/contacts/contact-1',
        json: true,
      })
    );
    expect(result[0].json).toEqual({ added: true });
  });

  it('should handle errors and push error object when continueOnFail is true (edge case)', async () => {
    const mockThis = {
      getCredentials: async () => ({ url: 'https://fake.api' }),
      helpers: {
        requestWithAuthentication: { call: jest.fn().mockRejectedValue(new Error('fail!')) },
      },
      getNodeParameter: (name: string, i: number, defaultValue?: any) => {
        const params: { [key: string]: any } = {
          contactId: 'contact-1',
          companyId: 'company-1',
        };
        return params[name] !== undefined ? params[name] : defaultValue;
      },
      continueOnFail: () => true,
    } as any;
    const items = [{ json: {} }];
    const result = await execute.call(mockThis, items);
    expect(result[0].json).toEqual({ error: 'fail!' });
  });
});
