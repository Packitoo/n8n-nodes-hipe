import { IExecuteFunctions } from 'n8n-workflow';
import { INodeExecutionData, INodeProperties } from 'n8n-workflow';
import { IProject } from '../../interfaces';

// Properties for the Update operation
export const properties: INodeProperties[] = [
  {
    displayName: 'Project ID',
    name: 'projectId',
    type: 'string',
    required: true,
    default: '',
    description: 'ID of the project to update',
  },
  {
    displayName: 'Update Fields',
    name: 'updateFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    options: [
      {
        displayName: 'Name',
        name: 'name',
        type: 'string',
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
        description: 'Status of the project',
      },
      {
        displayName: 'Due Date',
        name: 'dueDate',
        type: 'dateTime',
        default: '',
        description: 'Due date of the project',
      },
      // Add any additional fields specific to updating projects
    ],
  },
];

// Execute function for the Update operation
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
      const projectId = this.getNodeParameter('projectId', i) as string;
      const updateFields = this.getNodeParameter('updateFields', i, {}) as IProject;
      
      // In the actual implementation, this would make an API call to update the project
      // For now, we just return placeholder data
      returnData.push({
        json: {
          success: true,
          data: {
            id: projectId,
            ...updateFields,
            updatedAt: new Date().toISOString(),
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
