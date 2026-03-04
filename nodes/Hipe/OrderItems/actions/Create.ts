import { IExecuteFunctions, sleep } from 'n8n-workflow';
import { INodeExecutionData, INodeProperties, IDataObject } from 'n8n-workflow';

// Properties for the Create operation
export const properties: INodeProperties[] = [
	{
		displayName: 'Order ID',
		name: 'orderId',
		type: 'string',
		required: true,
		default: '',
		description: 'ID of the parent order',
		displayOptions: {
			show: {
				resource: ['orderItem'],
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'Quantity',
		name: 'quantity',
		type: 'number',
		required: true,
		default: 1,
		description: 'Quantity of the order item',
		displayOptions: {
			show: {
				resource: ['orderItem'],
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['orderItem'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Article ID',
				name: 'articleId',
				type: 'string',
				default: '',
				description: 'ID of the article associated with this order item',
			},
			{
				displayName: 'Comment ID',
				name: 'commentId',
				type: 'string',
				default: '',
				description: 'ID of the comment associated with this order item',
			},
			{
				displayName: 'Custom Fields',
				name: 'customFields',
				type: 'json',
				default: '',
				description: 'Custom fields for the order item (JSON object)',
			},
			{
				displayName: 'External ID',
				name: 'externalId',
				type: 'string',
				default: '',
				description: 'External ID of the order item',
			},
			{
				displayName: 'Parent ID',
				name: 'parentId',
				type: 'string',
				default: '',
				description: 'ID of the parent order item (for nested items)',
			},
			{
				displayName: 'Position',
				name: 'position',
				type: 'number',
				default: 1,
				description: 'Position of the order item in the list',
			},
			{
				displayName: 'Total Price',
				name: 'totalPrice',
				type: 'number',
				default: 0,
				description: 'Total price of the order item',
			},
			{
				displayName: 'Unit',
				name: 'unit',
				type: 'string',
				default: '',
				description: 'Unit of measurement (e.g., kg, m, pcs)',
			},
			{
				displayName: 'Unit Price',
				name: 'unitPrice',
				type: 'number',
				default: 0,
				description: 'Unit price of the order item',
			},
			{
				displayName: 'Unit Price Per Thousand',
				name: 'unitPricePerThousand',
				type: 'number',
				default: 0,
			},
		],
	},
];

// Execute function for the Create operation
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
			const quantity = this.getNodeParameter('quantity', i) as number;
			const rawAdditionalFields = this.getNodeParameter('additionalFields', i, {}) as IDataObject;
			const additionalFields: IDataObject = {};
			for (const [key, value] of Object.entries(rawAdditionalFields)) {
				if (value !== null) {
					additionalFields[key] =
						key === 'customFields' && typeof value === 'string' ? JSON.parse(value) : value;
				}
			}
			const response = await this.helpers.requestWithAuthentication.call(this, 'hipeApi', {
				method: 'POST',
				url: `${baseUrl}/api/order-items`,
				json: true,
				body: {
					orderId,
					quantity,
					...additionalFields,
				},
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
