import { IDataObject, IExecuteFunctions, sleep } from 'n8n-workflow';
import { INodeExecutionData, INodeProperties } from 'n8n-workflow';

// Properties for the Create Import
export const properties: INodeProperties[] = [
	{
		displayName: 'Type',
		name: 'type',
		type: 'number',
		required: true,
		default: 0,
		description: 'Type of the import',
		displayOptions: {
			show: {
				resource: ['import'],
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'Delimiter',
		name: 'delimiter',
		type: 'string',
		required: true,
		default: ',',
		description: 'Delimiter used in the imported file',
		displayOptions: {
			show: {
				resource: ['import'],
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'Binary Property',
		name: 'binaryPropertyName',
		type: 'string',
		required: true,
		default: 'data',
		description:
			'Name of the binary property that contains the CSV file to upload. Create Import always sends multipart/form-data with this file.',
		displayOptions: {
			show: {
				resource: ['import'],
				operation: ['create'],
			},
		},
	},
];

// Execute function for the Create Import
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
			const type = this.getNodeParameter('type', i) as number;
			const delimiter = this.getNodeParameter('delimiter', i) as string;
			const binaryPropertyName = this.getNodeParameter('binaryPropertyName', i) as string;

			// Always require file and send multipart/form-data
			const binaryEntry = items[i].binary?.[binaryPropertyName as string];
			if (!binaryEntry) {
				throw new Error(
					`Binary property "${binaryPropertyName}" not found on item. Available binary keys: ${Object.keys(items[i].binary || {}).join(', ')}`,
				);
			}

			const buffer = await this.helpers.getBinaryDataBuffer(i, binaryPropertyName as string);

			const response = await this.helpers.requestWithAuthentication.call(this, 'hipeApi', {
				method: 'POST',
				url: `${baseUrl}/api/imports`,
				json: true,
				formData: {
					// For multipart fields, send primitives as strings for compatibility
					type: String(type),
					delimiter: delimiter,
					csv: {
						value: buffer,
						options: {
							filename: binaryEntry.fileName || 'upload.csv',
							contentType: binaryEntry.mimeType || 'text/csv',
						},
					},
				},
			});
			const data = typeof response === 'string' ? JSON.parse(response) : (response as IDataObject);
			returnData.push({ json: data });
			sleep(500);
		} catch (error: any) {
			if (this.continueOnFail()) {
				returnData.push({ json: { error: error.message } });
				continue;
			}
			throw error;
		}
	}
	return returnData;
}
