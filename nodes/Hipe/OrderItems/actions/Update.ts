import { IExecuteFunctions, sleep } from 'n8n-workflow';
import { INodeExecutionData, INodeProperties, IDataObject } from 'n8n-workflow';
import { RESOURCES, OPERATIONS, CUSTOM_FIELDS, CREATED_AT } from '../../constants';
import { sanitizeFields } from '../../utils/sanitizeFields';

// Properties for the Update operation
export const properties: INodeProperties[] = [
	{
		displayName: 'Order Item ID',
		name: 'id',
		type: 'string',
		required: true,
		default: '',
		description: 'ID of the order item to update',
		displayOptions: {
			show: {
				resource: [RESOURCES.ORDER_ITEM],
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
				resource: [RESOURCES.ORDER_ITEM],
				operation: [OPERATIONS.UPDATE],
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
				displayName: CREATED_AT.displayName,
				name: CREATED_AT.name,
				type: 'dateTime',
				default: '',
				description: 'Creation date of the order item',
			},
			{
				displayName: CUSTOM_FIELDS.displayName,
				name: CUSTOM_FIELDS.name,
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
				displayName: 'Quantity',
				name: 'quantity',
				type: 'number',
				default: 1,
				description: 'Quantity of the order item',
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

	// Process each item
	for (let i = 0; i < items.length; i++) {
		try {
			// Get input data
			const orderItemId = this.getNodeParameter('id', i) as string;
			const rawUpdateFields = this.getNodeParameter('updateFields', i, {}) as IDataObject;
			const updateFields = sanitizeFields(rawUpdateFields);
			const response = await this.helpers.requestWithAuthentication.call(this, 'hipeApi', {
				method: 'PATCH',
				url: `${baseUrl}/api/order-items/${encodeURIComponent(orderItemId)}`,
				json: true,
				body: updateFields,
			});
			returnData.push({ json: response, pairedItem: { item: i } });
		} catch (error) {
			if (this.continueOnFail()) {
				returnData.push({ json: { error: error.message }, pairedItem: { item: i } });
				continue;
			}
			throw error;
		}
		sleep(500);
	}
	return returnData;
}
