import { execute } from './CreateContact';

describe('CreateContact action', () => {
  it('should build the correct request payload and call helpers.request', async () => {
    // Mock n8n context
    const mockThis = {
      getCredentials: async () => ({ url: 'https://fake.api' }),
      helpers: {
        request: jest.fn().mockResolvedValue({ success: true }),
      },
      getNodeParameter: (name: string, i: number) => {
        const params: { [key: string]: any } = {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@doe.com',
          externalId: '123',
          phoneNumber: '555-1234',
          mobilePhone: '555-5678',
          job: 'Engineer',
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
        url: 'https://fake.api/api/users/contacts',
      })
    );
    expect(result[0].json).toEqual({ success: true });
  });
});
