import { IExecuteFunctions } from 'n8n-workflow';
import { INodeExecutionData, INodeProperties } from 'n8n-workflow';
import { ICorrugatedLiner } from '../../../interfaces';

// Properties for the Create operation
export const properties: INodeProperties[] = [
  {
    displayName: 'Name',
    name: 'name',
    type: 'string',
    required: true,
    default: '',
    description: 'Name of the corrugated liner',
  },
  {
    displayName: 'Weight',
    name: 'weight',
    type: 'number',
    required: true,
    default: 0,
    description: 'Weight of the liner in g/m²',
  },
  {
    displayName: 'Additional Fields',
    name: 'additionalFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    options: [
      {
        displayName: 'Color',
        name: 'color',
        type: 'string',
        default: '',
        description: 'Color of the liner',
      },
      {
        displayName: 'Type',
        name: 'type',
        type: 'string',
        default: '',
        description: 'Type of the liner (e.g., Kraft, Test)',
      },
      // Add any additional fields specific to creating corrugated liners
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
      const weight = this.getNodeParameter('weight', i) as number;
      const additionalFields = this.getNodeParameter('additionalFields', i, {}) as object;
      
      // Prepare request data
      const requestData: ICorrugatedLiner = {
        name,
        weight,
        ...additionalFields,
      };
      
      // In the actual implementation, this would make an API call to create the corrugated liner
      // For now, we just return the request data as a placeholder
      returnData.push({
        json: {
          success: true,
          data: requestData,
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
