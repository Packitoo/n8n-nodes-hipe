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
				resource: ['order'],
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
				resource: ['order'],
				operation: ['getMany'],
				returnAll: [false],
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
				resource: ['order'],
				operation: ['getMany'],
				returnAll: [false],
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
		description: 'Filter options for orders',
		displayOptions: {
			show: {
				resource: ['order'],
				operation: ['getMany'],
			},
		},
		options: [
			{ displayName: 'Company ID', name: 'companyId', type: 'string', default: '' },
			{ displayName: 'Created By', name: 'createdBy', type: 'string', default: '' },
			{ displayName: 'External ID', name: 'externalId', type: 'string', default: '' },
			{ displayName: 'Project ID', name: 'projectId', type: 'string', default: '' },
			{ displayName: 'Search', name: 'search', type: 'string', default: '' },
			{ displayName: 'Status ID', name: 'statusId', type: 'string', default: '' },
		],
	},
	{
		displayName: 'Sort',
		name: 'sort',
		type: 'collection',
		placeholder: 'Add Sort Option',
		default: {},
		description:
			'Sort is converted to a single "sort" query parameter in the format "field,ASC|DESC"',
		displayOptions: {
			show: {
				resource: ['order'],
				operation: ['getMany'],
			},
		},
		options: [
			{
				displayName: 'Sort By',
				name: 'sortBy',
				type: 'options',
				options: [
					{ name: 'Billed Amount', value: 'billedAmount' },
					{ name: 'Created At', value: 'createdAt' },
					{ name: 'Expected Delivery Date', value: 'expectedDeliveryDate' },
					{ name: 'Order Date', value: 'orderDate' },
					{ name: 'Updated At', value: 'updatedAt' },
				],
				default: 'createdAt',
			},
			{
				displayName: 'Sort Order',
				name: 'sortOrder',
				type: 'options',
				options: [
					{
						name: 'Ascending',
						value: 'asc',
					},
					{
						name: 'Descending',
						value: 'desc',
					},
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
			const filters = this.getNodeParameter('filters', i, {}) as object;
			const sort = this.getNodeParameter('sort', i, {}) as {
				sortBy?: string;
				sortOrder?: 'asc' | 'desc';
			};

			const response = await listWithPaginationFlat(this, '/api/orders', {
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
		sleep(500);
	}
	return returnData;
}
