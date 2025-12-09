import { IExecuteFunctions, INodeExecutionData, INodeProperties, sleep } from 'n8n-workflow';

export const properties: INodeProperties[] = [
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		description: 'Whether to return all results or only up to a given limit',
		displayOptions: {
			show: {
				resource: ['currency'],
				operation: ['getMany'],
			},
		},
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		default: 50,
		description: 'Max number of results to return',
		typeOptions: {
			minValue: 1,
		},
		displayOptions: {
			show: {
				resource: ['currency'],
				operation: ['getMany'],
				returnAll: [false],
			},
		},
	},
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		options: [],
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['currency'],
				operation: ['getMany'],
			},
		},
	},
];

export async function execute(
	this: IExecuteFunctions,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];

	// Get credentials
	const credentials = await this.getCredentials('hipeApi');
	let baseUrl = credentials.url;
	if (typeof baseUrl !== 'string') {
		throw new Error('HIPE base URL is not a string');
	}
	baseUrl = baseUrl.replace(/\/$/, '');

	// Process each item
	for (let i = 0; i < items.length; i++) {
		const returnAll = this.getNodeParameter('returnAll', i) as boolean;
		const limit = this.getNodeParameter('limit', i, 50) as number;

		try {
			let response;

			if (returnAll) {
				// Get all currencies
				response = await this.helpers.requestWithAuthentication.call(this, 'hipeApi', {
					method: 'GET',
					url: `${baseUrl}/api/currencies`,
					json: true,
				});
			} else {
				// Get limited currencies
				response = await this.helpers.requestWithAuthentication.call(this, 'hipeApi', {
					method: 'GET',
					url: `${baseUrl}/api/currencies`,
					json: true,
					qs: {
						limit,
					},
				});
			}

			// Handle response
			if (Array.isArray(response)) {
				response.forEach((item: any) => returnData.push({ json: item }));
			} else if (response.data && Array.isArray(response.data)) {
				response.data.forEach((item: any) => returnData.push({ json: item }));
			} else {
				returnData.push({ json: response });
			}
		} catch (error) {
			if (this.continueOnFail()) {
				returnData.push({ json: { error: error.message } });
				continue;
			}
			throw error;
		}
		sleep(500);
	}
	return returnData;
}
