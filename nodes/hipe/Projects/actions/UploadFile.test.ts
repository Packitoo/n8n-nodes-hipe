import { execute } from './UploadFile';


describe('UploadFile action', () => {
  let mockThis: any;

  beforeEach(() => {
    mockThis = {
      getCredentials: jest.fn().mockResolvedValue({ url: 'https://fake.api' }),
      getNodeParameter: jest.fn((name: string) => {
        if (name === 'projectId') return 'proj-123';
        if (name === 'binaryPropertyName') return 'data';
        return undefined;
      }),
      helpers: {
        getBinaryDataBuffer: jest.fn().mockResolvedValue(Buffer.from('test file content')),
        requestWithAuthentication: {
          call: jest.fn().mockResolvedValue({ fileId: 'file-xyz', status: 'uploaded' }),
        },
      },
      logger: { debug: jest.fn() },
      continueOnFail: jest.fn().mockReturnValue(false),
    };
  });

  it('uploads a file successfully', async () => {
    const items = [{
      json: {},
      binary: {
        data: {
          data: Buffer.from('test file content').toString('base64'),
          mimeType: 'application/pdf',
          fileName: 'test.pdf',
        },
      },
    }];
    const result = await execute.call(mockThis, items);
    expect(result[0].json.success).toBe(true);
    expect(result[0].json.response).toEqual({ fileId: 'file-xyz', status: 'uploaded' });
    expect(mockThis.helpers.requestWithAuthentication.call).toHaveBeenCalledWith(
      mockThis,
      'hipeApi',
      expect.objectContaining({
        method: 'POST',
        url: expect.stringContaining('/api/projects/proj-123/files'),
        formData: expect.objectContaining({
          file: expect.objectContaining({
            value: expect.any(Buffer),
            options: expect.objectContaining({
              filename: 'test.pdf',
              contentType: 'application/pdf',
            }),
          }),
        }),
      })
    );
  });

  it('throws a descriptive error if binary property is missing', async () => {
    const items = [{ json: {}, binary: {} }];
    await expect(execute.call(mockThis, items)).rejects.toThrow(
      'Binary property "data" not found on item. Available binary keys: '
    );
  });

  it('handles continueOnFail gracefully', async () => {
    mockThis.continueOnFail = jest.fn().mockReturnValue(true);
    const items = [{ json: {}, binary: {} }];
    const result = await execute.call(mockThis, items);
    expect(result[0].json.error).toMatch(/Binary property/);
  });

  it('uploads file with fallback filename and contentType', async () => {
    const items = [{
      json: {}, // Added json property
      binary: {
        data: {
          data: Buffer.from('test').toString('base64'),
          mimeType: 'application/octet-stream',
        },
      },
    }];
    await execute.call(mockThis, items);
    const callArgs = mockThis.helpers.requestWithAuthentication.call.mock.calls[0][2];
    expect(callArgs.formData.file.options.filename).toBe('upload.bin');
    expect(callArgs.formData.file.options.contentType).toBe('application/octet-stream');
  });

  it('handles multiple input items', async () => {
    const items = [
      { json: {}, binary: { data: { data: Buffer.from('a').toString('base64'), fileName: 'a.txt', mimeType: 'text/plain' } } },
      { json: {}, binary: { data: { data: Buffer.from('b').toString('base64'), fileName: 'b.txt', mimeType: 'text/plain' } } },
    ];
    const result = await execute.call(mockThis, items);
    expect(result).toHaveLength(2);
    expect(mockThis.helpers.requestWithAuthentication.call).toHaveBeenCalledTimes(2);
  });
});
