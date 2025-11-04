import { IExecuteFunctions, sleep } from 'n8n-workflow';
import { INodeExecutionData, INodeProperties } from 'n8n-workflow';
import { listWithPaginationFlat } from '../../Corrugated/shared/pagination';

// Properties for the List operation
export const properties: INodeProperties[] = [
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		description: 'Whether to return all results or only up to a given limit',
		displayOptions: {
			show: {
				resource: ['export'],
				operation: ['getMany'],
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
				resource: ['export'],
				operation: ['getMany'],
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
				resource: ['export'],
				operation: ['getMany'],
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
		description:
			'Flat filter keys per OpenAPI (e.g. search, status, type, filterId, date windows). "Search" maps to "s" query parameter.',
		displayOptions: {
			show: {
				resource: ['export'],
				operation: ['getMany'],
			},
		},
		options: [
			{ displayName: 'End', name: 'end', type: 'string', default: '' },
			{ displayName: 'Filter ID', name: 'filterId', type: 'string', default: '' },
			{ displayName: 'Search', name: 'search', type: 'string', default: '' },
			{ displayName: 'Start', name: 'start', type: 'string', default: '' },
			{ displayName: 'Status', name: 'status', type: 'string', default: '' },
			{ displayName: 'Type', name: 'type', type: 'string', default: '' },
		],
	},
	{
		displayName: 'Sort',
		name: 'sort',
		type: 'collection',
		placeholder: 'Add Sort Option',
		displayOptions: {
			show: {
				resource: ['export'],
				operation: ['getMany'],
			},
		},
		default: {},
		description:
			'Sort is converted to a single "sort" query parameter in the format "field,ASC|DESC"',
		options: [
			{
				displayName: 'Sort By',
				name: 'sortBy',
				type: 'options',
				options: [
					{ name: 'Created At', value: 'createdAt' },
					{ name: 'Updated At', value: 'updatedAt' },
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

// Execute function for the List operation
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
			const rawFilters = this.getNodeParameter('filters', i, {}) as Record<string, any>;
			const sort = this.getNodeParameter('sort', i, {}) as {
				sortBy?: string;
				sortOrder?: 'asc' | 'desc';
			};

			// Map UI "search" to API "s"
			const filters = { ...rawFilters } as Record<string, any>;
			if (filters.search) {
				filters.s = filters.search;
				delete filters.search;
			}

			const response = await listWithPaginationFlat(this, '/api/exports', {
				returnAll,
				limit,
				page: uiPage,
				filters,
				sort,
			});
			returnData.push({ json: response });
		} catch (error) {
			if (this.continueOnFail()) {
				returnData.push({ json: { error: (error as Error).message } });
				continue;
			}
			throw error;
		}
		sleep(500);
	}
	return returnData;
}
