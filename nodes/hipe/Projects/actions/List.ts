import { IExecuteFunctions } from 'n8n-workflow';
import { INodeExecutionData, INodeProperties } from 'n8n-workflow';
import { IHIPEPaginationOptions } from '../../interfaces';

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
        displayName: 'Client ID',
        name: 'clientId',
        type: 'string',
        default: '',
        description: 'Filter by client ID',
      },
      {
        displayName: 'Status',
        name: 'status',
        type: 'options',
        options: [
          {
            name: 'Draft',
            value: 'draft',
          },
          {
            name: 'In Progress',
            value: 'in_progress',
          },
          {
            name: 'Completed',
            value: 'completed',
          },
        ],
        default: '',
        description: 'Filter by status',
      },
      // Add any additional filters for listing projects
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
          [sort.sortBy]: sort.sortOrder || 'desc',
        };
      }
      
      // In the actual implementation, this would make an API call to list projects
      // For now, we just return placeholder data
      returnData.push({
        json: {
          success: true,
          data: [
            {
              id: 'project-1',
              name: 'Sample Project 1',
              description: 'This is sample project 1',
              clientId: 'client-123',
              status: 'in_progress',
              createdAt: '2023-01-01T00:00:00Z',
              updatedAt: '2023-01-02T00:00:00Z',
            },
            {
              id: 'project-2',
              name: 'Sample Project 2',
              description: 'This is sample project 2',
              clientId: 'client-456',
              status: 'draft',
              createdAt: '2023-01-03T00:00:00Z',
              updatedAt: '2023-01-03T00:00:00Z',
            },
            {
              id: 'project-3',
              name: 'Sample Project 3',
              description: 'This is sample project 3',
              clientId: 'client-123',
              status: 'completed',
              createdAt: '2022-12-01T00:00:00Z',
              updatedAt: '2023-01-05T00:00:00Z',
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
