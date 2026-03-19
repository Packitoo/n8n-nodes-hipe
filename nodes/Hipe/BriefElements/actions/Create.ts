import { IExecuteFunctions, sleep } from 'n8n-workflow';
import { INodeExecutionData, INodeProperties } from 'n8n-workflow';
import { RESOURCES, OPERATIONS } from '../../constants';

// Properties for the Create operation
export const properties: INodeProperties[] = [
	{
		displayName: 'Brief ID',
		name: 'briefId',
		type: 'string',
		default: '',
		description: 'ID of the parent brief',
		displayOptions: {
			show: {
				resource: [RESOURCES.BRIEF_ELEMENT],
				operation: [OPERATIONS.CREATE],
			},
		},
	},
	{
		displayName: 'Position',
		name: 'position',
		type: 'number',
		default: 0,
		description: 'Current position in the list',
		displayOptions: {
			show: {
				resource: [RESOURCES.BRIEF_ELEMENT],
				operation: [OPERATIONS.CREATE],
			},
		},
	},
	{
		displayName: 'Product Category ID',
		name: 'productCategoryId',
		type: 'string',
		default: '',
		description: 'The product category ID reference',
		displayOptions: {
			show: {
				resource: [RESOURCES.BRIEF_ELEMENT],
				operation: [OPERATIONS.CREATE],
			},
		},
	},
	{
		displayName: 'Product ID',
		name: 'productId',
		type: 'string',
		default: '',
		description: 'The product ID reference',
		displayOptions: {
			show: {
				resource: [RESOURCES.BRIEF_ELEMENT],
				operation: [OPERATIONS.CREATE],
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
				operation: [OPERATIONS.CREATE],
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
				operation: [OPERATIONS.CREATE],
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
				operation: [OPERATIONS.CREATE],
			},
		},
	},
	{
		displayName: 'Decorations Count',
		name: 'decorationsCount',
		type: 'json',
		default: '[]',
		description: 'Decorations count as JSON array',
		displayOptions: {
			show: {
				resource: [RESOURCES.BRIEF_ELEMENT],
				operation: [OPERATIONS.CREATE],
			},
		},
	},
];

// Execute function for the Create operation
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
			const briefId = this.getNodeParameter('briefId', i, '') as string;
			const position = this.getNodeParameter('position', i, 0) as number;
			const productCategoryId = this.getNodeParameter('productCategoryId', i, '') as string;
			const productId = this.getNodeParameter('productId', i, '') as string;
			const lengthDimension = this.getNodeParameter('lengthDimension', i, 0) as number;
			const widthDimension = this.getNodeParameter('widthDimension', i, 0) as number;
			const heightDimension = this.getNodeParameter('heightDimension', i, 0) as number;
			const decorationsCountRaw = this.getNodeParameter('decorationsCount', i, '[]') as string;

			const body: Record<string, unknown> = {};

			if (briefId) body.briefId = briefId;
			if (position) body.position = position;
			if (productCategoryId) body.productCategoryId = productCategoryId;
			if (productId) body.productId = productId;

			const decorationsCount =
				typeof decorationsCountRaw === 'string'
					? JSON.parse(decorationsCountRaw)
					: decorationsCountRaw;
			if (Array.isArray(decorationsCount) && decorationsCount.length > 0) {
				body.decorationsCount = decorationsCount;
			}

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
				method: 'POST',
				url: `${baseUrl}/api/brief-elements`,
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
