import { execute } from './Download';

describe('Exports Download action', () => {
	it('should call helpers.requestWithAuthentication and return binary data (happy path)', async () => {
		const mockBuffer = Buffer.from('export,data\n1,2\n3,4');
		const mockBinaryData = { data: mockBuffer, mimeType: 'text/csv', fileName: 'export_123.csv' };

		const mockThis = {
			getCredentials: async () => ({ url: 'https://fake.api' }),
			helpers: {
				requestWithAuthentication: { call: jest.fn().mockResolvedValue(mockBuffer) },
				prepareBinaryData: jest.fn().mockResolvedValue(mockBinaryData),
			},
			getNodeParameter: (name: string, i: number, defaultValue?: any) => {
				if (name === 'id') return 'export-123';
				if (name === 'binaryPropertyName') return 'data';
				if (name === 'fileName') return 'custom_export.csv';
				return defaultValue;
			},
			continueOnFail: () => false,
		} as any;

		const items = [{ json: {} }];
		const result = await execute.call(mockThis, items);

		expect(mockThis.helpers.requestWithAuthentication.call).toHaveBeenCalledWith(
			mockThis,
			'hipeApi',
			expect.objectContaining({
				method: 'GET',
				url: 'https://fake.api/api/exports/export-123/download',
				json: false,
				encoding: null,
			}),
		);
		expect(mockThis.helpers.prepareBinaryData).toHaveBeenCalledWith(
			mockBuffer,
			'custom_export.csv',
		);
		expect(result[0].json).toEqual({ id: 'export-123' });
		expect(result[0].binary).toEqual({ data: mockBinaryData });
	});

	it('should use default filename when not provided', async () => {
		const mockBuffer = Buffer.from('test data');
		const mockBinaryData = { data: mockBuffer };

		const mockThis = {
			getCredentials: async () => ({ url: 'https://fake.api' }),
			helpers: {
				requestWithAuthentication: { call: jest.fn().mockResolvedValue(mockBuffer) },
				prepareBinaryData: jest.fn().mockResolvedValue(mockBinaryData),
			},
			getNodeParameter: (name: string, i: number, defaultValue?: any) => {
				if (name === 'id') return 'export-456';
				if (name === 'binaryPropertyName') return 'file';
				if (name === 'fileName') return ''; // Empty filename
				return defaultValue;
			},
			continueOnFail: () => false,
		} as any;

		const items = [{ json: {} }];
		const result = await execute.call(mockThis, items);

		expect(mockThis.helpers.prepareBinaryData).toHaveBeenCalledWith(
			mockBuffer,
			'export_export-456.bin',
		);
		expect(result[0].binary).toEqual({ file: mockBinaryData });
	});

	it('should properly encode special characters in ID', async () => {
		const mockBuffer = Buffer.from('data');
		const mockBinaryData = { data: mockBuffer };

		const mockThis = {
			getCredentials: async () => ({ url: 'https://fake.api' }),
			helpers: {
				requestWithAuthentication: { call: jest.fn().mockResolvedValue(mockBuffer) },
				prepareBinaryData: jest.fn().mockResolvedValue(mockBinaryData),
			},
			getNodeParameter: (name: string, i: number, defaultValue?: any) => {
				if (name === 'id') return 'export with spaces';
				if (name === 'binaryPropertyName') return 'data';
				if (name === 'fileName') return 'file.csv';
				return defaultValue;
			},
			continueOnFail: () => false,
		} as any;

		const items = [{ json: {} }];
		await execute.call(mockThis, items);

		expect(mockThis.helpers.requestWithAuthentication.call).toHaveBeenCalledWith(
			mockThis,
			'hipeApi',
			expect.objectContaining({
				url: 'https://fake.api/api/exports/export%20with%20spaces/download',
			}),
		);
	});

	it('should handle errors and push error object when continueOnFail is true', async () => {
		const mockThis = {
			getCredentials: async () => ({ url: 'https://fake.api' }),
			helpers: {
				requestWithAuthentication: {
					call: jest.fn().mockRejectedValue(new Error('Download failed')),
				},
				prepareBinaryData: jest.fn(),
			},
			getNodeParameter: (name: string, i: number, defaultValue?: any) => {
				if (name === 'id') return 'export-789';
				if (name === 'binaryPropertyName') return 'data';
				if (name === 'fileName') return 'test.csv';
				return defaultValue;
			},
			continueOnFail: () => true,
		} as any;

		const items = [{ json: {} }];
		const result = await execute.call(mockThis, items);
		expect(result[0].json).toEqual({ error: 'Download failed' });
	});

	it('should throw error when continueOnFail is false', async () => {
		const mockThis = {
			getCredentials: async () => ({ url: 'https://fake.api' }),
			helpers: {
				requestWithAuthentication: {
					call: jest.fn().mockRejectedValue(new Error('File not found')),
				},
				prepareBinaryData: jest.fn(),
			},
			getNodeParameter: (name: string, i: number, defaultValue?: any) => {
				if (name === 'id') return 'nonexistent-export';
				if (name === 'binaryPropertyName') return 'data';
				if (name === 'fileName') return 'missing.csv';
				return defaultValue;
			},
			continueOnFail: () => false,
		} as any;

		const items = [{ json: {} }];
		await expect(execute.call(mockThis, items)).rejects.toThrow('File not found');
	});
});
