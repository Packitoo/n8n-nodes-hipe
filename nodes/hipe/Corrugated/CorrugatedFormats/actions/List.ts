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
  const returnData: INodeExecutionData[] = [];

  // Get credentials
  const credentials = await this.getCredentials('hipe');
  let baseUrl = credentials.url;
  if (typeof baseUrl !== 'string') {
    throw new Error('HIPE base URL is not a string');
  }

  for (let i = 0; i < items.length; i++) {
    try {
      // Get input data
      const returnAll = this.getNodeParameter('returnAll', i) as boolean;
      const limit = returnAll ? undefined : this.getNodeParameter('limit', i, 50) as number;
      const filters = this.getNodeParameter('filters', i, {}) as Record<string, any>;
      const sort = this.getNodeParameter('sort', i, {}) as { sortBy?: string; sortOrder?: 'asc' | 'desc' };

      // Build query string
      const qs: Record<string, any> = {};
      if (limit !== undefined) qs.itemsPerPage = limit;
      if (filters) {
        for (const [key, value] of Object.entries(filters)) {
          if (value !== undefined && value !== '') {
            qs[`filters[${key}]`] = value;
          }
        }
      }
      if (sort && sort.sortBy) {
        qs[`order[${sort.sortBy}]`] = sort.sortOrder || 'asc';
      }

      // Make API call to list corrugated formats
      const response = await this.helpers.requestWithAuthentication.call(this, "hipe", {
        method: 'GET',
        url: `${baseUrl}/api/corrugated-formats`,
        qs,
        json: true,
      });

      returnData.push({ json: response });
    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({ json: { error: error.message } });
        continue;
      }
      throw error;
    }
  }

  return returnData;
}

