import { IExecuteFunctions, sleep } from 'n8n-workflow';
import { INodeExecutionData, INodeProperties } from 'n8n-workflow';
import { RESOURCES, OPERATIONS } from '../../../constants';

// Properties for the Get operation
export const properties: INodeProperties[] = [
	{
		displayName: 'Format ID',
		name: 'formatId',
		type: 'string',
		required: true,
		default: '',
		description: 'ID of the corrugated format to retrieve',
		displayOptions: {
			show: {
				resource: [RESOURCES.CORRUGATED_FORMAT],
				operation: [OPERATIONS.GET],
			},
		},
	},
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: [RESOURCES.CORRUGATED_FORMAT],
				operation: [OPERATIONS.GET],
			},
		},
		options: [
			// Add any additional options for retrieving corrugated formats
		],
	},
];

// Execute function for the Get operation
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

	for (let i = 0; i < items.length; i++) {
		try {
			// Get input data
			const formatId = this.getNodeParameter('formatId', i) as string;
			// const options = this.getNodeParameter('options', i, {}) as object; // Not used for GET by ID

			// Make API call to get the corrugated format
			const response = await this.helpers.request!({
				method: 'GET',
				url: `${baseUrl}/api/corrugated-formats/${encodeURIComponent(formatId)}`,
				json: true,
			});

			returnData.push({ json: response });
		} catch (error: any) {
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
