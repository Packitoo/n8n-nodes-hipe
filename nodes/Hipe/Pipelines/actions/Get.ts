import { IExecuteFunctions, sleep, INodeExecutionData, INodeProperties } from 'n8n-workflow';

export const properties: INodeProperties[] = [
	{
		displayName: 'Pipeline ID',
		name: 'pipelineId',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['pipelines'],
				operation: ['get'],
			},
		},
		default: '',
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
				resource: ['pipelines'],
				operation: ['get'],
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
			// Get input data
			const pipelineId = this.getNodeParameter('pipelineId', i) as string;
			// Make API call to get the corrugated format
			const response = await this.helpers.requestWithAuthentication.call(this, 'hipeApi', {
				method: 'GET',
				url: `${baseUrl}/api/pipelines/${pipelineId}`,
				json: true,
			});
			// If response is an array, push each item; otherwise, push the object
			if (Array.isArray(response)) {
				response.forEach((item) => returnData.push({ json: item }));
			} else if (response) {
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
