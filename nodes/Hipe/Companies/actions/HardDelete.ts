import { IExecuteFunctions, sleep } from 'n8n-workflow';
import { INodeExecutionData, INodeProperties } from 'n8n-workflow';
import { RESOURCES, OPERATIONS } from '../../constants';

// Properties for the Hard Delete operation
export const properties: INodeProperties[] = [
	{
		displayName: 'Company ID',
		name: 'id',
		type: 'string',
		required: true,
		default: '',
		description: 'ID of the company to permanently delete',
		displayOptions: {
			show: {
				resource: [RESOURCES.COMPANY],
				operation: [OPERATIONS.HARD_DELETE],
			},
		},
	},
];

// Execute function for the Hard Delete operation
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
			const id = this.getNodeParameter('id', i) as string;
			const encId = encodeURIComponent(id);
			const response = await this.helpers.requestWithAuthentication.call(this, 'hipeApi', {
				method: 'DELETE',
				url: `${baseUrl}/api/companies/${encId}`,
				json: true,
			});
			returnData.push({ json: response ?? { success: true }, pairedItem: { item: i } });
		} catch (error) {
			if (this.continueOnFail()) {
				returnData.push({ json: { error: (error as Error).message }, pairedItem: { item: i } });
				continue;
			}
			throw error;
		}
		await sleep(500);
	}

	return returnData;
}
