import { IExecuteFunctions, sleep } from 'n8n-workflow';
import { INodeExecutionData, INodeProperties } from 'n8n-workflow';
import { RESOURCES, OPERATIONS } from '../../constants';

// Properties for the Delete operation
export const properties: INodeProperties[] = [
	{
		displayName: 'Article ID',
		name: 'articleId',
		type: 'string',
		required: true,
		default: '',
		description: 'ID of the article to delete',
		displayOptions: {
			show: {
				resource: [RESOURCES.ARTICLE],
				operation: [OPERATIONS.DELETE],
			},
		},
	},
	{
		displayName: 'Hard Delete',
		name: 'hardDelete',
		type: 'boolean',
		default: false,
		description: 'Whether to permanently delete the article instead of soft deleting it',
		displayOptions: {
			show: {
				resource: [RESOURCES.ARTICLE],
				operation: [OPERATIONS.DELETE],
			},
		},
	},
];

// Execute function for the Delete operation
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
			const hardDelete = this.getNodeParameter('hardDelete', i, false) as boolean;

			const qs: Record<string, any> = {};
			if (hardDelete) {
				qs.hardDelete = true;
			}

			// Make API call to delete the article
			const response = await this.helpers.requestWithAuthentication.call(this, 'hipeApi', {
				method: 'DELETE',
				url: `${baseUrl}/api/articles/${articleId}`,
				json: true,
				qs,
			});
			returnData.push({ json: response ?? { success: true } });
		} catch (error) {
			if (this.continueOnFail()) {
				returnData.push({ json: { error: error.message } });
				continue;
			}
			throw error;
		}
		await sleep(500);
	}

	return returnData;
}
