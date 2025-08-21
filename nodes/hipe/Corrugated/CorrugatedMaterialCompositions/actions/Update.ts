import { IExecuteFunctions } from 'n8n-workflow';
import { INodeExecutionData, INodeProperties } from 'n8n-workflow';
import { ICorrugatedMaterialComposition } from '../../../interfaces';

// Properties for the Update operation
export const properties: INodeProperties[] = [
	{
		displayName: 'Composition ID',
		name: 'compositionId',
		type: 'string',
		required: true,
		default: '',
		description: 'ID of the corrugated material composition to update',
		displayOptions: {
			show: {
				resource: ['corrugatedMaterialComposition'],
				operation: ['update'],
			},
		},
	},
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['corrugatedMaterialComposition'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Corrugated Material',
				name: 'corrugatedMaterial',
				type: 'string',
				default: '',
				description: 'ID of the corrugated material',
				displayOptions: {
					show: {
						resource: ['corrugatedMaterialComposition'],
						operation: ['update'],
					},
				},
			},
			{
				displayName: 'Flute',
				name: 'flute',
				type: 'string',
				default: '',
				description: 'ID of the flute',
				displayOptions: {
					show: {
						resource: ['corrugatedMaterialComposition'],
						operation: ['update'],
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
				default: [],
				description: 'IDs of the liners',
				displayOptions: {
					show: {
						resource: ['corrugatedMaterialComposition'],
						operation: ['update'],
					},
				},
			},
			// Add any additional fields specific to updating corrugated material compositions
		],
	},
];

// Execute function for the Update operation
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
	for (let i = 0; i < items.length; i++) {
		try {
			// Get input data
			const compositionId = this.getNodeParameter('compositionId', i) as string;
			const updateFields = this.getNodeParameter(
				'updateFields',
				i,
				{},
			) as ICorrugatedMaterialComposition;

			const response = await this.helpers.requestWithAuthentication.call(this, 'hipeApi', {
				method: 'PATCH',
				url: `${baseUrl}/api/corrugated-material-compositions/${encodeURIComponent(compositionId)}`,
				body: updateFields,
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
