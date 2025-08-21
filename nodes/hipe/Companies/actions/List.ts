import { IExecuteFunctions } from 'n8n-workflow';
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
				resource: ['company'],
				operation: ['getMany'],
			},
		},
	},
	// {
	// 	displayName: 'Limit',
	// 	name: 'limit',
	// 	type: 'number',
	// 	displayOptions: {
	// 		show: {
	// 			returnAll: [false],
	// 			resource: ['company'],
	// 			operation: ['getMany'],
	// 		},
	// 	},
	// 	typeOptions: {
	// 		minValue: 1,
	// 	},
	// 	default: 50,
	// 	description: 'Max number of results to return',
	// },
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		displayOptions: {
			show: {
				returnAll: [false],
				resource: ['company'],
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
				resource: ['company'],
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
		description: 'Flat filter keys per OpenAPI (e.g. status, type, company, product, taskType, search, comment, cursor, version, process, role, contact, lastupdate, tab, event, price, hierarchy, filterId, date/createdAt/updatedAt windows, start/end, updateStart/updateEnd, pipeline, category, step, manager, createdBy, user)',
		displayOptions: {
			show: {
				resource: ['company'],
				operation: ['getMany'],
			},
		},
		options: [
			{ displayName: 'Category', name: 'category', type: 'string', default: '' },
			{ displayName: 'Comment', name: 'comment', type: 'string', default: '' },
			{ displayName: 'Company', name: 'company', type: 'string', default: '' },
			{ displayName: 'Contact', name: 'contact', type: 'string', default: '' },
			{
				displayName: 'Created At',
				name: 'createdAt',
				type: 'options',
				options: [
					{ name: 'Overdue', value: 'Overdue' },
					{ name: 'Upcoming', value: 'Upcoming' },
					{ name: 'Today', value: 'Today' },
					{ name: 'Specific', value: 'Specific' },
				],
				default: 'Today',
			},
			{ displayName: 'Created By', name: 'createdBy', type: 'string', default: '' },
			{ displayName: 'Cursor', name: 'cursor', type: 'string', default: '' },
			{
				displayName: 'Date',
				name: 'date',
				type: 'options',
				options: [
					{ name: 'Overdue', value: 'Overdue' },
					{ name: 'Upcoming', value: 'Upcoming' },
					{ name: 'Today', value: 'Today' },
					{ name: 'Specific', value: 'Specific' },
				],
				default: 'Today',
			},
			{ displayName: 'End', name: 'end', type: 'string', default: '' },
			{ displayName: 'Event', name: 'event', type: 'string', default: '' },
			{ displayName: 'Filter ID', name: 'filterId', type: 'string', default: '' },
			{ displayName: 'Hierarchy', name: 'hierarchy', type: 'string', default: '' },
			{ displayName: 'Last Update', name: 'lastupdate', type: 'string', default: '' },
			{ displayName: 'Manager', name: 'manager', type: 'string', default: '' },
			{ displayName: 'Pipeline', name: 'pipeline', type: 'string', default: '' },
			{ displayName: 'Price', name: 'price', type: 'string', default: '' },
			{ displayName: 'Process', name: 'process', type: 'string', default: '' },
			{ displayName: 'Product', name: 'product', type: 'string', default: '' },
			{ displayName: 'Role', name: 'role', type: 'string', default: '' },
			{ displayName: 'Search', name: 'search', type: 'string', default: '' },
			{ displayName: 'Start', name: 'start', type: 'string', default: '' },
			{ displayName: 'Status', name: 'status', type: 'string', default: '' },
			{ displayName: 'Step', name: 'step', type: 'string', default: '' },
			{ displayName: 'Tab', name: 'tab', type: 'string', default: '' },
			{ displayName: 'Task Type', name: 'taskType', type: 'string', default: '' },
			{
				displayName: 'Type',
				name: 'type',
				type: 'options',
				options: [
					{ name: 'CALL', value: 'CALL' },
					{ name: 'COMPANY_CONTACT', value: 'COMPANY_CONTACT' },
					{ name: 'COMPANY_CREATION', value: 'COMPANY_CREATION' },
					{ name: 'COMPANY_ERP', value: 'COMPANY_ERP' },
					{ name: 'COMPANY_MANAGER', value: 'COMPANY_MANAGER' },
					{ name: 'COMPANY_NAME', value: 'COMPANY_NAME' },
					{ name: 'COMPANY_NOTES', value: 'COMPANY_NOTES' },
					{ name: 'COMPANY_PROJECTS', value: 'COMPANY_PROJECTS' },
					{ name: 'COMPANY_TASKS', value: 'COMPANY_TASKS' },
					{ name: 'EMAIL', value: 'EMAIL' },
					{ name: 'MEETING', value: 'MEETING' },
					{ name: 'PROJECT_CREATION', value: 'PROJECT_CREATION' },
					{ name: 'PROJECT_DUE_DATE', value: 'PROJECT_DUE_DATE' },
					{ name: 'PROJECT_ERP', value: 'PROJECT_ERP' },
					{ name: 'PROJECT_MANAGER', value: 'PROJECT_MANAGER' },
					{ name: 'PROJECT_NAME', value: 'PROJECT_NAME' },
					{ name: 'PROJECT_NOTES', value: 'PROJECT_NOTES' },
					{ name: 'PROJECT_PIPELINE', value: 'PROJECT_PIPELINE' },
					{ name: 'PROJECT_STATUS', value: 'PROJECT_STATUS' },
					{ name: 'PROJECT_STEP', value: 'PROJECT_STEP' },
					{ name: 'TASK_CREATION', value: 'TASK_CREATION' },
					{ name: 'TASK_DUE_DATE', value: 'TASK_DUE_DATE' },
					{ name: 'TASK_NAME', value: 'TASK_NAME' },
					{ name: 'TASK_NOTES', value: 'TASK_NOTES' },
					{ name: 'TASK_STATUS', value: 'TASK_STATUS' },
					{ name: 'VISIO', value: 'VISIO' },
				],
				default: 'CALL',
			},
			{ displayName: 'Update End', name: 'updateEnd', type: 'string', default: '' },
			{ displayName: 'Update Start', name: 'updateStart', type: 'string', default: '' },
			{
				displayName: 'Updated At',
				name: 'updatedAt',
				type: 'options',
				options: [
					{ name: 'Overdue', value: 'Overdue' },
					{ name: 'Upcoming', value: 'Upcoming' },
					{ name: 'Today', value: 'Today' },
					{ name: 'Specific', value: 'Specific' },
				],
				default: 'Today',
			},
			{ displayName: 'User', name: 'user', type: 'string', default: '' },
			{ displayName: 'Version', name: 'version', type: 'string', default: '' },
		],
	},
	{
		displayName: 'Sort',
		name: 'sort',
		type: 'collection',
		placeholder: 'Add Sort Option',
		displayOptions: {
			show: {
				resource: ['company'],
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
					{ name: 'Name', value: 'name' },
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
			const filters = this.getNodeParameter('filters', i, {}) as object;
			const sort = this.getNodeParameter('sort', i, {}) as {
				sortBy?: string;
				sortOrder?: 'asc' | 'desc';
			};

			const response = await listWithPaginationFlat(this, '/api/companies/pagination', {
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
	}
	return returnData;
}
