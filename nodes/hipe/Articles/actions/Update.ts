import { IExecuteFunctions } from 'n8n-workflow';
import { INodeExecutionData, INodeProperties } from 'n8n-workflow';

// Properties for the Update operation
export const properties: INodeProperties[] = [
	{
		displayName: 'Article ID',
		name: 'id',
		type: 'string',
		required: true,
		default: '',
		description: 'ID of the article to update',
		displayOptions: {
			show: {
				resource: ['article'],
				operation: ['update'],
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
				resource: ['article'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Brief Element ID',
				name: 'briefElementId',
				type: 'string',
				default: '',
				description: 'ID of the brief element this article is attached to',
			},
			{
				displayName: 'Code',
				name: 'code',
				type: 'string',
				default: '',
				description: 'Code of the article',
			},
			{
				displayName: 'Company ID',
				name: 'companyId',
				type: 'string',
				default: '',
				description: 'ID of the company associated with this article',
			},
			{
				displayName: 'Created By ID',
				name: 'createdById',
				type: 'string',
				default: '',
				description: 'ID of the user who created this article',
			},
			{
				displayName: 'Currency ID',
				name: 'currencyId',
				type: 'string',
				default: '',
				description: 'ID of the currency for the price',
			},
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				default: '',
				description: 'Description of the article',
			},
			{
				displayName: 'Enabled',
				name: 'enabled',
				type: 'boolean',
				default: true,
				description: 'Whether the article is enabled',
			},
			{
				displayName: 'External ID',
				name: 'externalId',
				type: 'string',
				default: '',
				description: 'External ID of the article',
			},
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'Name of the article',
			},
			{
				displayName: 'Preview ID',
				name: 'previewId',
				type: 'string',
				default: '',
				description: 'ID of the preview file',
			},
			{
				displayName: 'Price',
				name: 'price',
				type: 'number',
				default: 0,
				description: 'Price of the article',
			},
			{
				displayName: 'Quantity',
				name: 'quantity',
				type: 'number',
				default: 0,
				description: 'Quantity of the article in stock',
			},
			{
				displayName: 'Stocked',
				name: 'stocked',
				type: 'boolean',
				default: false,
				description: 'Whether the article is stocked',
			},
			{
				displayName: 'Unit',
				name: 'unit',
				type: 'string',
				default: '',
				description: 'Unit of measurement for the article',
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
			const articleId = this.getNodeParameter('id', i) as string;
			const updateFields = this.getNodeParameter('updateFields', i, {}) as object;

			// Make API call to update the article
			const response = await this.helpers.requestWithAuthentication.call(this, 'hipeApi', {
				method: 'PATCH',
				url: `${baseUrl}/api/articles/${encodeURIComponent(articleId)}`,
				json: true,
				body: updateFields,
			});
			returnData.push({ json: response });
		} catch (error) {
			if (this.continueOnFail()) {
				returnData.push({ json: { error: error.message } });
				continue;
			}
			throw error;
		}
	}

	return returnData;
}
