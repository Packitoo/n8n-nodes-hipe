import { IExecuteFunctions, sleep } from 'n8n-workflow';
import { INodeExecutionData, INodeProperties, IDataObject } from 'n8n-workflow';
import { RESOURCES, OPERATIONS } from '../../constants';
import { sanitizeFields } from '../../utils/sanitizeFields';

// Properties for the Update operation
export const properties: INodeProperties[] = [
	{
		displayName: 'Brief Element ID',
		name: 'id',
		type: 'string',
		default: '',
		description: 'ID of the brief element to update',
		displayOptions: {
			show: {
				resource: [RESOURCES.BRIEF_ELEMENT],
				operation: [OPERATIONS.UPDATE],
			},
		},
	},
	{
		displayName: 'Length Dimension',
		name: 'lengthDimension',
		type: 'number',
		default: 0,
		description: "The product's length dimension",
		displayOptions: {
			show: {
				resource: [RESOURCES.BRIEF_ELEMENT],
				operation: [OPERATIONS.UPDATE],
			},
		},
	},
	{
		displayName: 'Width Dimension',
		name: 'widthDimension',
		type: 'number',
		default: 0,
		description: "The product's width dimension",
		displayOptions: {
			show: {
				resource: [RESOURCES.BRIEF_ELEMENT],
				operation: [OPERATIONS.UPDATE],
			},
		},
	},
	{
		displayName: 'Height Dimension',
		name: 'heightDimension',
		type: 'number',
		default: 0,
		description: "The product's height dimension",
		displayOptions: {
			show: {
				resource: [RESOURCES.BRIEF_ELEMENT],
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
				resource: [RESOURCES.BRIEF_ELEMENT],
				operation: [OPERATIONS.UPDATE],
			},
		},
		options: [
			{
				displayName: 'Brief ID',
				name: 'briefId',
				type: 'string',
				default: '',
				description: 'ID of the parent brief',
			},
			{
				displayName: 'Decorations Count',
				name: 'decorationsCount',
				type: 'json',
				default: '[]',
				description: 'Decorations count as JSON array',
			},
			{
				displayName: 'External ID',
				name: 'externalId',
				type: 'string',
				default: '',
				description: 'External identifier referencing the entity in external systems',
			},
			{
				displayName: 'Position',
				name: 'position',
				type: 'number',
				default: 0,
				description: 'Current position in the list',
			},
			{
				displayName: 'Product Category ID',
				name: 'productCategoryId',
				type: 'string',
				default: '',
				description: 'The product category ID reference',
			},
			{
				displayName: 'Product ID',
				name: 'productId',
				type: 'string',
				default: '',
				description: 'The product ID reference',
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

	const credentials = await this.getCredentials('hipeApi');
	let baseUrl = credentials.url;
	if (typeof baseUrl !== 'string') {
		throw new Error('HIPE base URL is not a string');
	}
	baseUrl = baseUrl.replace(/\/$/, '');

	for (let i = 0; i < items.length; i++) {
		try {
			const briefElementId = this.getNodeParameter('id', i) as string;
			const lengthDimension = this.getNodeParameter('lengthDimension', i, 0) as number;
			const widthDimension = this.getNodeParameter('widthDimension', i, 0) as number;
			const heightDimension = this.getNodeParameter('heightDimension', i, 0) as number;
			const updateFields = sanitizeFields(
				this.getNodeParameter('updateFields', i, {}) as IDataObject,
			);

			if (updateFields.decorationsCount && typeof updateFields.decorationsCount === 'string') {
				updateFields.decorationsCount = JSON.parse(updateFields.decorationsCount as string);
			}

			const body: Record<string, unknown> = { ...updateFields };
			const alias: Record<string, number> = {};

			if (lengthDimension) {
				body.lengthDimension = lengthDimension;
				alias.length = lengthDimension;
			}
			if (widthDimension) {
				body.widthDimension = widthDimension;
				alias.width = widthDimension;
			}
			if (heightDimension) {
				body.heightDimension = heightDimension;
				alias.height = heightDimension;
			}

			if (Object.keys(alias).length > 0) {
				body.alias = alias;
			}

			const response = await this.helpers.requestWithAuthentication.call(this, 'hipeApi', {
				method: 'PATCH',
				url: `${baseUrl}/api/brief-elements/${encodeURIComponent(briefElementId)}`,
				json: true,
				body,
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
