import { IExecuteFunctions, sleep } from 'n8n-workflow';
import { INodeExecutionData, INodeProperties } from 'n8n-workflow';
import { RESOURCES, OPERATIONS } from '../../constants';

// Properties for the Remove Item operation
export const properties: INodeProperties[] = [
	{
		displayName: 'Order ID',
		name: 'orderId',
		type: 'string',
		required: true,
		default: '',
		description: 'ID of the order to remove item from',
		displayOptions: {
			show: {
				resource: [RESOURCES.ORDER],
				operation: [OPERATIONS.REMOVE_ITEM],
			},
		},
	},
	{
		displayName: 'Item ID',
		name: 'itemId',
		type: 'string',
		required: true,
		default: '',
		description: 'ID of the order item to remove',
		displayOptions: {
			show: {
				resource: [RESOURCES.ORDER],
				operation: [OPERATIONS.REMOVE_ITEM],
			},
		},
	},
];

// Execute function for the Remove Item operation
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
			const orderId = this.getNodeParameter('orderId', i) as string;
			const itemId = this.getNodeParameter('itemId', i) as string;

			// Make API call to remove item from the order
			const response = await this.helpers.requestWithAuthentication.call(this, 'hipeApi', {
				method: 'DELETE',
				url: `${baseUrl}/api/orders/${orderId}/order-items/${itemId}`,
				json: true,
			});

			returnData.push({ json: response, pairedItem: { item: i } });
		} catch (error) {
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
