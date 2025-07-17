import { IExecuteFunctions } from 'n8n-workflow';
import { INodeExecutionData, INodeProperties } from 'n8n-workflow';

// Properties for the CreateBulk operation
export const properties: INodeProperties[] = [
  {
    displayName: 'Input Data Field',
    name: 'inputDataField',
    type: 'string',
    default: 'data',
    required: true,
    description: 'The name of the input field containing the array of compositions to create',
    displayOptions: {
      show: {
        resource: ['corrugatedMaterialComposition'],
        operation: ['createBulk'],
      },
    },
  },
  {
    displayName: 'Options',
    name: 'options',
    type: 'collection',
    placeholder: 'Add Option',
    default: {},
    displayOptions: {
      show: {
        resource: ['corrugatedMaterialComposition'],
        operation: ['createBulk'],
      },
    },
    options: [
      {
        displayName: 'Continue on Error',
        name: 'continueOnError',
        type: 'boolean',
        default: false,
        description: 'Whether to continue processing if an error occurs with one item',
      },
    ],
  },
];

// Execute function for the CreateBulk operation
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
      const inputDataField = this.getNodeParameter('inputDataField', i) as string;

      
      // Get the array of compositions from the input data field
      const inputData = items[i].json[inputDataField];
      
      if (!Array.isArray(inputData)) {
        throw new Error(`Input data field '${inputDataField}' must contain an array of compositions`);
      }
      
      // In the actual implementation, this would make an API call to create multiple corrugated material compositions
      // For now, we just return the input data as a placeholder
      returnData.push({
        json: {
          success: true,
          data: (inputData as any[]).map((item, index) => ({
            id: `bulk-${index + 1}`,
            ...item,
          })),
        },
      });
    } catch (error) {
      if (this.continueOnFail() || (this.getNodeParameter('options', i, {}) as { continueOnError?: boolean }).continueOnError) {
        returnData.push({ json: { error: error.message } });
        continue;
      }
      throw error;
    }
  }
  
  return returnData;
}
