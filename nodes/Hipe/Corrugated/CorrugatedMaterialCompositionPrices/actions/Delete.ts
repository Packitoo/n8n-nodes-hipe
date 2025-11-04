import { IExecuteFunctions, sleep } from 'n8n-workflow';
import { INodeExecutionData, INodeProperties } from 'n8n-workflow';

// Properties for the Delete operation
export const properties: INodeProperties[] = [
	{
		displayName: 'Price ID',
		name: 'priceId',
		type: 'string',
		required: true,
		default: '',
		description: 'ID of the corrugated material composition price to delete',
		displayOptions: {
			show: {
				resource: ['corrugatedMaterialCompositionPrice'],
				operation: ['delete'],
			},
		},
	},
];

// Execute function for the Delete operation
export async function execute(
	this: IExecuteFunctions,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];

	// Get credentials and normalize base URL
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
			const priceId = this.getNodeParameter('priceId', i) as string;

			const response = await this.helpers.requestWithAuthentication.call(this, 'hipeApi', {
				method: 'DELETE',
				url: `${baseUrl}/api/corrugated-material-composition-prices/${encodeURIComponent(priceId)}`,
				json: true,
			});

			returnData.push({ json: response ?? { success: true, id: priceId, deleted: true } });
		} catch (error) {
			if (this.continueOnFail()) {
				returnData.push({ json: { error: (error as Error).message } });
				continue;
			}
			throw error;
		}
		sleep(500);
	}

	return returnData;
}
