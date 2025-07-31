import { IExecuteFunctions } from 'n8n-workflow';
import { INodeExecutionData, INodeProperties } from 'n8n-workflow';
import { ENTITIES_OPTIONS } from './constant';

// Properties for the Create Contact
export const properties: INodeProperties[] = [
    {
        displayName: 'Status ID',
        name: 'statusID',
        type: 'string',
        default: '',
        displayOptions: {
            show: {
                resource: ['statuses'],
                operation: ['update'],
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
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Entity',
				name: 'entity',
				type: 'options',
				default: '',
				options: ENTITIES_OPTIONS,
			},
			{
				displayName: 'Position',
				name: 'position',
				type: 'number',
				default: 0,
				description: 'Position of the status',
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
			},
			{
				displayName: 'External ID',
				name: 'externalId',
				type: 'string',
				default: '',
				description: 'External ID of the status',
			},
			{
				displayName: 'Is Completed',
				name: 'isCompleted',
				type: 'boolean',
				default: false,
				description: 'Is the status completed?',
			},
			{
				displayName: 'Is Creation',
				name: 'isCreation',
				type: 'boolean',
				default: false,
				description: 'Is the status creation?',
			},
			{
				displayName: 'Is Overdue',
				name: 'isOverdue',
				type: 'boolean',
				default: false,
				description: 'Is the status overdue?',
			},
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
			const statusId = this.getNodeParameter('statusId', i) as string;
			const additionalFields = this.getNodeParameter('additionalFields', i) as object;

			// Make API call to create the corrugated format
			const response = await this.helpers.requestWithAuthentication.call(this, 'hipeApi', {
				method: 'PATCH',
				url: `${baseUrl}/api/statuses/${statusId}`,
				body: additionalFields,
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
