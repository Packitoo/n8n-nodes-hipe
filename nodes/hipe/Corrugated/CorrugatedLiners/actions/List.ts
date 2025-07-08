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
  },
  {
    displayName: 'Limit',
    name: 'limit',
    type: 'number',
    displayOptions: {
      show: {
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
    options: [
      {
        displayName: 'Name',
        name: 'name',
        type: 'string',
        default: '',
        description: 'Filter by name',
      },
      {
        displayName: 'Weight',
        name: 'weight',
        type: 'number',
        default: 0,
        description: 'Filter by weight',
      },
      {
        displayName: 'Color',
        name: 'color',
        type: 'string',
        default: '',
        description: 'Filter by color',
      },
      {
        displayName: 'Type',
        name: 'type',
        type: 'string',
        default: '',
        description: 'Filter by type',
      },
      // Add any additional filters for listing corrugated liners
    ],
  },
  {
    displayName: 'Sort',
    name: 'sort',
    type: 'collection',
    placeholder: 'Add Sort Option',
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
            name: 'Weight',
            value: 'weight',
          },
          {
            name: 'Color',
            value: 'color',
          },
          {
            name: 'Type',
            value: 'type',
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
      const limit = returnAll ? 0 : this.getNodeParameter('limit', i, 50) as number;
      const filters = this.getNodeParameter('filters', i, {}) as object;
      const sort = this.getNodeParameter('sort', i, {}) as { sortBy?: string; sortOrder?: 'asc' | 'desc' };
      
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
      
      // In the actual implementation, this would make an API call to list corrugated liners
      // For now, we just return placeholder data
      returnData.push({
        json: {
          success: true,
          data: [
            {
              id: '1',
              name: 'Kraft Liner 125',
              weight: 125,
              color: 'Brown',
              type: 'Kraft',
            },
            {
              id: '2',
              name: 'Test Liner 100',
              weight: 100,
              color: 'White',
              type: 'Test',
            },
            {
              id: '3',
              name: 'Kraft Liner 170',
              weight: 170,
              color: 'Brown',
              type: 'Kraft',
            },
          ],
          pagination: {
            total: 3,
            page: 1,
            itemsPerPage: limit || 100,
          },
        },
      });
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
