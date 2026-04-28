import { IExecuteFunctions, sleep } from 'n8n-workflow';
import { INodeExecutionData, INodeProperties } from 'n8n-workflow';
import { RESOURCES, OPERATIONS } from '../../constants';

// Properties for the Delete operation
export const properties: INodeProperties[] = [
	{
		displayName: 'Brief Element ID',
		name: 'briefElementId',
		type: 'string',
		required: true,
		default: '',
		description: 'ID of the brief element to delete',
		displayOptions: {
			show: {
				resource: [RESOURCES.BRIEF_ELEMENT],
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

	const credentials = await this.getCredentials('hipeApi');
	let baseUrl = credentials.url;
	if (typeof baseUrl !== 'string') {
		throw new Error('HIPE base URL is not a string');
	}
	baseUrl = baseUrl.replace(/\/$/, '');

	for (let i = 0; i < items.length; i++) {
		try {
			const briefElementId = this.getNodeParameter('briefElementId', i) as string;

			const response = await this.helpers.requestWithAuthentication.call(this, 'hipeApi', {
				method: 'DELETE',
				url: `${baseUrl}/api/brief-elements/${briefElementId}`,
				json: true,
			});

			returnData.push({ json: response ?? { success: true } });
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
