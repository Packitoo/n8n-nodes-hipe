import { IExecuteFunctions, sleep } from 'n8n-workflow';
import { INodeExecutionData, INodeProperties } from 'n8n-workflow';

// Properties for the CreateBulk operation
export const properties: INodeProperties[] = [
	{
		displayName: 'Input Data Field',
		name: 'inputDataField',
		type: 'string',
		default: 'data',
		required: true,
		description: 'The name of the input field containing the array of compositions to create',
		displayOptions: {
			show: {
				resource: ['corrugatedMaterialComposition'],
				operation: ['createBulk'],
			},
		},
	},
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['corrugatedMaterialComposition'],
				operation: ['createBulk'],
			},
		},
		options: [
			{
				displayName: 'Continue on Error',
				name: 'continueOnError',
				type: 'boolean',
				default: false,
				description: 'Whether to continue processing if an error occurs with one item',
			},
		],
	},
];

// Execute function for the CreateBulk operation
export async function execute(
	this: IExecuteFunctions,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];

	// Get credentials and normalize base URL
	const credentials = await this.getCredentials('hipeApi');
	let baseUrl = credentials.url;
	if (typeof baseUrl !== 'string') {
		throw new Error('HIPE base URL is not a string');
	}
	baseUrl = baseUrl.replace(/\/$/, '');

	// Process each input item
	for (let i = 0; i < items.length; i++) {
		try {
			const inputDataField = this.getNodeParameter('inputDataField', i) as string;
			const inputData = items[i].json[inputDataField];

			if (!Array.isArray(inputData)) {
				throw new Error(
					`Input data field '${inputDataField}' must contain an array of compositions`,
				);
			}

			// Single bulk POST to backend
			const response = await this.helpers.requestWithAuthentication.call(this, 'hipeApi', {
				method: 'POST',
				url: `${baseUrl}/api/corrugated-material-compositions/bulk`,
				body: inputData,
				json: true,
			});

			returnData.push({ json: response });
		} catch (error) {
			if (
				this.continueOnFail() ||
				(this.getNodeParameter('options', i, {}) as { continueOnError?: boolean }).continueOnError
			) {
				returnData.push({ json: { error: (error as Error).message } });
				continue;
			}
			throw error;
		}
		sleep(500);
	}
	return returnData;
}
