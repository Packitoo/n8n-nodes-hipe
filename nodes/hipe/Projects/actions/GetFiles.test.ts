import { execute } from './GetFiles';

describe('GetFiles action', () => {
	let mockThis: any;

	beforeEach(() => {
		mockThis = {
			getCredentials: jest.fn().mockResolvedValue({ url: 'https://fake.api' }),
			getNodeParameter: jest.fn((name: string) => {
				if (name === 'projectId') return 'proj-123';
				if (name === 'options') return {};
				return undefined;
			}),
			helpers: {
				requestWithAuthentication: {
					call: jest.fn().mockResolvedValue([
						{ id: 'file-1', name: 'fileA.pdf' },
						{ id: 'file-2', name: 'fileB.pdf' },
					]),
				},
			},
			logger: { debug: jest.fn() },
			continueOnFail: jest.fn().mockReturnValue(false),
		};
	});

	it('retrieves files for a project', async () => {
		const items = [{ json: {} }];
		const result = await execute.call(mockThis, items);
		expect(result[0].json).toEqual([
			{ id: 'file-1', name: 'fileA.pdf' },
			{ id: 'file-2', name: 'fileB.pdf' },
		]);
		expect(mockThis.helpers.requestWithAuthentication.call).toHaveBeenCalledWith(
			mockThis,
			'hipeApi',
			expect.objectContaining({
				method: 'GET',
				url: expect.stringContaining('/api/projects/proj-123/files'),
				json: true,
			}),
		);
	});

	it('handles API error and throws if continueOnFail is false', async () => {
		mockThis.helpers.requestWithAuthentication.call.mockRejectedValueOnce(new Error('fail!'));
		const items = [{ json: {} }];
		await expect(execute.call(mockThis, items)).rejects.toThrow('fail!');
	});

	it('handles API error and returns error if continueOnFail is true', async () => {
		mockThis.continueOnFail = jest.fn().mockReturnValue(true);
		mockThis.helpers.requestWithAuthentication.call.mockRejectedValueOnce(new Error('fail!'));
		const items = [{ json: {} }];
		const result = await execute.call(mockThis, items);
		expect(result[0].json.error).toBe('fail!');
	});

	it('handles multiple input items', async () => {
		const items = [{ json: {} }, { json: {} }];
		const result = await execute.call(mockThis, items);
		expect(result).toHaveLength(2);
		expect(mockThis.helpers.requestWithAuthentication.call).toHaveBeenCalledTimes(2);
	});
});
