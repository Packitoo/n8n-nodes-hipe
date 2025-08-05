import { IExecuteFunctions } from 'n8n-workflow';
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
	// This is just a scaffold, implementation will be added later
	const returnData: INodeExecutionData[] = [];

	// Process each item
	for (let i = 0; i < items.length; i++) {
		try {
			// Get input data
			const materialId = this.getNodeParameter('materialId', i) as string;
			const updateFields = this.getNodeParameter('updateFields', i, {}) as ICorrugatedMaterial;

			// In the actual implementation, this would make an API call to update the corrugated material
			// For now, we just return placeholder data
			returnData.push({
				json: {
					success: true,
					data: {
						id: materialId,
						...updateFields,
					},
				},
			});
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
