import { IExecuteFunctions } from 'n8n-workflow';
import { INodeExecutionData, INodeProperties } from 'n8n-workflow';

// Properties for the Create operation
export const properties: INodeProperties[] = [
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		required: true,
		default: '',
		description: 'Name of the project',
		displayOptions: {
			show: {
				resource: ['project'],
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'External ID',
		name: 'externalId',
		required: true,
		type: 'string',
		default: '',
		description: 'External ID of the project',
		displayOptions: {
			show: {
				resource: ['project'],
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'Company ID',
		name: 'companyId',
		required: true,
		type: 'string',
		default: '',
		description: 'ID of the company associated with this project',
		displayOptions: {
			show: {
				resource: ['project'],
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'Manager ID',
		name: 'managerId',
		required: true,
		type: 'string',
		default: '',
		description: 'ID of the manager associated with this project (Internal user ID)',
		displayOptions: {
			show: {
				resource: ['project'],
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
				resource: ['project'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Custom Fields',
				name: 'customFields',
				type: 'json',
				default: "",
				description: 'Custom fields of the project',
			},
			{
				displayName: 'Due Date',
				name: 'dueDate',
				type: 'dateTime',
				default: '',
				description: 'Due date of the project',
			},
			{
				displayName: 'Estimated Values',
				name: 'estimatedValues',
				type: 'number',
				default: 0,
				description: 'Estimated values of the project',
			},
			{
				displayName: 'Opportunity Pipeline ID',
				name: 'opportunityPipelineId',
				type: 'string',
				default: '',
				description:
					'Opportunity pipeline ID of the project (required if opportunityStepId is set)',
			},
			{
				displayName: 'Opportunity Step ID',
				name: 'opportunityStepId',
				type: 'string',
				default: '',
				description: 'Opportunity step ID of the project',
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
			// Get input data
			const name = this.getNodeParameter('name', i) as string;
			const companyId = this.getNodeParameter('companyId', i) as string;
			const managerId = this.getNodeParameter('managerId', i) as string;
			const externalId = this.getNodeParameter('externalId', i) as string;
			const additionalFields = this.getNodeParameter('additionalFields', i, {}) as object;

			// Make API call to get the corrugated format
			const response = await this.helpers.requestWithAuthentication.call(this, 'hipeApi', {
				method: 'POST',
				url: `${baseUrl}/api/projects`,
				json: true,
				body: {
					companyId,
					name,
					managerId,
					externalId,
					...additionalFields,
				},
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
