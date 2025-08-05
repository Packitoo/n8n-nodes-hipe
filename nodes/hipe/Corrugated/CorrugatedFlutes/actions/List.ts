import { IExecuteFunctions } from 'n8n-workflow';
import { INodeExecutionData, INodeProperties } from 'n8n-workflow';
import { IHIPEPaginationOptions } from '../../../interfaces';

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
				resource: ['corrugatedFlute'],
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
				resource: ['corrugatedFlute'],
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
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: {
			show: {
				resource: ['corrugatedFlute'],
				operation: ['getMany'],
			},
		},
		options: [
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'Filter by name',
			},
			// Add any additional filters for listing corrugated flutes
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
				resource: ['corrugatedFlute'],
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
						name: 'Name',
						value: 'name',
					},
					{
						name: 'Height',
						value: 'height',
					},
					// Add any additional sort options
				],
				default: 'name',
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
	// This is just a scaffold, implementation will be added later
	const returnData: INodeExecutionData[] = [];

	// Process each item
	for (let i = 0; i < items.length; i++) {
		try {
			// Get input data
			const returnAll = this.getNodeParameter('returnAll', i) as boolean;
			const limit = returnAll ? 0 : (this.getNodeParameter('limit', i, 50) as number);
			const filters = this.getNodeParameter('filters', i, {}) as object;
			const sort = this.getNodeParameter('sort', i, {}) as {
				sortBy?: string;
				sortOrder?: 'asc' | 'desc';
			};

			// Get credentials
			const credentials = await this.getCredentials('hipeApi');
			let baseUrl = credentials.url;
			if (typeof baseUrl !== 'string') {
				throw new Error('HIPE base URL is not a string');
			}
			baseUrl = baseUrl.replace(/\/$/, '');

			// Prepare pagination options
			const paginationOptions: IHIPEPaginationOptions = {
				page: 1,
				itemsPerPage: limit || 100,
				filters,
			};

			// Add sorting if specified
			if (sort.sortBy) {
				paginationOptions.order = {
					[sort.sortBy]: sort.sortOrder || 'asc',
				};
			}

			let hasNextPage = true;

			while (hasNextPage) {
				const response = await this.helpers.requestWithAuthentication.call(this, 'hipeApi', {
					method: 'GET',
					url: `${baseUrl}/api/corrugated-flutes`,
					qs: paginationOptions,
					json: true,
				});

				paginationOptions.page = (paginationOptions.page ?? 1) + 1;
				hasNextPage = response.pageCount >= paginationOptions.page;
				returnData.push({ json: response });
			}

			// In the actual implementation, this would make an API call to list corrugated flutes
			// For now, we just return placeholder data
			// returnData.push({
			//   json: {
			//     success: true,
			//     data: [
			//       {
			//         id: '1',
			//         name: 'A Flute',
			//         height: 4.8,
			//       },
			//       {
			//         id: '2',
			//         name: 'B Flute',
			//         height: 2.4,
			//       },
			//       {
			//         id: '3',
			//         name: 'C Flute',
			//         height: 3.6,
			//       },
			//     ],
			//     pagination: {
			//       total: 3,
			//       page: 1,
			//       itemsPerPage: limit || 100,
			//     },
			//   },
			// });
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
