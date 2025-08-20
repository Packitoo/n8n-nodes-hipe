import { execute } from './Update';
import type { IExecuteFunctions } from 'n8n-workflow';

describe('CorrugatedLiners Update credential error handling', () => {
  function makeThis(continueOnFail: boolean, creds: any, helpers?: any): IExecuteFunctions {
    return {
      getCredentials: async () => creds,
      getNodeParameter: (name: string) => {
        if (name === 'linerId') return 'liner_123';
        if (name === 'updateFields') return { name: 'New Liner' };
        return undefined as any;
      },
      continueOnFail: () => continueOnFail,
      helpers,
    } as any;
  }

  it('throws when base URL is invalid (outside try/catch)', async () => {
    const self = makeThis(true, { url: 123 as any });
    await expect((execute as any).call(self, [{ json: {} }])).rejects.toThrow(
      'HIPE base URL is not a string',
    );
  });

  it('continueOnFail=true: returns error object when requestWithAuthentication fails', async () => {
    const self = makeThis(
      true,
      { url: 'https://hipe.test' },
      { requestWithAuthentication: jest.fn().mockRejectedValue(new Error('401 Unauthorized')) },
    );
    const res = await (execute as any).call(self, [{ json: {} }]);
    expect(res[0].json).toEqual({ error: '401 Unauthorized' });
  });

  it('continueOnFail=false: bubbles the error when requestWithAuthentication fails', async () => {
    const self = makeThis(
      false,
      { url: 'https://hipe.test' },
      { requestWithAuthentication: jest.fn().mockRejectedValue(new Error('401 Unauthorized')) },
    );
    await expect((execute as any).call(self, [{ json: {} }])).rejects.toThrow('401 Unauthorized');
  });
});
