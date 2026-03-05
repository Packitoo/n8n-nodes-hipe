import { IExecuteFunctions, sleep } from 'n8n-workflow';
import { INodeExecutionData, INodeProperties } from 'n8n-workflow';
import { RESOURCES, OPERATIONS } from '../../constants';

// Properties for the Get operation
export const properties: INodeProperties[] = [
	{
		displayName: 'Order Item ID',
		name: 'orderItemId',
		type: 'string',
		required: true,
		default: '',
		description: 'ID of the order item to retrieve',
		displayOptions: {
			show: {
				resource: [RESOURCES.ORDER_ITEM],
				operation: [OPERATIONS.GET],
			},
		},
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

	// Process each item
	for (let i = 0; i < items.length; i++) {
		try {
			// Get input data
			const orderItemId = this.getNodeParameter('orderItemId', i) as string;

			const response = await this.helpers.requestWithAuthentication.call(this, 'hipeApi', {
				method: 'GET',
				url: `${baseUrl}/api/order-items/${orderItemId}`,
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
		sleep(500);
	}

	return returnData;
}
