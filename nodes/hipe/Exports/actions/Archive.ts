import { IExecuteFunctions } from 'n8n-workflow';
import { INodeExecutionData, INodeProperties } from 'n8n-workflow';

export const properties: INodeProperties[] = [
	{
		displayName: 'Export ID',
		name: 'id',
		type: 'string',
		required: true,
		default: '',
		description: 'ID of the export to archive',
		displayOptions: { show: { resource: ['export'], operation: ['archive'] } },
	},
];

export async function execute(this: IExecuteFunctions, items: INodeExecutionData[]): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];

	const credentials = await this.getCredentials('hipeApi');
	let baseUrl = credentials.url as string;
	if (!baseUrl || typeof baseUrl !== 'string' || !/^https?:\/\//.test(baseUrl)) {
		throw new Error('HIPE base URL is not set or is invalid: ' + baseUrl);
	}
	baseUrl = baseUrl.replace(/\/$/, '');

	for (let i = 0; i < items.length; i++) {
		try {
			const id = this.getNodeParameter('id', i) as string;
			const response = await this.helpers.requestWithAuthentication.call(this, 'hipeApi', {
				method: 'PATCH',
				url: `${baseUrl}/api/exports/${encodeURIComponent(id)}/archive`,
				json: true,
			});
			returnData.push({ json: response ?? { success: true } });
		} catch (error) {
			if (this.continueOnFail()) {
				returnData.push({ json: { error: (error as Error).message } });
				continue;
			}
			throw error;
		}
	}

	return returnData;
}
