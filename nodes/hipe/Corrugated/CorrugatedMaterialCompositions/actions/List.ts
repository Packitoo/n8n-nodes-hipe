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
        resource: ['corrugatedMaterialComposition'],
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
        resource: ['corrugatedMaterialComposition'],
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
        resource: ['corrugatedMaterialComposition'],
        operation: ['getMany'],
      },
    },
    options: [
      {
        displayName: 'Corrugated Material ID',
        name: 'corrugatedMaterial',
        type: 'string',
        default: '',
        description: 'Filter by corrugated material ID',
      },
      {
        displayName: 'Flute ID',
        name: 'flute',
        type: 'string',
        default: '',
        description: 'Filter by flute ID',
      },
      // Add any additional filters for listing corrugated material compositions
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
        resource: ['corrugatedMaterialComposition'],
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
            name: 'Created At',
            value: 'createdAt',
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
  const credentials = await this.getCredentials('hipe');
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

      const response = await this.helpers.requestWithAuthentication.call(this, 'hipe', {
        method: 'GET',
        url: `${baseUrl}/api/corrugated-material-compositions`,
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
