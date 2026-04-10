import { IExecuteFunctions, sleep } from 'n8n-workflow';
import { INodeExecutionData, INodeProperties } from 'n8n-workflow';
import { IUser } from '../../interfaces';
import { RESOURCES, OPERATIONS, CUSTOM_FIELDS } from '../../constants';

// Properties for the Create Contact
export const properties: INodeProperties[] = [
	{
		displayName: 'First Name',
		name: 'firstName',
		type: 'string',
		required: true,
		default: '',
		description: 'First name of the contact',
		displayOptions: {
			show: {
				resource: [RESOURCES.USER],
				operation: [OPERATIONS.CREATE_CONTACT],
			},
		},
	},
	{
		displayName: 'Last Name',
		name: 'lastName',
		type: 'string',
		default: '',
		description: 'Last name of the contact',
		displayOptions: {
			show: {
				resource: [RESOURCES.USER],
				operation: [OPERATIONS.CREATE_CONTACT],
			},
		},
	},
	{
		displayName: 'Email',
		name: 'email',
		type: 'string',
		placeholder: 'name@email.com',
		default: '',
		description: 'Email of the contact',
		displayOptions: {
			show: {
				resource: [RESOURCES.USER],
				operation: [OPERATIONS.CREATE_CONTACT],
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
				resource: [RESOURCES.USER],
				operation: [OPERATIONS.CREATE_CONTACT],
			},
		},
	},
	{
		displayName: 'Phone',
		name: 'phoneNumber',
		type: 'string',
		default: '',
		description: 'Phone number of the contact',
		displayOptions: {
			show: {
				resource: [RESOURCES.USER],
				operation: [OPERATIONS.CREATE_CONTACT],
			},
		},
	},
	{
		displayName: 'Mobile',
		name: 'mobilePhone',
		type: 'string',
		default: '',
		description: 'Mobile phone number of the contact',
		displayOptions: {
			show: {
				resource: [RESOURCES.USER],
				operation: [OPERATIONS.CREATE_CONTACT],
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
				resource: [RESOURCES.USER],
				operation: [OPERATIONS.CREATE_CONTACT],
			},
		},
		options: [
			{
				displayName: 'Collaboration IDs',
				name: 'collaborationIds',
				type: 'json',
				default: '',
				description: 'Array of collaboration UUIDs to associate with the contact',
			},
			{
				displayName: 'Job Title',
				name: 'job',
				type: 'string',
				default: '',
				description: 'Job title of the contact',
			},
			{
				displayName: CUSTOM_FIELDS.displayName,
				name: CUSTOM_FIELDS.name,
				type: 'json',
				default: '',
				description: 'Custom fields of the contact',
			},
			// Add any additional fields specific to creating projects
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
			// Get input data
			const firstName = this.getNodeParameter('firstName', i) as string;
			const lastName = this.getNodeParameter('lastName', i, '') as string;
			const email = this.getNodeParameter('email', i, '') as string;
			const externalId = this.getNodeParameter('externalId', i, '') as string;
			const phoneNumber = this.getNodeParameter('phoneNumber', i, '') as string;
			const mobilePhone = this.getNodeParameter('mobilePhone', i, '') as string;
			const additionalFieldsRaw = this.getNodeParameter('additionalFields', i, {}) as any;
			const additionalFields = (
				additionalFieldsRaw && typeof additionalFieldsRaw === 'object' ? additionalFieldsRaw : {}
			) as {
				collaborationIds?: string[];
				job?: string;
				customFields?: Record<string, any>;
			};
			// Fallback to possible top-level params if tests/mocks provide them
			const collaborationIds = ((additionalFields.collaborationIds as string[]) ||
				(this.getNodeParameter('collaborationIds', i, []) as string[]) ||
				[]) as string[];
			const job =
				(additionalFields.job as string) || (this.getNodeParameter('job', i, '') as string) || '';
			const customFields = ((additionalFields[CUSTOM_FIELDS.name] as object) ||
				(this.getNodeParameter(CUSTOM_FIELDS.name, i, {}) as object) ||
				{}) as object;

			// Prepare request data
			const requestData: IUser = {
				firstName,
				lastName,
				email,
				externalId,
				phoneNumber,
				mobilePhone,
				job,
				customFields,
				...(collaborationIds.length > 0 && { collaborationIds }),
			};
			// Make API call to create the corrugated format
			const response = await this.helpers.requestWithAuthentication.call(this, 'hipeApi', {
				method: 'POST',
				url: `${baseUrl}/api/users/contacts`,
				body: requestData,
				json: true,
			});

			returnData.push({ json: response, pairedItem: { item: i } });
		} catch (error) {
			if (this.continueOnFail()) {
				returnData.push({ json: { error: error.message }, pairedItem: { item: i } });
				continue;
			}
			throw error;
		}
		await sleep(500);
	}

	return returnData;
}
