import { IExecuteFunctions, sleep } from 'n8n-workflow';
import { INodeExecutionData, INodeProperties } from 'n8n-workflow';

// Properties for the Upload File operation
export const properties: INodeProperties[] = [
	{
		displayName: 'Order ID',
		name: 'orderId',
		type: 'string',
		required: true,
		default: '',
		description: 'ID of the order to upload file to',
		displayOptions: {
			show: {
				resource: ['order'],
				operation: ['uploadFile'],
			},
		},
	},
	{
		displayName: 'Binary Property',
		name: 'binaryPropertyName',
		type: 'string',
		default: 'data',
		required: true,
		description: 'Name of the binary property that contains the file to upload',
		displayOptions: {
			show: {
				resource: ['order'],
				operation: ['uploadFile'],
			},
		},
	},
];

// Execute function for the Upload File operation
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
			const orderId = this.getNodeParameter('orderId', i) as string;
			const binaryPropertyName = this.getNodeParameter('binaryPropertyName', i) as string;
			this.logger.debug(`Binary property name: ${binaryPropertyName}`);
			this.logger.debug(`Binary property value: ${JSON.stringify(items[i].binary)}`);
			const binaryData = items[i].binary;
			this.logger.debug(`Binary data: ${JSON.stringify(binaryData)}`);

			const binaryEntry = items[i].binary?.[binaryPropertyName];
			this.logger.debug(`binaryEntry: ${JSON.stringify(binaryEntry)}`);
			if (!binaryEntry) {
				throw new Error(
					`Binary property "${binaryPropertyName}" not found on item. Available binary keys: ${Object.keys(items[i].binary || {}).join(', ')}`,
				);
			}

			const buffer = await this.helpers.getBinaryDataBuffer(i, binaryPropertyName);

			const response = await this.helpers.requestWithAuthentication.call(this, 'hipeApi', {
				method: 'POST',
				url: `${baseUrl}/api/orders/${orderId}/files`,
				formData: {
					file: {
						value: buffer,
						options: {
							filename: binaryEntry.fileName || 'upload.bin',
							contentType: binaryEntry.mimeType || 'application/octet-stream',
						},
					},
				},
			});

			returnData.push({ json: { success: true, response } });
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
