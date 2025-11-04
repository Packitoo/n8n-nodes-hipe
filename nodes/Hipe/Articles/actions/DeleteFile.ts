import { IExecuteFunctions, sleep } from 'n8n-workflow';
import { INodeExecutionData, INodeProperties } from 'n8n-workflow';

// Properties for the Delete File operation
export const properties: INodeProperties[] = [
	{
		displayName: 'Article ID',
		name: 'articleId',
		type: 'string',
		required: true,
		default: '',
		description: 'ID of the article',
		displayOptions: {
			show: {
				resource: ['article'],
				operation: ['deleteFile'],
			},
		},
	},
	{
		displayName: 'File ID',
		name: 'fileId',
		type: 'string',
		required: true,
		default: '',
		description: 'ID of the file to delete',
		displayOptions: {
			show: {
				resource: ['article'],
				operation: ['deleteFile'],
			},
		},
	},
];

// Execute function for the Delete File operation
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

			// Make API call to delete the file
			await this.helpers.requestWithAuthentication.call(this, 'hipeApi', {
				method: 'DELETE',
				url: `${baseUrl}/api/articles/${articleId}/files/${fileId}`,
				json: true,
			});

			returnData.push({ json: { success: true, articleId, fileId } });
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
