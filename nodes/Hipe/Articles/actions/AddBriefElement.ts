import { IExecuteFunctions, sleep } from 'n8n-workflow';
import { INodeExecutionData, INodeProperties } from 'n8n-workflow';

// Properties for the Add Brief Element operation
export const properties: INodeProperties[] = [
	{
		displayName: 'Article ID',
		name: 'id',
		type: 'string',
		required: true,
		default: '',
		description: 'ID of the article to add a brief element to',
		displayOptions: {
			show: {
				resource: ['article'],
				operation: ['addBriefElement'],
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
				resource: ['article'],
				operation: ['addBriefElement'],
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
				resource: ['article'],
				operation: ['addBriefElement'],
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
				resource: ['article'],
				operation: ['addBriefElement'],
			},
		},
	},
];

// Execute function for the Add Brief Element operation
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
			const articleId = this.getNodeParameter('id', i) as string;
			const lengthDimension = this.getNodeParameter('lengthDimension', i, 0) as number;
			const widthDimension = this.getNodeParameter('widthDimension', i, 0) as number;
			const heightDimension = this.getNodeParameter('heightDimension', i, 0) as number;

			const body: Record<string, unknown> = {};
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

			// Make API call to add a brief element to the article
			const response = await this.helpers.requestWithAuthentication.call(this, 'hipeApi', {
				method: 'POST',
				url: `${baseUrl}/api/articles/${articleId}/brief-element`,
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
