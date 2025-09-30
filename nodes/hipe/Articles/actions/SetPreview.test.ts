import { execute } from './SetPreview';

describe('Articles SetPreview action', () => {
	it('should call helpers.requestWithAuthentication and return updated article (happy path)', async () => {
		const mockThis = {
			getCredentials: async () => ({ url: 'https://fake.api' }),
			helpers: {
				requestWithAuthentication: {
					call: jest
						.fn()
						.mockResolvedValue({ id: 'art-123', previewId: 'file-456', name: 'Test Article' }),
				},
			},
			getNodeParameter: (name: string) => {
				if (name === 'articleId') return 'art-123';
				if (name === 'fileId') return 'file-456';
				return undefined;
			},
			continueOnFail: () => false,
		} as any;
		const items = [{ json: {} }];
		const result = await execute.call(mockThis, items);
		expect(mockThis.helpers.requestWithAuthentication.call).toHaveBeenCalledWith(
			mockThis,
			'hipeApi',
			expect.objectContaining({
				method: 'PATCH',
				url: 'https://fake.api/api/articles/art-123/files/file-456/default',
				json: true,
			}),
		);
		expect(result[0].json).toEqual({
			id: 'art-123',
			previewId: 'file-456',
			name: 'Test Article',
		});
	});

	it('should handle errors and push error object when continueOnFail is true', async () => {
		const mockThis = {
			getCredentials: async () => ({ url: 'https://fake.api' }),
			helpers: {
				requestWithAuthentication: {
					call: jest.fn().mockRejectedValue(new Error('File is not an image')),
				},
			},
			getNodeParameter: (name: string) => {
				if (name === 'articleId') return 'art-123';
				if (name === 'fileId') return 'file-999';
				return undefined;
			},
			continueOnFail: () => true,
		} as any;
		const items = [{ json: {} }];
		const result = await execute.call(mockThis, items);
		expect(result[0].json).toEqual({ error: 'File is not an image' });
	});

	it('should handle multiple items', async () => {
		const mockThis = {
			getCredentials: async () => ({ url: 'https://fake.api' }),
			helpers: {
				requestWithAuthentication: {
					call: jest
						.fn()
						.mockResolvedValueOnce({ id: 'art-1', previewId: 'file-1' })
						.mockResolvedValueOnce({ id: 'art-2', previewId: 'file-2' }),
				},
			},
			getNodeParameter: jest.fn((name: string, i: number) => {
				if (name === 'articleId') return `art-${i + 1}`;
				if (name === 'fileId') return `file-${i + 1}`;
				return undefined;
			}),
			continueOnFail: () => false,
		} as any;
		const items = [{ json: {} }, { json: {} }];
		const result = await execute.call(mockThis, items);
		expect(result).toHaveLength(2);
		expect(mockThis.helpers.requestWithAuthentication.call).toHaveBeenCalledTimes(2);
		expect(result[0].json).toEqual({ id: 'art-1', previewId: 'file-1' });
		expect(result[1].json).toEqual({ id: 'art-2', previewId: 'file-2' });
	});
});
