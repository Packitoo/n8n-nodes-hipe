import { IExecuteFunctions } from 'n8n-workflow';
import * as search from './search';

describe('Currency Search', () => {
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

	it('should search currencies with search query', async () => {
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('EUR') // query
			.mockReturnValueOnce(false) // returnAll
			.mockReturnValueOnce(50); // limit

		(mockExecuteFunctions.helpers.requestWithAuthentication as jest.Mock).mockResolvedValue([
			{
				id: '1',
				name: 'EURO',
				code: 'EUR',
				symbol: '€',
			},
		]);

		const result = await search.execute.call(mockExecuteFunctions, [{ json: {} }]);

		expect(mockExecuteFunctions.helpers.requestWithAuthentication).toHaveBeenCalledWith(
			'hipeApi',
			{
				method: 'GET',
				url: 'https://api.hipe.example.com/api/currencies',
				json: true,
				qs: {
					search: 'EUR',
					limit: 50,
				},
			}
		);
		expect(result).toHaveLength(1);
	});

	it('should search currencies with empty search query', async () => {
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('') // query
			.mockReturnValueOnce(false) // returnAll
			.mockReturnValueOnce(50); // limit

		(mockExecuteFunctions.helpers.requestWithAuthentication as jest.Mock).mockResolvedValue([]);

		const result = await search.execute.call(mockExecuteFunctions, [{ json: {} }]);

		expect(mockExecuteFunctions.helpers.requestWithAuthentication).toHaveBeenCalledWith(
			'hipeApi',
			{
				method: 'GET',
				url: 'https://api.hipe.example.com/api/currencies',
				json: true,
				qs: {
					limit: 50,
				},
			}
		);
		expect(result).toHaveLength(0);
	});

	it('should return all results when returnAll is true', async () => {
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('test') // query
			.mockReturnValueOnce(true) // returnAll
			.mockReturnValueOnce(50); // limit

		(mockExecuteFunctions.helpers.requestWithAuthentication as jest.Mock).mockResolvedValue([
			{ id: '1', name: 'EURO', code: 'EUR' },
			{ id: '2', name: 'US Dollar', code: 'USD' },
		]);

		const result = await search.execute.call(mockExecuteFunctions, [{ json: {} }]);

		expect(mockExecuteFunctions.helpers.requestWithAuthentication).toHaveBeenCalledWith(
			'hipeApi',
			{
				method: 'GET',
				url: 'https://api.hipe.example.com/api/currencies',
				json: true,
				qs: {
					search: 'test',
				},
			}
		);
		expect(result).toHaveLength(2);
	});

	it('should use custom limit', async () => {
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('test') // query
			.mockReturnValueOnce(false) // returnAll
			.mockReturnValueOnce(100); // limit

		(mockExecuteFunctions.helpers.requestWithAuthentication as jest.Mock).mockResolvedValue([]);

		await search.execute.call(mockExecuteFunctions, [{ json: {} }]);

		expect(mockExecuteFunctions.helpers.requestWithAuthentication).toHaveBeenCalledWith(
			'hipeApi',
			{
				method: 'GET',
				url: 'https://api.hipe.example.com/api/currencies',
				json: true,
				qs: {
					search: 'test',
					limit: 100,
				},
			}
		);
	});

	it('should handle response with data property', async () => {
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('EUR') // query
			.mockReturnValueOnce(false) // returnAll
			.mockReturnValueOnce(50); // limit

		(mockExecuteFunctions.helpers.requestWithAuthentication as jest.Mock).mockResolvedValue({
			data: [
				{ id: '1', name: 'EURO', code: 'EUR' },
				{ id: '2', name: 'European Currency Unit', code: 'XEU' },
			],
		});

		const result = await search.execute.call(mockExecuteFunctions, [{ json: {} }]);

		expect(result).toHaveLength(2);
	});
});
