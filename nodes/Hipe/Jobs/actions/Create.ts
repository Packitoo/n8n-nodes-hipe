import { IExecuteFunctions, sleep } from 'n8n-workflow';
import { INodeExecutionData, INodeProperties } from 'n8n-workflow';
import { IJob } from '../../interfaces';
import { RESOURCES, OPERATIONS } from '../../constants';

export const properties: INodeProperties[] = [
	{
		displayName: 'Type',
		name: 'type',
		type: 'options',
		required: true,
		default: 'n8n_workflow',
		description: 'Type of job',
		displayOptions: {
			show: {
				resource: [RESOURCES.JOB],
				operation: [OPERATIONS.CREATE],
			},
		},
		options: [
			{ name: 'CAD Layout', value: 'cad_layout' },
			{ name: 'CAD One Up', value: 'cad_one_up' },
			{ name: 'CAD Sync', value: 'cad_sync' },
			{ name: 'Export', value: 'export' },
			{ name: 'Import', value: 'import' },
			{ name: 'N8N Workflow', value: 'n8n_workflow' },
			{ name: 'Quote PDF', value: 'quote_pdf' },
			{ name: 'Report', value: 'report' },
			{ name: 'Webhook', value: 'webhook' },
		],
	},
	{
		displayName: 'Sub Type',
		name: 'subType',
		type: 'string',
		required: true,
		default: '={{ $workflow.name }}',
		description: 'Sub type of job (e.g. workflow name)',
		displayOptions: {
			show: {
				resource: [RESOURCES.JOB],
				operation: [OPERATIONS.CREATE],
			},
		},
	},
	{
		displayName: 'External ID',
		name: 'externalId',
		type: 'string',
		default: '={{ $execution.id }}',
		description: 'Optional. External reference ID (e.g. n8n execution ID). Defaults to the current execution ID.',
		displayOptions: {
			show: {
				resource: [RESOURCES.JOB],
				operation: [OPERATIONS.CREATE],
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
				resource: [RESOURCES.JOB],
				operation: [OPERATIONS.CREATE],
			},
		},
		options: [
			{
				displayName: 'Status',
				name: 'status',
				type: 'options',
				default: 1,
				description: 'Optional. Initial job status. Defaults to Requested. Use final statuses (Succeeded, Failed, Canceled) to log a completed job.',
				options: [
					{ name: 'Requested', value: 1 },
					{ name: 'In Progress', value: 2 },
					{ name: 'Succeeded', value: 3 },
					{ name: 'Failed', value: 4 },
					{ name: 'Canceled', value: 5 },
				],
			},
			{
				displayName: 'Entity Type',
				name: 'entityType',
				type: 'string',
				default: '',
				description: 'Type of entity this job relates to (e.g. company, project)',
			},
			{
				displayName: 'Entity ID',
				name: 'entityId',
				type: 'string',
				default: '',
				description: 'ID of the entity this job relates to',
			},
			{
				displayName: 'Metadata',
				name: 'metadata',
				type: 'json',
				default: '{}',
				description: 'Additional metadata as JSON',
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
			const type = this.getNodeParameter('type', i) as string;
			const subType = this.getNodeParameter('subType', i) as string;
			const externalId = this.getNodeParameter('externalId', i, '') as string;
			const additionalFields = this.getNodeParameter('additionalFields', i, {}) as Record<string, any>;

			const body: IJob = {
				type,
				subType,
				...(externalId ? { externalId } : {}),
			};

			if (additionalFields.status) body.status = additionalFields.status;
			if (additionalFields.entityType) body.entityType = additionalFields.entityType;
			if (additionalFields.entityId) body.entityId = additionalFields.entityId;
			if (additionalFields.metadata) {
				body.metadata = typeof additionalFields.metadata === 'string'
					? JSON.parse(additionalFields.metadata)
					: additionalFields.metadata;
			}

			const response = await this.helpers.requestWithAuthentication.call(this, 'hipeApi', {
				method: 'POST',
				url: `${baseUrl}/api/jobs`,
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
