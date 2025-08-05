import { IExecuteFunctions } from 'n8n-workflow';
import { INodeExecutionData, INodeProperties } from 'n8n-workflow';
import { ICorrugatedMaterialComposition } from '../../../interfaces';

// Properties for the Get operation
export const properties: INodeProperties[] = [
	{
		displayName: 'Composition ID',
		name: 'compositionId',
		type: 'string',
		required: true,
		default: '',
		description: 'ID of the corrugated material composition to retrieve',
		displayOptions: {
			show: {
				resource: ['corrugatedMaterialComposition'],
				operation: ['get'],
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
				operation: ['get'],
			},
		},
		options: [
			// Add any additional options for retrieving corrugated material compositions
		],
	},
];

// Execute function for the Get operation
export async function execute(
	this: IExecuteFunctions,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	// This is just a scaffold, implementation will be added later
	const returnData: INodeExecutionData[] = [];

	// Get credentials and baseUrl
	const credentials = await this.getCredentials('hipeApi');
	let baseUrl = credentials.url;
	if (typeof baseUrl !== 'string') {
		throw new Error('HIPE base URL is not a string');
	}
	baseUrl = baseUrl.replace(/\/$/, '');

	for (let i = 0; i < items.length; i++) {
		try {
			const compositionId = this.getNodeParameter('compositionId', i) as string;
			const response = await this.helpers.requestWithAuthentication.call(this, 'hipeApi', {
				method: 'GET',
				url: `${baseUrl}/api/corrugated-material-compositions/${compositionId}`,
				json: true,
			});
			returnData.push({ json: response as ICorrugatedMaterialComposition });
		} catch (error) {
			if (this.continueOnFail()) {
				returnData.push({ json: { error: error.message } });
				continue;
			}
			throw error;
		}
	}
	return returnData;
}
