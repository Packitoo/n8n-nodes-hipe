import { IExecuteFunctions } from 'n8n-workflow';
import { INodeExecutionData, INodeProperties } from 'n8n-workflow';
import { IProject } from '../../interfaces';

// Properties for the Create operation
export const properties: INodeProperties[] = [
  {
    displayName: 'Name',
    name: 'name',
    type: 'string',
    required: true,
    default: '',
    description: 'Name of the project',
  },
  {
    displayName: 'Description',
    name: 'description',
    type: 'string',
    default: '',
    description: 'Description of the project',
  },
  {
    displayName: 'Client ID',
    name: 'clientId',
    type: 'string',
    default: '',
    description: 'ID of the client associated with this project',
  },
  {
    displayName: 'Additional Fields',
    name: 'additionalFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    options: [
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
        default: 'draft',
        description: 'Status of the project',
      },
      {
        displayName: 'Due Date',
        name: 'dueDate',
        type: 'dateTime',
        default: '',
        description: 'Due date of the project',
      },
      // Add any additional fields specific to creating projects
    ],
  },
];

// Execute function for the Create operation
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
      const name = this.getNodeParameter('name', i) as string;
      const description = this.getNodeParameter('description', i, '') as string;
      const clientId = this.getNodeParameter('clientId', i, '') as string;
      const additionalFields = this.getNodeParameter('additionalFields', i, {}) as object;
      
      // Prepare request data
      const requestData: IProject = {
        name,
        description,
        clientId,
        ...additionalFields,
      };
      
      // In the actual implementation, this would make an API call to create the project
      // For now, we just return the request data as a placeholder
      returnData.push({
        json: {
          success: true,
          data: {
            id: 'new-project-id',
            ...requestData,
            createdAt: new Date().toISOString(),
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
