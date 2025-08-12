import { IExecuteFunctions } from 'n8n-workflow';
import { INodeExecutionData, INodeProperties } from 'n8n-workflow';
import { ICorrugatedMaterialComposition } from '../../../interfaces';

// Properties for the Create operation
export const properties: INodeProperties[] = [
	{
		displayName: 'Corrugated Material',
		name: 'corrugatedMaterial',
		type: 'string',
		required: true,
		default: '',
		description: 'ID of the corrugated material',
		displayOptions: {
			show: {
				resource: ['corrugatedMaterialComposition'],
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'Flute',
		name: 'flute',
		type: 'string',
		required: true,
		default: '',
		description: 'ID of the flute',
		displayOptions: {
			show: {
				resource: ['corrugatedMaterialComposition'],
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'Liners',
		name: 'liners',
		type: 'string',
		typeOptions: {
			multipleValues: true,
		},
		required: true,
		default: [],
		description: 'IDs of the liners',
		displayOptions: {
			show: {
				resource: ['corrugatedMaterialComposition'],
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
				resource: ['corrugatedMaterialComposition'],
				operation: ['create'],
			},
		},
		options: [
			// Add any additional fields specific to creating corrugated material compositions
		],
	},
];

// Execute function for the Create operation
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

	// Process each item
	for (let i = 0; i <items.length; i++) {
		try {
			// Get input data
			const corrugatedMaterial = this.getNodeParameter('corrugatedMaterial', i) as string;
			const flute = this.getNodeParameter('flute', i) as string;
			const liners = this.getNodeParameter('liners', i) as string[];
			const additionalFields = this.getNodeParameter('additionalFields', i, {}) as object;

			// Prepare request data
			const requestData: ICorrugatedMaterialComposition = {
				corrugatedMaterial,
				flute,
				liners,
				...(additionalFields as object),
			} as ICorrugatedMaterialComposition;

			const response = await this.helpers.requestWithAuthentication.call(this, 'hipeApi', {
				method: 'POST',
				url: `${baseUrl}/api/corrugated-material-compositions`,
				body: requestData,
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
	}

	return returnData;
}
