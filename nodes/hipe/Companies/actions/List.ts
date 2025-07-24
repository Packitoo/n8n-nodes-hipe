import { IExecuteFunctions } from 'n8n-workflow';
import { INodeExecutionData, INodeProperties } from 'n8n-workflow';

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
	// {
	// 	displayName: 'Filters',
	// 	name: 'filters',
	// 	type: 'collection',
	// 	placeholder: 'Add Filter',
	// 	default: {},
	// 	displayOptions: {
	// 		show: {
	// 			resource: ['company'],
	// 			operation: ['getMany'],
	// 		},
	// 	},
	// 	options: [
	// 		{
	// 			displayName: 'Company',
	// 			name: 'company',
	// 			type: 'string',
	// 			default: '',
	// 			description: 'Company ID',
	// 		},
	// 		{
	// 			displayName: 'Product',
	// 			name: 'product',
	// 			type: 'string',
	// 			default: '',
	// 			description: 'Product ID',
	// 		},
	// 		{
	// 			displayName: 'Task Type',
	// 			name: 'taskType',
	// 			type: 'string',
	// 			default: '',
	// 			description: 'TaskType ID (or list of IDs)',
	// 		},
	// 		{
	// 			displayName: 'Search',
	// 			name: 'search',
	// 			type: 'string',
	// 			default: '',
	// 			description: 'Text to search within the main text properties of the entity',
	// 		},
	// 		{
	// 			displayName: 'Comment',
	// 			name: 'comment',
	// 			type: 'string',
	// 			default: '',
	// 			description: 'Comment ID',
	// 		},
	// 		{
	// 			displayName: 'Cursor',
	// 			name: 'cursor',
	// 			type: 'string',
	// 			default: '',
	// 			description:
	// 				"Cursor value used for pagination. This value represents the maximum 'createdAt' timestamp in Unix time format.",
	// 		},
	// 		{
	// 			displayName: 'Version',
	// 			name: 'version',
	// 			type: 'string',
	// 			default: '',
	// 			description: 'Version of semi-supervised events to fetch',
	// 		},
	// 		{
	// 			displayName: 'Process',
	// 			name: 'process',
	// 			type: 'string',
	// 			default: '',
	// 			description: 'Process of semi-supervised events to fetch',
	// 		},
	// 		{
	// 			displayName: 'Role',
	// 			name: 'role',
	// 			type: 'string',
	// 			default: '',
	// 			description: 'Role name',
	// 		},
	// 		{
	// 			displayName: 'Contact',
	// 			name: 'contact',
	// 			type: 'string',
	// 			default: '',
	// 			description:
	// 				"Id of the contact to search for. This is used to filter projects by the contact's ID.",
	// 		},
	// 		{
	// 			displayName: 'Last Update',
	// 			name: 'lastupdate',
	// 			type: 'string',
	// 			default: '',
	// 			description: 'Timestamp Unix en millisecondes',
	// 		},
	// 		{
	// 			displayName: 'Tab',
	// 			name: 'tab',
	// 			type: 'string',
	// 			default: '',
	// 			description: '',
	// 		},
	// 		{
	// 			displayName: 'Event',
	// 			name: 'event',
	// 			type: 'string',
	// 			default: '',
	// 			description: '',
	// 		},
	// 		{
	// 			displayName: 'Price',
	// 			name: 'price',
	// 			type: 'string',
	// 			default: '',
	// 			description: '',
	// 		},
	// 		{
	// 			displayName: 'Hierarchy',
	// 			name: 'hierarchy',
	// 			type: 'string',
	// 			default: '',
	// 			description: '',
	// 		},
	// 		{
	// 			displayName: 'Filter ID',
	// 			name: 'filterId',
	// 			type: 'string',
	// 			default: '',
	// 			description: 'Id of the filter to apply (see CrmFilters)',
	// 		},
	// 		{
	// 			displayName: 'Date',
	// 			name: 'date',
	// 			type: 'options',
	// 			options: [
	// 				{ name: 'Overdue', value: 'Overdue' },
	// 				{ name: 'Upcoming', value: 'Upcoming' },
	// 				{ name: 'Today', value: 'Today' },
	// 				{ name: 'Specific', value: 'Specific' },
	// 			],
	// 			default: '',
	// 			description: 'Time frame to search on for the project due date.',
	// 		},
	// 		{
	// 			displayName: 'Created At',
	// 			name: 'createdAt',
	// 			type: 'options',
	// 			options: [
	// 				{ name: 'Overdue', value: 'Overdue' },
	// 				{ name: 'Upcoming', value: 'Upcoming' },
	// 				{ name: 'Today', value: 'Today' },
	// 				{ name: 'Specific', value: 'Specific' },
	// 			],
	// 			default: '',
	// 			description: 'Time frame to search based on createdAt.',
	// 		},
	// 		{
	// 			displayName: 'Updated At',
	// 			name: 'updatedAt',
	// 			type: 'options',
	// 			options: [
	// 				{ name: 'Overdue', value: 'Overdue' },
	// 				{ name: 'Upcoming', value: 'Upcoming' },
	// 				{ name: 'Today', value: 'Today' },
	// 				{ name: 'Specific', value: 'Specific' },
	// 			],
	// 			default: '',
	// 			description: 'Time frame to search based on updatedAt.',
	// 		},
	// 		{
	// 			displayName: 'Start',
	// 			name: 'start',
	// 			type: 'string',
	// 			default: '',
	// 			description: 'Timestamp Unix en millisecondes',
	// 		},
	// 		{
	// 			displayName: 'End',
	// 			name: 'end',
	// 			type: 'string',
	// 			default: '',
	// 			description: 'Timestamp Unix en millisecondes',
	// 		},
	// 		{
	// 			displayName: 'Update Start',
	// 			name: 'updateStart',
	// 			type: 'string',
	// 			default: '',
	// 			description: 'Timestamp Unix en millisecondes',
	// 		},
	// 		{
	// 			displayName: 'Update End',
	// 			name: 'updateEnd',
	// 			type: 'string',
	// 			default: '',
	// 			description: 'Timestamp Unix en millisecondes',
	// 		},
	// 		{
	// 			displayName: 'Pipeline',
	// 			name: 'pipeline',
	// 			type: 'string',
	// 			default: '',
	// 			description: 'Pipeline ID (or list of IDs)',
	// 		},
	// 		{
	// 			displayName: 'Category',
	// 			name: 'category',
	// 			type: 'string',
	// 			default: '',
	// 			description: 'Category name of the notification, the event category',
	// 		},
	// 		{
	// 			displayName: 'Step',
	// 			name: 'step',
	// 			type: 'string',
	// 			default: '',
	// 			description: 'Step ID (or list of IDs)',
	// 		},
	// 		{
	// 			displayName: 'Manager',
	// 			name: 'manager',
	// 			type: 'string',
	// 			default: '',
	// 			description: 'User ID of the manager (or list of IDs)',
	// 		},
	// 		{
	// 			displayName: 'Created By',
	// 			name: 'createdBy',
	// 			type: 'string',
	// 			default: '',
	// 			description: 'User ID of the creator (or list of IDs)',
	// 		},
	// 		{
	// 			displayName: 'User',
	// 			name: 'user',
	// 			type: 'string',
	// 			default: '',
	// 			description: 'User ID of the user assigned (or list of IDs)',
	// 		},
	// 		{
	// 			displayName: 'Page',
	// 			name: 'page',
	// 			type: 'number',
	// 			default: 1,
	// 			description: 'Page number to return',
	// 		},
	// 		{
	// 			displayName: 'Limit',
	// 			name: 'limit',
	// 			type: 'number',
	// 			default: 25,
	// 			typeOptions: { minValue: 1, maxValue: 100 },
	// 			description: 'Number of items to return per page',
	// 		},
	// 	],
	// },
	// {
	// 	displayName: 'Sort',
	// 	name: 'sort',
	// 	type: 'collection',
	// 	placeholder: 'Add Sort Option',
	// 	displayOptions: {
	// 		show: {
	// 			resource: ['company'],
	// 			operation: ['getMany'],
	// 		},
	// 	},
	// 	default: {},
	// 	options: [
	// 		{
	// 			displayName: 'Sort By',
	// 			name: 'sortBy',
	// 			type: 'options',
	// 			options: [
	// 				{
	// 					name: 'Name',
	// 					value: 'name',
	// 				},
	// 				{
	// 					name: 'Created At',
	// 					value: 'createdAt',
	// 				},
	// 				{
	// 					name: 'Updated At',
	// 					value: 'updatedAt',
	// 				},
	// 				{
	// 					name: 'Status',
	// 					value: 'status',
	// 				},
	// 				// Add any additional sort options
	// 			],
	// 			default: 'createdAt',
	// 		},
	// 		{
	// 			displayName: 'Sort Order',
	// 			name: 'sortOrder',
	// 			type: 'options',
	// 			options: [
	// 				{
	// 					name: 'Ascending',
	// 					value: 'asc',
	// 				},
	// 				{
	// 					name: 'Descending',
	// 					value: 'desc',
	// 				},
	// 			],
	// 			default: 'desc',
	// 		},
	// 	],
	// },
];

