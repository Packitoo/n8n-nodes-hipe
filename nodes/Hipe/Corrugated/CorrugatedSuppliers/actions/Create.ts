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
			const additionalFields = this.getNodeParameter('additionalFields', i, {}) as object;

			// Prepare request data
			const requestData: ICorrugatedSupplier = {
				name,
				...additionalFields,
			};

			const response = await this.helpers.requestWithAuthentication.call(this, 'hipeApi', {
				method: 'POST',
				url: `${baseUrl}/api/corrugated-suppliers`,
				body: requestData,
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
