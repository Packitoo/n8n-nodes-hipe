import { IExecuteFunctions, sleep } from 'n8n-workflow';
import { INodeExecutionData, INodeProperties } from 'n8n-workflow';
import { listWithPagination } from '../../shared/pagination';

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
				resource: ['corrugatedFormat'],
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
				resource: ['corrugatedFormat'],
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
				resource: ['corrugatedFormat'],
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
		displayOptions: {
			show: {
				resource: ['corrugatedFormat'],
				operation: ['getMany'],
			},
		},
		options: [
			{
				displayName: 'Width',
				name: 'width',
				type: 'number',
				default: 0,
				description: 'Filter by width',
			},
			{
				displayName: 'Length',
				name: 'length',
				type: 'number',
				default: 0,
				description: 'Filter by length',
			},
			// Add any additional filters for listing corrugated formats
		],
	},
	{
		displayName: 'Sort',
		name: 'sort',
		type: 'collection',
		placeholder: 'Add Sort Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['corrugatedFormat'],
				operation: ['getMany'],
			},
		},
		options: [
			{
				displayName: 'Sort By',
				name: 'sortBy',
				type: 'options',
				options: [
					{
						name: 'Width',
						value: 'width',
					},
					{
						name: 'Length',
						value: 'length',
					},
					// Add any additional sort options
				],
				default: 'width',
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
				default: 'asc',
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
			// Get input data
			const returnAll = this.getNodeParameter('returnAll', i) as boolean;
			const limit = returnAll ? undefined : (this.getNodeParameter('limit', i, 50) as number);
			const uiPageRaw = this.getNodeParameter('page', i, 1) as number;
			const uiPage =
				typeof uiPageRaw === 'number' && Number.isFinite(uiPageRaw) && uiPageRaw > 0
					? uiPageRaw
					: 1;
			const filters = this.getNodeParameter('filters', i, {}) as Record<string, any>;
			const sort = this.getNodeParameter('sort', i, {}) as {
				sortBy?: string;
				sortOrder?: 'asc' | 'desc';
			};
			const result = await listWithPagination(this, '/api/corrugated-formats', {
				returnAll,
				limit,
				page: uiPage,
				filters,
				sort,
			});
			returnData.push({ json: result });
		} catch (error: any) {
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
