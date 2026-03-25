import { IExecuteFunctions, sleep } from 'n8n-workflow';
import { INodeExecutionData, INodeProperties } from 'n8n-workflow';
import { RESOURCES, OPERATIONS } from '../../constants';

export const properties: INodeProperties[] = [
	{
		displayName: 'Job ID',
		name: 'id',
		type: 'string',
		required: true,
		default: '',
		description: 'ID of the job to mark as failed',
		displayOptions: {
			show: {
				resource: [RESOURCES.JOB],
				operation: [OPERATIONS.FAIL],
			},
		},
	},
	{
		displayName: 'Error',
		name: 'error',
		type: 'json',
		required: true,
		default: '{}',
		description: 'Error details as JSON',
		displayOptions: {
			show: {
				resource: [RESOURCES.JOB],
				operation: [OPERATIONS.FAIL],
			},
		},
	},
];

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
			const id = this.getNodeParameter('id', i) as string;
			const errorRaw = this.getNodeParameter('error', i) as string | Record<string, any>;

			const errorPayload = typeof errorRaw === 'string' ? JSON.parse(errorRaw) : errorRaw;

			const response = await this.helpers.requestWithAuthentication.call(this, 'hipeApi', {
				method: 'PATCH',
				url: `${baseUrl}/api/jobs/${id}/fail`,
				body: { error: errorPayload },
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
		await sleep(500);
	}
	return returnData;
}