// Execute function for the List operation
export async function execute(
	this: IExecuteFunctions,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	// This is just a scaffold, implementation will be added later
	const returnData: INodeExecutionData[] = [];
	const credentials = await this.getCredentials('hipeApi');
	let baseUrl = credentials.url;
	if (typeof baseUrl !== 'string') {
		throw new Error('HIPE base URL is not a string');
	}
	baseUrl = baseUrl.replace(/\/$/, '');

	for (let i = 0; i < items.length; i++) {
		try {
			const returnAll = this.getNodeParameter('returnAll', i) as boolean;
			const limit = returnAll ? undefined : (this.getNodeParameter('limit', i, 50) as number);
			const filters = this.getNodeParameter('filters', i, {}) as object;
			const sort = this.getNodeParameter('sort', i, {}) as {
				sortBy?: string;
				sortOrder?: 'asc' | 'desc';
			};

			// Build query params
			const qs: any = { ...filters };
			if (!returnAll && limit) qs.limit = limit;
			if (sort.sortBy) {
				qs.orderBy = sort.sortBy;
				qs.order = sort.sortOrder || 'asc';
			}

			const response = await this.helpers.requestWithAuthentication.call(this, 'hipeApi', {
				method: 'GET',
				url: `${baseUrl}/api/companies`,
				qs,
				json: true,
			});

			// Assume response is either array or paginated { data, pagination }
			if (Array.isArray(response)) {
				returnData.push({ json: { data: response } });
			} else if (response.data) {
				returnData.push({ json: response });
			} else {
				returnData.push({ json: { data: response } });
			}
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
