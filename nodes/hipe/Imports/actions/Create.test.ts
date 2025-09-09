import { execute } from './Create';

describe('Imports Create action', () => {
	it('should call helpers.requestWithAuthentication and return correct data (happy path)', async () => {
		const mockBuffer = Buffer.from('name,email\nJohn,john@example.com');
		const mockThis = {
			getCredentials: async () => ({ url: 'https://fake.api' }),
			helpers: {
				requestWithAuthentication: {
					call: jest.fn().mockResolvedValue({ id: 'import-123', status: 'pending' }),
				},
				getBinaryDataBuffer: jest.fn().mockResolvedValue(mockBuffer),
			},
			getNodeParameter: (name: string, i: number) => {
				const params: { [key: string]: any } = {
					type: 1,
					delimiter: ',',
					binaryPropertyName: 'data',
				};
				return params[name];
			},
			continueOnFail: () => false,
		} as any;

		const items = [
			{
				json: {},
				binary: {
					data: {
						data: 'mock-data',
						fileName: 'test.csv',
						mimeType: 'text/csv',
					},
				},
			},
		];

		const result = await execute.call(mockThis, items);

		expect(mockThis.helpers.requestWithAuthentication.call).toHaveBeenCalledWith(
			mockThis,
			'hipeApi',
			expect.objectContaining({
				method: 'POST',
				url: 'https://fake.api/api/imports',
				json: true,
				formData: expect.objectContaining({
					type: '1',
					delimiter: ',',
					csv: expect.objectContaining({
						value: mockBuffer,
						options: expect.objectContaining({
							filename: 'test.csv',
							contentType: 'text/csv',
						}),
					}),
				}),
			}),
		);
		expect(result[0].json).toEqual({ id: 'import-123', status: 'pending' });
	});

	it('should handle missing binary property and throw error', async () => {
		const mockThis = {
			getCredentials: async () => ({ url: 'https://fake.api' }),
			helpers: {
				requestWithAuthentication: { call: jest.fn() },
				getBinaryDataBuffer: jest.fn(),
			},
			getNodeParameter: (name: string, i: number) => {
				const params: { [key: string]: any } = {
					type: 1,
					delimiter: ',',
					binaryPropertyName: 'data',
				};
				return params[name];
			},
			continueOnFail: () => false,
		} as any;

		const items = [{ json: {}, binary: {} }];

		await expect(execute.call(mockThis, items)).rejects.toThrow(
			'Binary property "data" not found on item. Available binary keys: ',
		);
	});

	it('should use default filename and contentType when not provided', async () => {
		const mockBuffer = Buffer.from('name,email\nJohn,john@example.com');
		const mockThis = {
			getCredentials: async () => ({ url: 'https://fake.api' }),
			helpers: {
				requestWithAuthentication: { call: jest.fn().mockResolvedValue({ id: 'import-456' }) },
				getBinaryDataBuffer: jest.fn().mockResolvedValue(mockBuffer),
			},
			getNodeParameter: (name: string, i: number) => {
				const params: { [key: string]: any } = {
					type: 2,
					delimiter: ';',
					binaryPropertyName: 'file',
				};
				return params[name];
			},
			continueOnFail: () => false,
		} as any;

		const items = [
			{
				json: {},
				binary: {
					file: {
						data: 'mock-data',
						mimeType: 'text/csv',
					}, // No fileName or mimeType
				},
			},
		];

		await execute.call(mockThis, items);

		expect(mockThis.helpers.requestWithAuthentication.call).toHaveBeenCalledWith(
			mockThis,
			'hipeApi',
			expect.objectContaining({
				formData: expect.objectContaining({
					csv: expect.objectContaining({
						options: expect.objectContaining({
							filename: 'upload.csv',
							contentType: 'text/csv',
						}),
					}),
				}),
			}),
		);
	});

	it('should handle errors and push error object when continueOnFail is true', async () => {
		const mockThis = {
			getCredentials: async () => ({ url: 'https://fake.api' }),
			helpers: {
				requestWithAuthentication: {
					call: jest.fn().mockRejectedValue(new Error('Upload failed')),
				},
				getBinaryDataBuffer: jest.fn().mockResolvedValue(Buffer.from('test')),
			},
			getNodeParameter: (name: string, i: number) => {
				const params: { [key: string]: any } = {
					type: 1,
					delimiter: ',',
					binaryPropertyName: 'data',
				};
				return params[name];
			},
			continueOnFail: () => true,
		} as any;

		const items = [
			{
				json: {},
				binary: {
					data: {
						data: 'mock-data',
						fileName: 'test.csv',
						mimeType: 'text/csv',
					},
				},
			},
		];

		const result = await execute.call(mockThis, items);
		expect(result[0].json).toEqual({ error: 'Upload failed' });
	});

	it('should handle JSON string response correctly', async () => {
		const mockBuffer = Buffer.from('test data');
		const mockThis = {
			getCredentials: async () => ({ url: 'https://fake.api' }),
			helpers: {
				requestWithAuthentication: {
					call: jest.fn().mockResolvedValue('{"id":"import-789","status":"processing"}'),
				},
				getBinaryDataBuffer: jest.fn().mockResolvedValue(mockBuffer),
			},
			getNodeParameter: (name: string, i: number) => {
				const params: { [key: string]: any } = {
					type: 3,
					delimiter: '|',
					binaryPropertyName: 'csvFile',
				};
				return params[name];
			},
			continueOnFail: () => false,
		} as any;

		const items = [
			{
				json: {},
				binary: {
					csvFile: {
						data: 'mock-data',
						fileName: 'data.csv',
						mimeType: 'text/csv',
					},
				},
			},
		];

		const result = await execute.call(mockThis, items);
		expect(result[0].json).toEqual({ id: 'import-789', status: 'processing' });
	});
});
