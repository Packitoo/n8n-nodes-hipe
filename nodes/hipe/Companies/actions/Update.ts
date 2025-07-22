import { IExecuteFunctions } from 'n8n-workflow';
import { INodeExecutionData, INodeProperties } from 'n8n-workflow';
import { ICompany } from '../../interfaces';

// Properties for the Update operation
export const properties: INodeProperties[] = [
	{
		displayName: 'Company ID',
		name: 'id',
		type: 'string',
		required: true,
		default: '',
		description: 'ID of the company to update',
		displayOptions: {
			show: {
				resource: ['company'],
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
				resource: ['company'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'Name of the company',
			},
			{
				displayName: 'ManagedByID',
				name: 'managedById',
				type: 'string',
				default: '',
				description: 'ManagedById of the company',
			},
			{
				displayName: 'External ID',
				name: 'externalId',
				type: 'string',
				default: '',
				description: 'External ID of the contact',
			},
			{
				displayName: 'Collaborater Ids',
				name: 'collaboraterIds',
				type: 'collection',
				placeholder: 'Add Collaborater Id',
				default: [],
				description: 'Collaborater Ids of the contacts',
			},
			{
				displayName: 'Parent Id',
				name: 'parentId',
				type: 'string',
				default: '',
				description: 'Parent Id of the company',
			},
			{
				displayName: 'Email',
				name: 'email',
				type: 'string',
				default: '',
				description: 'Email of the company',
			},
			{
				displayName: 'Website',
				name: 'website',
				type: 'string',
				default: '',
				description: 'Website of the company',
			},
			{
				displayName: 'Phone',
				name: 'phone',
				type: 'string',
				default: '',
				description: 'Phone of the company',
			},
			{
				displayName: 'Vat',
				name: 'vat',
				type: 'string',
				default: '',
				description: 'Vat of the company',
			},
			{
				displayName: 'Custom fields',
				name: 'customFields',
				type: 'json',
				default: {},
				description: 'Custom fields of the company',
			}
			// Add any additional fields specific to updating projects
		],
	},
];

// Execute function for the Update operation
export async function execute(
	this: IExecuteFunctions,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];

	// Get credentials
	const credentials = await this.getCredentials('hipe');
	let baseUrl = credentials.url;
	if (typeof baseUrl !== 'string') {
		throw new Error('HIPE base URL is not a string');
	}
	baseUrl = baseUrl.replace(/\/$/, '');

	// Process each item
	for (let i = 0; i < items.length; i++) {
		try {
			// Get input data
			const companyId = this.getNodeParameter('id', i) as string;
			const updateFields = this.getNodeParameter('updateFields', i, {}) as ICompany;

			// Make API call to update the company
			const response = await this.helpers.requestWithAuthentication.call(this, 'hipe', {
				method: 'PATCH',
				url: `${baseUrl}/api/companies/${companyId}`,
				json: true,
				body: updateFields,
			});
			returnData.push({ json: response });
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
