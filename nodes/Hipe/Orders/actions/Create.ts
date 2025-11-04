import { IExecuteFunctions, sleep } from 'n8n-workflow';
import { INodeExecutionData, INodeProperties } from 'n8n-workflow';

// Properties for the Create operation
export const properties: INodeProperties[] = [
	{
		displayName: 'Billed Amount',
		name: 'billedAmount',
		type: 'number',
		required: true,
		default: 0,
		description: 'Billed amount for the order (will be recalculated when items are added)',
		displayOptions: {
			show: {
				resource: ['order'],
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
				resource: ['order'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Actual Delivery Date',
				name: 'actualDeliveryDate',
				type: 'dateTime',
				default: '',
				description: 'Actual delivery date of the order',
			},
			{
				displayName: 'Company ID',
				name: 'companyId',
				type: 'string',
				default: '',
				description: 'ID of the company associated with this order',
			},
			{
				displayName: 'Created By ID',
				name: 'createdById',
				type: 'string',
				default: '',
				description: 'ID of the user who created this order',
			},
			{
				displayName: 'Currency ID',
				name: 'currencyId',
				type: 'string',
				default: '',
				description: 'ID of the currency for the billed amount',
			},
			{
				displayName: 'Expected Delivery Date',
				name: 'expectedDeliveryDate',
				type: 'dateTime',
				default: '',
				description: 'Expected delivery date of the order',
			},
			{
				displayName: 'External ID',
				name: 'externalId',
				type: 'string',
				default: '',
				description: 'External ID of the order',
			},
			{
				displayName: 'Order Date',
				name: 'orderDate',
				type: 'dateTime',
				default: '',
				description: 'Date when the order was placed',
			},
			{
				displayName: 'Project ID',
				name: 'projectId',
				type: 'string',
				default: '',
				description: 'ID of the project associated with this order',
			},
			{
				displayName: 'Shipping Address ID',
				name: 'shippingAddressId',
				type: 'string',
				default: '',
				description: 'ID of the shipping address',
			},
			{
				displayName: 'Status ID',
				name: 'statusId',
				type: 'string',
				default: '',
				description: 'ID of the order status',
			},
			{
				displayName: 'Tracking ID',
				name: 'trackingId',
				type: 'string',
				default: '',
				description: 'Tracking ID for the shipment',
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
			const billedAmount = this.getNodeParameter('billedAmount', i) as number;
			const additionalFields = this.getNodeParameter('additionalFields', i, {}) as object;

			// Make API call to create the order
			const response = await this.helpers.requestWithAuthentication.call(this, 'hipeApi', {
				method: 'POST',
				url: `${baseUrl}/api/orders`,
				json: true,
				body: {
					billedAmount,
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
