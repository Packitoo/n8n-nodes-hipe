import { IExecuteFunctions } from 'n8n-workflow';
import { INodeExecutionData, INodeProperties } from 'n8n-workflow';

// Properties for the Delete operation
export const properties: INodeProperties[] = [
	{
		displayName: 'Composition ID',
		name: 'compositionId',
		type: 'string',
		required: true,
		default: '',
		description: 'ID of the corrugated material composition to delete',
		displayOptions: {
			show: {
				resource: ['corrugatedMaterialComposition'],
				operation: ['delete'],
			},
		},
	},
];

// Execute function for the Delete operation
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
			const compositionId = this.getNodeParameter('compositionId', i) as string;

			// In the actual implementation, this would make an API call to delete the corrugated material composition
			// For now, we just return placeholder data
			returnData.push({
				json: {
					success: true,
					data: {
						id: compositionId,
						deleted: true,
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
