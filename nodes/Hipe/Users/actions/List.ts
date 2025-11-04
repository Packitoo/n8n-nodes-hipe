import { IExecuteFunctions, sleep } from 'n8n-workflow';
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
				resource: ['user'],
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
				resource: ['user'],
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
				resource: ['user'],
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
		displayOptions: {
			show: {
				resource: ['user'],
				operation: ['getMany'],
			},
		},
		options: [
			{
				displayName: 'Client ID',
				name: 'clientId',
				type: 'string',
				default: '',
				description: 'Filter by client ID',
			},
			{
				displayName: 'Filter ID',
				name: 'filterId',
				type: 'string',
				default: '',
				description: 'ID of the saved filter to apply',
			},
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'Filter by name',
			},
			{
				displayName: 'Role',
				name: 'role',
				type: 'multiOptions',
				options: [
					{
						name: 'Admin',
						value: 'admin',
					},
					{
						name: 'Contact',
						value: 'contact',
					},
					{
						name: 'External Sales',
						value: 'external_sales',
					},
					{
						name: 'Guest',
						value: 'guest',
					},
					{
						name: 'Sales',
						value: 'sales',
					},
					{
						name: 'Super Admin',
						value: 'superadmin',
					},
				],
				default: [],
				description: 'Filter by role',
			},
			{
				displayName: 'Search',
				name: 's',
				type: 'string',
				default: '',
				description: 'Filter by search parameter',
			},
			// Add any additional filters for listing projects
		],
	},
	{
		displayName: 'Sort',
		name: 'sort',
		type: 'collection',
		placeholder: 'Add Sort Option',
		displayOptions: {
			show: {
				resource: ['user'],
				operation: ['getMany'],
			},
		},
		default: {},
		options: [
			{
				displayName: 'Sort By',
				name: 'sortBy',
				type: 'options',
				options: [
					{
						name: 'Name',
						value: 'name',
					},
					{
						name: 'Created At',
						value: 'createdAt',
					},
					{
						name: 'Updated At',
						value: 'updatedAt',
					},
					{
						name: 'Status',
						value: 'status',
					},
					// Add any additional sort options
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
	const credentials = await this.getCredentials('hipeApi');
	let baseUrl = credentials.url;
	if (typeof baseUrl !== 'string') {
		throw new Error('HIPE base URL is not a string');
	}
	baseUrl = baseUrl.replace(/\/$/, '');

	for (let i = 0; i < items.length; i++) {
		try {
			const returnAll = this.getNodeParameter('returnAll', i) as boolean;
			const uiLimit = this.getNodeParameter('limit', i, 50) as number;
			const uiPageRaw = this.getNodeParameter('page', i, 1) as number;
			const uiPage =
				typeof uiPageRaw === 'number' && Number.isFinite(uiPageRaw) && uiPageRaw > 0
					? uiPageRaw
					: 1;
			const rawFilters = this.getNodeParameter('filters', i, {}) as {
				name?: string;
				clientId?: string;
				s?: string;
				search?: string;
				role?: string[] | string;
				filterId?: string;
			};
			const sort = this.getNodeParameter('sort', i, {}) as {
				sortBy?: string;
				sortOrder?: 'asc' | 'desc';
			};

			// Build query params for Users pagination endpoint
			const buildQs = (page: number, limit: number) => {
				const qs: Record<string, any> = { page, limit };

				// Map search: prefer explicit 'search', fallback to 's' provided in UI
				const search = (rawFilters.search ?? rawFilters.s) as string | undefined;
				if (search) qs.search = search;

				// Map role: API accepts comma-separated string
				if (rawFilters.role && Array.isArray(rawFilters.role)) {
					if (rawFilters.role.length) qs.role = rawFilters.role.join(',');
				} else if (typeof rawFilters.role === 'string' && rawFilters.role) {
					qs.role = rawFilters.role;
				}

				// Optional saved filter
				if (rawFilters.filterId) qs.filterId = rawFilters.filterId;

				// Sorting: sort=field,ASC|DESC
				if (sort.sortBy) {
					const order = (sort.sortOrder || 'asc').toUpperCase();
					qs.sort = `${sort.sortBy},${order}`;
				}

				return qs;
			};

			if (returnAll) {
				const aggregated: any[] = [];
				let page = 1;
				const pageLimit = 100; // maximize throughput within API limits
				// eslint-disable-next-line no-constant-condition
				while (true) {
					const response = await this.helpers.requestWithAuthentication.call(this, 'hipeApi', {
						method: 'GET',
						url: `${baseUrl}/api/users/pagination`,
						qs: buildQs(page, pageLimit),
						json: true,
					});
					const batch = Array.isArray(response?.data) ? response.data : [];
					aggregated.push(...batch);
					if (batch.length < pageLimit) break;
					page += 1;
				}
				returnData.push({ json: { data: aggregated } });
			} else {
				const response = await this.helpers.requestWithAuthentication.call(this, 'hipeApi', {
					method: 'GET',
					url: `${baseUrl}/api/users/pagination`,
					qs: buildQs(uiPage, uiLimit),
					json: true,
				});
				returnData.push({ json: response });
			}
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
