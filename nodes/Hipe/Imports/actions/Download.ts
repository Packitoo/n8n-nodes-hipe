import { IExecuteFunctions, sleep } from 'n8n-workflow';
import { INodeExecutionData, INodeProperties } from 'n8n-workflow';

export const properties: INodeProperties[] = [
	{
		displayName: 'Import ID',
		name: 'id',
		type: 'string',
		required: true,
		default: '',
		description: 'ID of the import to download the file for',
		displayOptions: { show: { resource: ['import'], operation: ['download'] } },
	},
	{
		displayName: 'Binary Property',
		name: 'binaryPropertyName',
		type: 'string',
		default: 'data',
		required: true,
		description: 'Name of the binary property to store the downloaded file in',
		displayOptions: { show: { resource: ['import'], operation: ['download'] } },
	},
	{
		displayName: 'File Name',
		name: 'fileName',
		type: 'string',
		default: '',
		description: 'Optional file name for the downloaded file (e.g. import.csv)',
		displayOptions: { show: { resource: ['import'], operation: ['download'] } },
	},
];

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
			const binaryPropertyName = this.getNodeParameter('binaryPropertyName', i) as string;
			const fileName = (this.getNodeParameter('fileName', i, '') as string) || `import_${id}.bin`;

			const response = (await this.helpers.requestWithAuthentication.call(this, 'hipeApi', {
				method: 'GET',
				url: `${baseUrl}/api/imports/${encodeURIComponent(id)}/download`,
				json: false,
				encoding: null,
			})) as Buffer;

			const binary = await this.helpers.prepareBinaryData(response, fileName);
			returnData.push({ json: { id }, binary: { [binaryPropertyName]: binary } });
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
