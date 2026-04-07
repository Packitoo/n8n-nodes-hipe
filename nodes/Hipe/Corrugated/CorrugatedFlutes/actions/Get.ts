import { IExecuteFunctions, sleep } from 'n8n-workflow';
import { INodeExecutionData, INodeProperties } from 'n8n-workflow';
import { RESOURCES, OPERATIONS } from '../../../constants';

// Properties for the Get operation
export const properties: INodeProperties[] = [
	{
		displayName: 'Flute ID',
		name: 'fluteId',
		type: 'string',
		required: true,
		default: '',
		description: 'ID of the corrugated flute to retrieve',
		displayOptions: {
			show: {
				resource: [RESOURCES.CORRUGATED_FLUTE],
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
				resource: [RESOURCES.CORRUGATED_FLUTE],
				operation: [OPERATIONS.GET],
			},
		},
		options: [
			// Add any additional options for retrieving corrugated flutes
		],
	},
];

// Execute function for the Get operation
export async function execute(
	this: IExecuteFunctions,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];

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
			const fluteId = this.getNodeParameter('fluteId', i) as string;

			const response = await this.helpers.requestWithAuthentication.call(this, 'hipeApi', {
				method: 'GET',
				url: `${baseUrl}/api/corrugated-flutes/${fluteId}`,
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
