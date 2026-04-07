import { IExecuteFunctions, INodeExecutionData, INodeProperties, sleep } from 'n8n-workflow';
import { RESOURCES, OPERATIONS } from '../../constants';

export const properties: INodeProperties[] = [
	{
		displayName: 'Currency ID',
		name: 'id',
		type: 'string',
		required: true,
		default: '',
		description: 'ID of the currency to retrieve',
		displayOptions: {
			show: {
				resource: [RESOURCES.CURRENCY],
				operation: [OPERATIONS.GET],
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
				resource: [RESOURCES.CURRENCY],
				operation: [OPERATIONS.GET],
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
		const id = this.getNodeParameter('id', i) as string;

		try {
			// Make API call to get currency
			const response = await this.helpers.requestWithAuthentication.call(this, 'hipeApi', {
				method: 'GET',
				url: `${baseUrl}/api/currencies/${id}`,
				json: true,
			});

			returnData.push({ json: response });
		} catch (error) {
			if (this.continueOnFail()) {
				returnData.push({ json: { error: error.message } });
				continue;
			}
			throw error;
		}
		await sleep(500);
	}
	return returnData;
}
