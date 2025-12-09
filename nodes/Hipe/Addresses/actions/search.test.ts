import { IExecuteFunctions } from 'n8n-workflow';
import * as search from './search';

describe('Address Search', () => {
	let mockExecuteFunctions: jest.Mocked<IExecuteFunctions>;

	beforeEach(() => {
		mockExecuteFunctions = {
			getCredentials: jest.fn().mockResolvedValue({
				url: 'https://api.hipe.example.com',
			}),
			getNodeParameter: jest.fn(),
			helpers: {
				requestWithAuthentication: jest.fn(),
			},
			continueOnFail: jest.fn().mockReturnValue(false),
		} as any;
	});

	it('should search addresses with search query', async () => {
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce(50) // limit
			.mockReturnValueOnce('Paris'); // search

		(mockExecuteFunctions.helpers.requestWithAuthentication as jest.Mock).mockResolvedValue([
			{
				id: '1',
				name: 'Test Address',
				address: '123 Main St',
				city: 'Paris',
				country: 'FR',
			},
		]);

		const result = await search.execute.call(mockExecuteFunctions, [{ json: {} }]);

		expect(mockExecuteFunctions.helpers.requestWithAuthentication).toHaveBeenCalledWith(
			'hipeApi',
			{
				method: 'GET',
				url: 'https://api.hipe.example.com/api/addresses',
				json: true,
				qs: {
					limit: 50,
					s: 'Paris',
				},
			}
		);
		expect(result).toHaveLength(1);
	});

	it('should search addresses with empty search query', async () => {
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce(50) // limit
			.mockReturnValueOnce(''); // search

		(mockExecuteFunctions.helpers.requestWithAuthentication as jest.Mock).mockResolvedValue([]);

		const result = await search.execute.call(mockExecuteFunctions, [{ json: {} }]);

		expect(mockExecuteFunctions.helpers.requestWithAuthentication).toHaveBeenCalledWith(
			'hipeApi',
			{
				method: 'GET',
				url: 'https://api.hipe.example.com/api/addresses',
				json: true,
				qs: {
					limit: 50,
					s: '',
				},
			}
		);
		expect(result).toHaveLength(1);
	});

	it('should use custom limit', async () => {
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce(100) // limit
			.mockReturnValueOnce('test'); // search

		(mockExecuteFunctions.helpers.requestWithAuthentication as jest.Mock).mockResolvedValue([]);

		await search.execute.call(mockExecuteFunctions, [{ json: {} }]);

		expect(mockExecuteFunctions.helpers.requestWithAuthentication).toHaveBeenCalledWith(
			'hipeApi',
			{
				method: 'GET',
				url: 'https://api.hipe.example.com/api/addresses',
				json: true,
				qs: {
					limit: 100,
					s: 'test',
				},
			}
		);
	});

	it('should handle invalid base URL', async () => {
		mockExecuteFunctions.getCredentials = jest.fn().mockResolvedValue({
			url: 'invalid-url',
		});

		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce(50) // limit
			.mockReturnValueOnce('test'); // search

		await expect(
			search.execute.call(mockExecuteFunctions, [{ json: {} }])
		).rejects.toThrow('HIPE base URL is not set or is invalid');
	});

	it('should handle errors and push error object when continueOnFail is true', async () => {
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce(50) // limit
			.mockReturnValueOnce('test'); // search

		mockExecuteFunctions.continueOnFail = jest.fn().mockReturnValue(true);

		(mockExecuteFunctions.helpers.requestWithAuthentication as jest.Mock).mockRejectedValue(
			new Error('API Error')
		);

		const result = await search.execute.call(mockExecuteFunctions, [{ json: {} }]);

		expect(result).toHaveLength(1);
		expect(result[0].json).toEqual({ error: 'API Error' });
	});
});
