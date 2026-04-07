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
		description: 'ID of the job to append logs to',
		displayOptions: {
			show: {
				resource: [RESOURCES.JOB],
				operation: [OPERATIONS.APPEND_LOGS],
			},
		},
	},
	{
		displayName: 'Completeness (%)',
		name: 'completeness',
		type: 'number',
		default: -1,
		typeOptions: {
			minValue: -1,
			maxValue: 100,
		},
		description: 'Optional. Progress percentage (0-100). Leave at -1 to skip updating progress.',
		displayOptions: {
			show: {
				resource: [RESOURCES.JOB],
				operation: [OPERATIONS.APPEND_LOGS],
			},
		},
	},
	{
		displayName: 'Log Entries',
		name: 'entries',
		type: 'fixedCollection',
		placeholder: 'Add Log Entry',
		default: {},
		typeOptions: {
			multipleValues: true,
		},
		displayOptions: {
			show: {
				resource: [RESOURCES.JOB],
				operation: [OPERATIONS.APPEND_LOGS],
			},
		},
		options: [
			{
				name: 'entryFields',
				displayName: 'Log Entry',
				values: [
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
			const completeness = this.getNodeParameter('completeness', i, -1) as number;
			const entriesGroup = this.getNodeParameter('entries', i, {}) as {
				entryFields?: Array<{
					level: string;
					message: string;
					context?: string | Record<string, any>;
				}>;
			};

			const entries = (entriesGroup.entryFields || []).map((entry) => {
				const logEntry: Record<string, any> = {
					level: entry.level,
					message: entry.message,
				};
				if (entry.context) {
					logEntry.context = typeof entry.context === 'string'
						? JSON.parse(entry.context)
						: entry.context;
				}
				return logEntry;
			});

			if (entries.length === 0 && completeness < 0) {
				throw new Error('At least one log entry or a completeness value is required');
			}

			const body: Record<string, any> = { entries };
			if (completeness >= 0) {
				body.completeness = completeness;
			}

			const response = await this.helpers.requestWithAuthentication.call(this, 'hipeApi', {
				method: 'POST',
				url: `${baseUrl}/api/jobs/${id}/logs`,
				body,
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
		await sleep(500);
	}
	return returnData;
}
