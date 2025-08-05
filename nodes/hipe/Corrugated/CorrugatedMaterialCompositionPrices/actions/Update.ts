import { IExecuteFunctions } from 'n8n-workflow';
import { INodeExecutionData, INodeProperties } from 'n8n-workflow';
import { ICorrugatedMaterialCompositionPrice } from '../../../interfaces';

// Properties for the Update operation
export const properties: INodeProperties[] = [
	{
		displayName: 'Price ID',
		name: 'priceId',
		type: 'string',
		required: true,
		default: '',
		description: 'ID of the corrugated material composition price to update',
		displayOptions: {
			show: {
				resource: ['corrugatedMaterialCompositionPrice'],
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
				resource: ['corrugatedMaterialCompositionPrice'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Corrugated Material Composition',
				name: 'corrugatedMaterialComposition',
				type: 'string',
				default: '',
				description: 'ID of the corrugated material composition',
				displayOptions: {
					show: {
						resource: ['corrugatedMaterialCompositionPrice'],
						operation: ['update'],
					},
				},
			},
			{
				displayName: 'Currency',
				name: 'currency',
				type: 'string',
				default: 'EUR',
				description: 'Currency of the price',
				displayOptions: {
					show: {
						resource: ['corrugatedMaterialCompositionPrice'],
						operation: ['update'],
					},
				},
			},
			{
				displayName: 'Price',
				name: 'price',
				type: 'number',
				default: 0,
				description: 'Price of the composition',
				displayOptions: {
					show: {
						resource: ['corrugatedMaterialCompositionPrice'],
						operation: ['update'],
					},
				},
			},
			{
				displayName: 'Valid From',
				name: 'validFrom',
				type: 'dateTime',
				default: '',
				description: 'Date from which the price is valid',
				displayOptions: {
					show: {
						resource: ['corrugatedMaterialCompositionPrice'],
						operation: ['update'],
					},
				},
			},
			{
				displayName: 'Valid To',
				name: 'validTo',
				type: 'dateTime',
				default: '',
				description: 'Date until which the price is valid',
				displayOptions: {
					show: {
						resource: ['corrugatedMaterialCompositionPrice'],
						operation: ['update'],
					},
				},
			},
			// Add any additional fields specific to updating corrugated material composition prices
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
			const priceId = this.getNodeParameter('priceId', i) as string;
			const updateFields = this.getNodeParameter(
				'updateFields',
				i,
				{},
			) as ICorrugatedMaterialCompositionPrice;

			// In the actual implementation, this would make an API call to update the corrugated material composition price
			// For now, we just return placeholder data
			returnData.push({
				json: {
					success: true,
					data: {
						id: priceId,
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
