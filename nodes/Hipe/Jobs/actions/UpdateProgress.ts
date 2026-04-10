import { IExecuteFunctions, sleep } from 'n8n-workflow';
import { INodeExecutionData, INodeProperties } from 'n8n-workflow';
import { RESOURCES, OPERATIONS } from '../../constants';

export const properties: INodeProperties[] = [
	{
		displayName: 'Job ID',
		name: 'id',
		type: 'string',
		required: true,
		default: '',
		description: 'ID of the job to update',
		displayOptions: {
			show: {
				resource: [RESOURCES.JOB],
				operation: [OPERATIONS.UPDATE_PROGRESS],
			},
		},
	},
	{
		displayName: 'Completeness (%)',
		name: 'completeness',
		type: 'number',
		required: true,
		default: 0,
		typeOptions: {
			minValue: 0,
			maxValue: 100,
		},
		description: 'Progress percentage (0-100)',
		displayOptions: {
			show: {
				resource: [RESOURCES.JOB],
				operation: [OPERATIONS.UPDATE_PROGRESS],
			},
		},
	},
	{
		displayName: 'Log Entry',
		name: 'log',
		type: 'collection',
		placeholder: 'Add Log Entry',
		default: {},
		description: 'Optional. Log entry to append along with the progress update.',
		displayOptions: {
			show: {
				resource: [RESOURCES.JOB],
				operation: [OPERATIONS.UPDATE_PROGRESS],
			},
		},
		options: [
			{
				displayName: 'Level',
				name: 'level',
				type: 'options',
				options: [
					{ name: 'Error', value: 'error' },
					{ name: 'Info', value: 'info' },
					{ name: 'Warn', value: 'warn' },
				],
				default: 'info',
			},
			{
				displayName: 'Message',
				name: 'message',
				type: 'string',
				default: '',
				description: 'Log message text',
			},
			{
				displayName: 'Context',
				name: 'context',
				type: 'json',
				default: '{}',
				description: 'Optional structured context data as JSON',
			},
		],
	},
];

export async function execute(
	this: IExecuteFunctions,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];

	const credentials = await this.getCredentials('hipeApi');
	let baseUrl = credentials.url;
	if (typeof baseUrl !== 'string') {
		throw new Error('HIPE base URL is not a string');
	}
	baseUrl = baseUrl.replace(/\/$/, '');

	for (let i = 0; i < items.length; i++) {
		try {
			const id = this.getNodeParameter('id', i) as string;
			const completeness = this.getNodeParameter('completeness', i) as number;
			const logEntry = this.getNodeParameter('log', i, {}) as {
				level?: string;
				message?: string;
				context?: string | Record<string, any>;
			};

			const body: Record<string, any> = { completeness };

			if (logEntry.level && logEntry.message) {
				const log: Record<string, any> = {
					level: logEntry.level,
					message: logEntry.message,
				};
				if (logEntry.context) {
					log.context = typeof logEntry.context === 'string'
						? JSON.parse(logEntry.context)
						: logEntry.context;
				}
				body.log = log;
			}

			const response = await this.helpers.requestWithAuthentication.call(this, 'hipeApi', {
				method: 'PATCH',
				url: `${baseUrl}/api/jobs/${id}/progress`,
				body,
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
