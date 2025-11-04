import { IExecuteFunctions, sleep } from 'n8n-workflow';
import { INodeExecutionData, INodeProperties } from 'n8n-workflow';

// Properties for the Create operation
export const properties: INodeProperties[] = [
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		required: true,
		default: '',
		description: 'Name of the article',
		displayOptions: {
			show: {
				resource: ['article'],
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'Code',
		name: 'code',
		type: 'string',
		required: true,
		default: '',
		description: 'Code of the article',
		displayOptions: {
			show: {
				resource: ['article'],
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
				resource: ['article'],
				operation: ['create'],
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
			const name = this.getNodeParameter('name', i) as string;
			const code = this.getNodeParameter('code', i) as string;
			const additionalFields = this.getNodeParameter('additionalFields', i, {}) as object;

			// Make API call to create the article
			const response = await this.helpers.requestWithAuthentication.call(this, 'hipeApi', {
				method: 'POST',
				url: `${baseUrl}/api/articles`,
				json: true,
				body: {
					name,
					code,
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
