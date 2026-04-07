import { IExecuteFunctions, sleep } from 'n8n-workflow';
import { INodeExecutionData, INodeProperties } from 'n8n-workflow';
import { RESOURCES, OPERATIONS } from '../../constants';

// Properties for the Search operation (advanced search)
export const properties: INodeProperties[] = [
	{
		displayName: 'Query (S)',
		name: 's',
		type: 'string',
		required: true,
		placeholder: '{"name":{"$contL":"john"}}',
		description:
			'URI-encoded JSON filter. Example: s={"name":{"$contL":"t"}}. UI should URL-encode this value when sent.',
		default: '',
		displayOptions: {
			show: {
				resource: [RESOURCES.USER],
				operation: [OPERATIONS.SEARCH],
			},
		},
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		default: 50,
		description: 'Max number of results to return',
		displayOptions: {
			show: {
				resource: [RESOURCES.USER],
				operation: [OPERATIONS.SEARCH],
			},
		},
		typeOptions: {
			minValue: 1,
		},
	},
];

// Execute function for the Search operation
export async function execute(
	this: IExecuteFunctions,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];

	// Get credentials
	const credentials = await this.getCredentials('hipeApi');
	let baseUrl = credentials.url as string;
	if (!baseUrl || typeof baseUrl !== 'string' || !/^https?:\/\//.test(baseUrl)) {
		throw new Error('HIPE base URL is not set or is invalid: ' + baseUrl);
	}
	baseUrl = baseUrl.replace(/\/$/, '');

	for (let i = 0; i < items.length; i++) {
		try {
			const s = this.getNodeParameter('s', i) as string;
			const limit = this.getNodeParameter('limit', i, 10) as number;

			const response = await this.helpers.requestWithAuthentication.call(this, 'hipeApi', {
				method: 'GET',
				url: `${baseUrl}/api/users/search`,
				qs: { s, limit },
				json: true,
			});

			// Response is an array of users
			returnData.push({ json: { data: Array.isArray(response) ? response : [response] }, pairedItem: { item: i } });
		} catch (error) {
			if (this.continueOnFail()) {
				returnData.push({ json: { error: (error as Error).message }, pairedItem: { item: i } });
				continue;
			}
			throw error;
		}
		await sleep(500);
	}

	return returnData;
}
