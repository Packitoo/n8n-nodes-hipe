import { IExecuteFunctions, sleep } from 'n8n-workflow';
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
				displayName: 'Collaborator IDs',
				name: 'collaboraterIds',
				type: 'fixedCollection',
				placeholder: 'Add Collaborator ID',
				default: {},
				typeOptions: {
					multipleValues: true,
				},
				options: [
					{
						name: 'collaboratorIdFields',
						displayName: 'Collaborator Id',
						values: [
							{
								displayName: 'ID',
								name: 'id',
								type: 'string',
								default: '',
								description: 'Collaborator ID',
							},
						],
					},
				],
				description: 'Add one or more Collaborator IDs',
			},
			{
				displayName: 'Custom Fields',
				name: 'customFields',
				type: 'json',
				default: '',
				description: 'Custom fields of the company',
			},
			{
				displayName: 'Email',
				name: 'email',
				type: 'string',
				placeholder: 'name@email.com',
				default: '',
				description: 'Email of the company',
			},
			{
				displayName: 'External ID',
				name: 'externalId',
				type: 'string',
				default: '',
				description: 'External ID of the contact',
			},
			{
				displayName: 'ManagedByID',
				name: 'managedById',
				type: 'string',
				default: '',
				description: 'ManagedById of the company',
			},
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'Name of the company',
			},
			{
				displayName: 'Parent ID',
				name: 'parentId',
				type: 'string',
				default: '',
				description: 'Parent ID of the company',
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
				displayName: 'Website',
				name: 'website',
				type: 'string',
				default: '',
				description: 'Website of the company',
			},
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
			const companyId = this.getNodeParameter('id', i) as string;
			const updateFields = this.getNodeParameter('updateFields', i, {}) as ICompany;

			const collaboratorIdsGroup = updateFields.collaboratorIds;
			let collab: string[] = [];
			if (
				collaboratorIdsGroup &&
				typeof collaboratorIdsGroup === 'object' &&
				!Array.isArray(collaboratorIdsGroup) &&
				'collaboratorIdFields' in collaboratorIdsGroup &&
				Array.isArray((collaboratorIdsGroup as any).collaboratorIdFields)
			) {
				const collaboratorIdFields = (collaboratorIdsGroup as any).collaboratorIdFields;
				if (collaboratorIdFields.every((field: any) => 'id' in field)) {
					collab = collaboratorIdFields.map((field: any) => field.id).filter((id: string) => !!id);
				}
			}
			if (updateFields.collaboratorIds) {
				delete updateFields.collaboratorIds;
			}

			const requestData: ICompany = {
				...updateFields,
				...(collab.length > 0 ? { collaboratorIds: collab } : {}),
			};

			// Make API call to update the company
			const response = await this.helpers.requestWithAuthentication.call(this, 'hipeApi', {
				method: 'PATCH',
				url: `${baseUrl}/api/companies/${companyId}`,
				json: true,
				body: requestData,
			});
			returnData.push({ json: response });
		} catch (error) {
			if (this.continueOnFail()) {
				returnData.push({ json: { error: error.message } });
				continue;
			}
			throw error;
		}
		sleep(500);
	}
	return returnData;
}
