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
        displayName: 'Name',
        name: 'name',
        type: 'string',
        default: '',
        description: 'Filter by name',
      },
      {
        displayName: 'Client ID',
        name: 'clientId',
        type: 'string',
        default: '',
        description: 'Filter by client ID',
      },
      {
        displayName: 'Role',
        name: 'role',
        type: 'multiOptions',
        options: [
          {
            name: 'Super Admin',
            value: 'superadmin',
          },
          {
            name: 'Admin',
            value: 'admin',
          },
          {
            name: 'Sales',
            value: 'sales',
          },
          {
            name: 'External Sales',
            value: 'external_sales',
          },
          {
            name: 'Contact',
            value: 'contact',
          },
          {
            name: 'Guest',
            value: 'guest',
          }
        ],
        default: [],
        description: 'Filter by role',
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
      const limit = returnAll ? undefined : this.getNodeParameter('limit', i, 50) as number;
      const filters = this.getNodeParameter('filters', i, {}) as object;
      const sort = this.getNodeParameter('sort', i, {}) as { sortBy?: string; sortOrder?: 'asc' | 'desc' };

      // Build query params
      const qs: any = { ...filters };
      if (!returnAll && limit) qs.limit = limit;
      if (sort.sortBy) {
        qs.orderBy = sort.sortBy;
        qs.order = sort.sortOrder || 'asc';
      }

      const response = await this.helpers.requestWithAuthentication.call(this, 'hipeApi', {
        method: 'GET',
        url: `${baseUrl}/api/users`,
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
