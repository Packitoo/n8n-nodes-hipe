import { IExecuteFunctions, sleep } from 'n8n-workflow';
import { INodeExecutionData, INodeProperties } from 'n8n-workflow';
import { ICorrugatedMaterial } from '../../../interfaces';

// Properties for the Create operation
export const properties: INodeProperties[] = [
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		required: true,
		default: '',
		description: 'Name of the corrugated material',
		displayOptions: {
			show: {
				resource: ['corrugatedMaterial'],
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'Description',
		name: 'description',
		type: 'string',
		default: '',
		description: 'Description of the corrugated material',
		displayOptions: {
			show: {
				resource: ['corrugatedMaterial'],
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['corrugatedMaterial'],
				operation: ['create'],
			},
		},
		options: [
			// Add any additional fields specific to creating corrugated materials
		],
	},
];

// Execute function for the Create operation
export async function execute(
	this: IExecuteFunctions,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];

	// Get credentials and baseUrl
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
			const name = this.getNodeParameter('name', i) as string;
			const description = this.getNodeParameter('description', i, '') as string;
			const additionalFields = this.getNodeParameter('additionalFields', i, {}) as object;

			// Prepare request data
			const requestData: ICorrugatedMaterial = {
				name,
				description,
				...additionalFields,
			};

			// Create corrugated material
			const response = await this.helpers.requestWithAuthentication.call(this, 'hipeApi', {
				method: 'POST',
				url: `${baseUrl}/api/corrugated-materials`,
				body: requestData,
				json: true,
			});

			returnData.push({ json: response as ICorrugatedMaterial });
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
