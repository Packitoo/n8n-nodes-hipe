import { IExecuteFunctions, sleep } from 'n8n-workflow';
import { INodeExecutionData, INodeProperties } from 'n8n-workflow';
import { listWithPaginationFlat } from '../../Corrugated/shared/pagination';
import { RESOURCES, OPERATIONS } from '../../constants';

export const properties: INodeProperties[] = [
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		description: 'Whether to return all results or only up to a given limit',
		displayOptions: {
			show: {
				resource: [RESOURCES.JOB],
				operation: [OPERATIONS.GET_MANY],
			},
		},
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		displayOptions: {
			show: {
				returnAll: [false],
				resource: [RESOURCES.JOB],
				operation: [OPERATIONS.GET_MANY],
			},
		},
		typeOptions: {
			minValue: 1,
		},
		default: 50,
		description: 'Max number of results to return',
	},
	{
		displayName: 'Page',
		name: 'page',
		type: 'number',
		displayOptions: {
			show: {
				returnAll: [false],
				resource: [RESOURCES.JOB],
				operation: [OPERATIONS.GET_MANY],
			},
		},
		typeOptions: {
			minValue: 1,
		},
		default: 1,
		description: 'Page number to fetch (starts at 1)',
	},
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: {
			show: {
				resource: [RESOURCES.JOB],
				operation: [OPERATIONS.GET_MANY],
			},
		},
		options: [
			{ displayName: 'Entity Type', name: 'entityType', type: 'string', default: '' },
			{ displayName: 'External ID', name: 'externalId', type: 'string', default: '' },
			{
				displayName: 'Status',
				name: 'status',
				type: 'options',
				options: [
					{ name: 'Canceled', value: '5' },
					{ name: 'Failed', value: '4' },
					{ name: 'In Progress', value: '2' },
					{ name: 'Requested', value: '1' },
					{ name: 'Succeeded', value: '3' },
					{ name: 'Unknown', value: '0' },
				],
				default: '1',
			},
			{ displayName: 'Sub Type', name: 'subType', type: 'string', default: '' },
			{
				displayName: 'Type',
				name: 'type',
				type: 'options',
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
				default: 'n8n_workflow',
			},
		],
	},
	{
		displayName: 'Sort',
		name: 'sort',
		type: 'collection',
		placeholder: 'Add Sort Option',
		displayOptions: {
			show: {
				resource: [RESOURCES.JOB],
				operation: [OPERATIONS.GET_MANY],
			},
		},
		default: {},
		options: [
			{
				displayName: 'Sort By',
				name: 'sortBy',
				type: 'options',
				options: [
					{ name: 'Created At', value: 'createdAt' },
					{ name: 'Updated At', value: 'updatedAt' },
					{ name: 'Status', value: 'status' },
					{ name: 'Completeness', value: 'completeness' },
				],
				default: 'createdAt',
			},
			{
				displayName: 'Sort Order',
				name: 'sortOrder',
				type: 'options',
				options: [
					{ name: 'Ascending', value: 'asc' },
					{ name: 'Descending', value: 'desc' },
				],
				default: 'desc',
			},
		],
	},
];

export async function execute(
	this: IExecuteFunctions,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];

	for (let i = 0; i < items.length; i++) {
		try {
			const returnAll = this.getNodeParameter('returnAll', i) as boolean;
			const limit = returnAll ? undefined : (this.getNodeParameter('limit', i, 50) as number);
			const uiPageRaw = this.getNodeParameter('page', i, 1) as number;
			const uiPage =
				typeof uiPageRaw === 'number' && Number.isFinite(uiPageRaw) && uiPageRaw > 0
					? uiPageRaw
					: 1;
			const filters = this.getNodeParameter('filters', i, {}) as object;
			const sort = this.getNodeParameter('sort', i, {}) as {
				sortBy?: string;
				sortOrder?: 'asc' | 'desc';
			};

			const response = await listWithPaginationFlat(this, '/api/jobs', {
				returnAll,
				limit,
				page: uiPage,
				filters: filters as Record<string, any>,
				sort: sort as { sortBy?: string; sortOrder?: 'asc' | 'desc' },
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
