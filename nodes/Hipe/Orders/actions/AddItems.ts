import { IExecuteFunctions, sleep } from 'n8n-workflow';
import { INodeExecutionData, INodeProperties } from 'n8n-workflow';

// Properties for the Add Items operation
export const properties: INodeProperties[] = [
	{
		displayName: 'Order ID',
		name: 'orderId',
		type: 'string',
		required: true,
		default: '',
		description: 'ID of the order to add items to',
		displayOptions: {
			show: {
				resource: ['order'],
				operation: ['addItems'],
			},
		},
	},
	{
		displayName: 'Items',
		name: 'items',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
		},
		default: {},
		placeholder: 'Add Item',
		required: true,
		description: 'Articles to add as order items (pricing and details auto-loaded from article)',
		displayOptions: {
			show: {
				resource: ['order'],
				operation: ['addItems'],
			},
		},
		options: [
			{
				name: 'itemValues',
				displayName: 'Item',
				values: [
					{
						displayName: 'Article ID',
						name: 'articleId',
						type: 'string',
						required: true,
						default: '',
						description:
							'ID of the article to add (pricing, unit, and quantity auto-generated from article data)',
					},
					{
						displayName: 'Quantity',
						name: 'quantity',
						type: 'number',
						required: true,
						default: 1,
						description: 'Quantity of the article',
					},
					{
						displayName: 'Total Price',
						name: 'totalPrice',
						type: 'number',
						required: false,
						default: 0,
						description: 'Total price of the article',
					},
					{
						displayName: 'Unit Price',
						name: 'unitPrice',
						type: 'number',
						required: false,
						default: 0,
						description: 'Unit price of the article',
					},
					{
						displayName: 'Unit',
						name: 'unit',
						type: 'string',
						required: false,
						default: '',
						description: 'Unit of the article',
					},
				],
			},
		],
	},
];

// Execute function for the Add Items operation
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
			const itemsCollection = this.getNodeParameter('items', i) as {
				itemValues?: Array<{
					articleId: string;
				}>;
			};

			if (!itemsCollection.itemValues || itemsCollection.itemValues.length === 0) {
				throw new Error('At least one item must be provided');
			}

			// Map to the format expected by the API (only articleId)
			const orderItems = itemsCollection.itemValues.map((item) => ({
				articleId: item.articleId,
			}));

			// Make API call to add items to the order
			const response = await this.helpers.requestWithAuthentication.call(this, 'hipeApi', {
				method: 'POST',
				url: `${baseUrl}/api/orders/${orderId}/order-items`,
				json: true,
				body: orderItems,
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
