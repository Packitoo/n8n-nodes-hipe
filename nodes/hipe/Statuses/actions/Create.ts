import { IExecuteFunctions } from 'n8n-workflow';
import { INodeExecutionData, INodeProperties } from 'n8n-workflow';
import { IStatus } from '../../interfaces';
import { ENTITIES_OPTIONS } from './constant';

// Properties for the Create Contact
export const properties: INodeProperties[] = [
	{
		displayName: 'Entity',
		name: 'entity',
		type: 'options',
		default: '',
		options: ENTITIES_OPTIONS || [],
		displayOptions: {
			show: {
				resource: ['statuses'],
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'Position',
		name: 'position',
		type: 'number',
		default: 0,
		description: 'Position of the status',
		displayOptions: {
			show: {
				resource: ['statuses'],
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'Internal Label',
		name: 'internalLabel',
		type: 'json',
		default: {
			en: '',
			fr: '',
		},
		description: 'Internal label of the status',
		displayOptions: {
			show: {
				resource: ['statuses'],
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'External Label',
		name: 'externalLabel',
		type: 'json',
		default: {
			en: '',
			fr: '',
		},
		description: 'External label of the status',
		displayOptions: {
			show: {
				resource: ['statuses'],
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'External ID',
		name: 'externalId',
		type: 'string',
		default: '',
		description: 'External ID of the status',
		displayOptions: {
			show: {
				resource: ['statuses'],
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'Is Completed',
		name: 'isCompleted',
		type: 'boolean',
		default: false,
		description: 'Is the status completed?',
		displayOptions: {
			show: {
				resource: ['statuses'],
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'Is Creation',
		name: 'isCreation',
		type: 'boolean',
		default: false,
		description: 'Is the status creation?',
		displayOptions: {
			show: {
				resource: ['statuses'],
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'Is Overdue',
		name: 'isOverdue',
		type: 'boolean',
		default: false,
		description: 'Is the status overdue?',
		displayOptions: {
			show: {
				resource: ['statuses'],
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
				resource: ['statuses'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Foreground color',
				name: 'fgColor',
				type: 'color',
				default: '',
				description: 'Foreground color of the status',
			},
			{
				displayName: 'Background color',
				name: 'bgColor',
				type: 'color',
				default: '',
				description: 'Background color of the status',
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
			const entity = this.getNodeParameter('entity', i) as string;
			const position = this.getNodeParameter('position', i) as number;
			const internalLabel = this.getNodeParameter('internalLabel', i) as string;
			const externalLabel = this.getNodeParameter('externalLabel', i) as string;
			const externalId = this.getNodeParameter('externalId', i) as string;
			const isCompleted = this.getNodeParameter('isCompleted', i) as boolean;
			const isCreation = this.getNodeParameter('isCreation', i) as boolean;
			const isOverdue = this.getNodeParameter('isOverdue', i) as boolean;
			const additionalFields = this.getNodeParameter('additionalFields', i) as object;
			

			// Prepare request data
			const requestData: IStatus = {
				entity,
				position,
				internalLabel,
				externalLabel,
				externalId,
				isCompleted,
				isCreation,
				isOverdue,
				additionalFields,
			};
			// Make API call to create the corrugated format
			const response = await this.helpers.requestWithAuthentication.call(this, 'hipeApi', {
				method: 'POST',
				url: `${baseUrl}/api/statuses`,
				body: requestData,
				json: true,
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
