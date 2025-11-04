import { IExecuteFunctions, sleep } from 'n8n-workflow';
import { INodeExecutionData, INodeProperties } from 'n8n-workflow';

export const properties: INodeProperties[] = [];

export async function execute(
	this: IExecuteFunctions,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];

	const credentials = await this.getCredentials('hipeApi');
	let baseUrl = credentials.url as string;
	if (!baseUrl || typeof baseUrl !== 'string' || !/^https?:\/\//.test(baseUrl)) {
		throw new Error('HIPE base URL is not set or is invalid: ' + baseUrl);
	}
	baseUrl = baseUrl.replace(/\/$/, '');

	for (let i = 0; i < items.length; i++) {
		try {
			const response = await this.helpers.requestWithAuthentication.call(this, 'hipeApi', {
				method: 'GET',
				url: `${baseUrl}/api/imports/utils/get-types`,
				json: true,
			});
			returnData.push({ json: response });
		} catch (error) {
			if (this.continueOnFail()) {
				returnData.push({ json: { error: (error as Error).message } });
				continue;
			}
			throw error;
		}
		sleep(500);
	}
	return returnData;
}
