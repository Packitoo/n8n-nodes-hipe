import { IExecuteFunctions, sleep } from 'n8n-workflow';
import { INodeExecutionData, INodeProperties } from 'n8n-workflow';
import { ICorrugatedFormat } from '../../../interfaces';
import { RESOURCES, OPERATIONS } from '../../../constants';

// Properties for the Update operation
export const properties: INodeProperties[] = [
	{
		displayName: 'Format ID',
		name: 'formatId',
		type: 'string',
		required: true,
		default: '',
		description: 'ID of the corrugated format to update',
		displayOptions: {
			show: {
				resource: [RESOURCES.CORRUGATED_FORMAT],
				operation: [OPERATIONS.UPDATE],
			},
		},
	},
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: [RESOURCES.CORRUGATED_FORMAT],
				operation: [OPERATIONS.UPDATE],
			},
		},
		options: [
			{
				displayName: 'Width',
				name: 'width',
				type: 'number',
				default: 0,
				description: 'Width of the corrugated format in mm',
			},
			{
				displayName: 'Length',
				name: 'length',
				type: 'number',
				default: 0,
				description: 'Length of the corrugated format in mm',
			},
			// Add any additional fields specific to updating corrugated formats
		],
	},
];

// Execute function for the Update operation
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
			const updateFields = this.getNodeParameter('updateFields', i, {}) as ICorrugatedFormat;

			// Make API call to update the corrugated format
			const response = await this.helpers.request!({
				method: 'PATCH',
				url: `${baseUrl}/api/corrugated-formats/${encodeURIComponent(formatId)}`,
				body: updateFields,
				json: true,
			});

			returnData.push({ json: response, pairedItem: { item: i } });
		} catch (error: any) {
			if (this.continueOnFail()) {
				returnData.push({ json: { error: error.message }, pairedItem: { item: i } });
				continue;
			}
			throw error;
		}
		await sleep(500);
	}
	return returnData;
}
