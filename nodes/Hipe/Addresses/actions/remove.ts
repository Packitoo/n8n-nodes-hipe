import { IExecuteFunctions, INodeExecutionData, INodeProperties, sleep } from 'n8n-workflow';
import { getAsyncHeaders } from '../../utils/asyncMode';

export const properties: INodeProperties[] = [
	{
		displayName: 'Address ID',
		name: 'id',
		type: 'collection',
		options: [],
		required: true,
		default: {},
		description: 'ID of the address to delete',
		displayOptions: {
			show: {
				resource: ['address'],
				operation: ['delete'],
			},
		},
	},
	{
		displayName: 'Async Mode',
		name: 'asyncMode',
		type: 'boolean',
		default: false,
		description: 'Whether to use asynchronous processing (returns a job ID instead of waiting for completion)',
		displayOptions: {
			show: {
				resource: ['address'],
				operation: ['delete'],
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
		try {
			const id = this.getNodeParameter('id', i) as string;
			const asyncMode = this.getNodeParameter('asyncMode', i, false) as boolean;

			// Make API call to get the corrugated format
			const response = await this.helpers.requestWithAuthentication.call(this, 'hipeApi', {
				method: 'DELETE',
				url: `${baseUrl}/api/addresses/${id}`,
				json: true,
				headers: getAsyncHeaders(asyncMode),
			});

			returnData.push({ json: response });
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
