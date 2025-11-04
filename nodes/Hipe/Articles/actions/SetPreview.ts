import { IExecuteFunctions, sleep } from 'n8n-workflow';
import { INodeExecutionData, INodeProperties } from 'n8n-workflow';

// Properties for the Set Preview operation
export const properties: INodeProperties[] = [
	{
		displayName: 'Article ID',
		name: 'articleId',
		type: 'string',
		required: true,
		default: '',
		description: 'ID of the article to set preview for',
		displayOptions: {
			show: {
				resource: ['article'],
				operation: ['setPreview'],
			},
		},
	},
	{
		displayName: 'File ID',
		name: 'fileId',
		type: 'string',
		required: true,
		default: '',
		description: 'ID of the image file to set as preview (must be jpeg, png, webp, jpg, etc.)',
		displayOptions: {
			show: {
				resource: ['article'],
				operation: ['setPreview'],
			},
		},
	},
];

// Execute function for the Set Preview operation
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
			const articleId = this.getNodeParameter('articleId', i) as string;
			const fileId = this.getNodeParameter('fileId', i) as string;

			// Make API call to set preview
			const response = await this.helpers.requestWithAuthentication.call(this, 'hipeApi', {
				method: 'PATCH',
				url: `${baseUrl}/api/articles/${articleId}/files/${fileId}/default`,
				json: true,
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
