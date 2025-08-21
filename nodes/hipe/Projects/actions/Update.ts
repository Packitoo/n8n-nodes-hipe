import { IExecuteFunctions } from 'n8n-workflow';
import { INodeExecutionData, INodeProperties } from 'n8n-workflow';
import { IProject } from '../../interfaces';

// Properties for the Update operation
export const properties: INodeProperties[] = [
	{
		displayName: 'Project ID',
		name: 'id',
		type: 'string',
		required: true,
		default: '',
		description: 'ID of the project to update',
		displayOptions: {
			show: {
				resource: ['project'],
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
				resource: ['project'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Company ID',
				name: 'companyId',
				type: 'string',
				default: '',
				description: 'Company ID of the project',
			},
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
				displayName: 'Manager ID',
				name: 'managerId',
				type: 'string',
				default: '',
				description: 'Manager ID of the project',
			},
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'Name of the project',
			},

			{
				displayName: 'Opportunity Pipeline ID',
				name: 'opportunityPipelineId',
				type: 'string',
				default: '',
				description: 'Opportunity pipeline ID of the project',
			},
			{
				displayName: 'Opportunity Step ID',
				name: 'opportunityStepId',
				type: 'string',
				default: '',
				description: 'Opportunity step ID of the project',
			},
			{
				displayName: 'Status ID',
				name: 'statusId',
				type: 'string',
				default: '',
				description: 'Status ID of the project',
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
			const projectId = this.getNodeParameter('id', i) as string;
			const updateFields = this.getNodeParameter('updateFields', i, {}) as IProject;

			// Make API call to update the user
			const response = await this.helpers.request!({
				method: 'PATCH',
				url: `${baseUrl}/api/projects/${encodeURIComponent(projectId)}`,
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
