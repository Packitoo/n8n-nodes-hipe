import { IExecuteFunctions, sleep } from 'n8n-workflow';
import { INodeExecutionData, INodeProperties } from 'n8n-workflow';
import { ICompany } from '../../interfaces';

// Properties for the Create Company
export const properties: INodeProperties[] = [
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		required: true,
		default: '',
		description: 'Name of the company',
		displayOptions: {
			show: {
				resource: ['company'],
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'ManagedByID',
		name: 'managedById',
		type: 'string',
		default: '',
		description: 'ManagedById of the company',
		displayOptions: {
			show: {
				resource: ['company'],
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'External ID',
		name: 'externalId',
		type: 'string',
		default: '',
		description: 'External ID of the contact',
		displayOptions: {
			show: {
				resource: ['company'],
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
				resource: ['company'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Collaborator IDs',
				name: 'collaboratorIds',
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
				displayName: 'Currency ID',
				name: 'currencyId',
				type: 'string',
				default: '',
				description: 'Currency ID of the company',
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
		],
	},
];

// Execute function for the Create operation
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
			const name = this.getNodeParameter('name', i) as string;
			const managedById = this.getNodeParameter('managedById', i, '') as string;
			const externalId = this.getNodeParameter('externalId', i, '') as string;

			const additionalFieldsObj = this.getNodeParameter('additionalFields', i, {}) || {};
			const collaboratorIdsGroup = additionalFieldsObj.collaboratorIds;
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
			if (additionalFieldsObj.collaboratorIds) {
				delete additionalFieldsObj.collaboratorIds;
			}
			const requestData: ICompany = {
				...additionalFieldsObj,
				name,
				...(managedById ? { managedById } : {}),
				...(externalId ? { externalId } : {}),
				...(collab.length > 0 ? { collaboratorIds: collab } : {}),
			};

			// Make API call to create the corrugated format
			const response = await this.helpers.requestWithAuthentication.call(this, 'hipeApi', {
				method: 'POST',
				url: `${baseUrl}/api/companies`,
				body: requestData,
				json: true,
			});

			returnData.push({ json: response });
		} catch (error) {
			if (this.continueOnFail()) {
				returnData.push({
					json: { error: error.message.replace('collaboraterIds', 'collaboratorIds') },
				});
				continue;
			}
			throw error;
		}
		sleep(500);
	}
	return returnData;
}
