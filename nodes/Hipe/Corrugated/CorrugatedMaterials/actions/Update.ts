import { IExecuteFunctions, sleep } from 'n8n-workflow';
import { INodeExecutionData, INodeProperties } from 'n8n-workflow';
import { ICorrugatedMaterial } from '../../../interfaces';

// Properties for the Update operation
export const properties: INodeProperties[] = [
	{
		displayName: 'Material ID',
		name: 'materialId',
		type: 'string',
		required: true,
		default: '',
		description: 'ID of the corrugated material to update',
		displayOptions: {
			show: {
				resource: ['corrugatedMaterial'],
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
				resource: ['corrugatedMaterial'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'Name of the corrugated material',
				displayOptions: {
					show: {
						resource: ['corrugatedMaterial'],
						operation: ['update'],
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
						operation: ['update'],
					},
				},
			},
			// Add any additional fields specific to updating corrugated materials
		],
	},
];

// Execute function for the Update operation
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
			const materialId = this.getNodeParameter('materialId', i) as string;
			const updateFields = this.getNodeParameter('updateFields', i, {}) as ICorrugatedMaterial;

			const response = await this.helpers.requestWithAuthentication.call(this, 'hipeApi', {
				method: 'PATCH',
				url: `${baseUrl}/api/corrugated-materials/${materialId}`,
				body: updateFields,
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
