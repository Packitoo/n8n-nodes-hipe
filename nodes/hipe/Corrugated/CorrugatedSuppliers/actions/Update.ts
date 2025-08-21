import { IExecuteFunctions } from 'n8n-workflow';
import { INodeExecutionData, INodeProperties } from 'n8n-workflow';
import { ICorrugatedSupplier } from '../../../interfaces';

// Properties for the Update operation
export const properties: INodeProperties[] = [
	{
		displayName: 'Supplier ID',
		name: 'supplierId',
		type: 'string',
		required: true,
		default: '',
		description: 'ID of the corrugated supplier to update',
		displayOptions: {
			show: {
				resource: ['corrugatedSupplier'],
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
				resource: ['corrugatedSupplier'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'Name of the corrugated supplier',
				displayOptions: {
					show: {
						resource: ['corrugatedSupplier'],
						operation: ['update'],
					},
				},
			},
			{
				displayName: 'Contact Info',
				name: 'contactInfo',
				type: 'string',
				default: '',
				description: 'Contact information of the supplier',
				displayOptions: {
					show: {
						resource: ['corrugatedSupplier'],
						operation: ['update'],
					},
				},
			},
			// Add any additional fields specific to updating corrugated suppliers
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
			const supplierId = this.getNodeParameter('supplierId', i) as string;
			const updateFields = this.getNodeParameter('updateFields', i, {}) as ICorrugatedSupplier;

            const response = await this.helpers.requestWithAuthentication.call(this, 'hipeApi', {
                method: 'PATCH',
                url: `${baseUrl}/api/corrugated-suppliers/${supplierId}`,
                body: updateFields,
                json: true,
            });

            returnData.push({ json: response as ICorrugatedSupplier });
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
