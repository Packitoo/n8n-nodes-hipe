import { IExecuteFunctions } from 'n8n-workflow';
import { INodeExecutionData, INodeProperties } from 'n8n-workflow';
import { ICorrugatedSupplier } from '../../../interfaces';

// Properties for the Create operation
export const properties: INodeProperties[] = [
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		required: true,
		default: '',
		description: 'Name of the corrugated supplier',
		displayOptions: {
			show: {
				resource: ['corrugatedSupplier'],
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
				resource: ['corrugatedSupplier'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Contact Info',
				name: 'contactInfo',
				type: 'string',
				default: '',
				description: 'Contact information of the supplier',
				displayOptions: {
					show: {
						resource: ['corrugatedSupplier'],
						operation: ['create'],
					},
				},
			},
			// Add any additional fields specific to creating corrugated suppliers
		],
	},
];

// Execute function for the Create operation
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
			const name = this.getNodeParameter('name', i) as string;
			const additionalFields = this.getNodeParameter('additionalFields', i, {}) as object;

			// Prepare request data
			const requestData: ICorrugatedSupplier = {
				name,
				...additionalFields,
			};

			// In the actual implementation, this would make an API call to create the corrugated supplier
			// For now, we just return the request data as a placeholder
			returnData.push({
				json: {
					success: true,
					data: requestData,
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
