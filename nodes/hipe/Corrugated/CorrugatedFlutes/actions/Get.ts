import { IExecuteFunctions } from 'n8n-workflow';
import { INodeExecutionData, INodeProperties } from 'n8n-workflow';

// Properties for the Get operation
export const properties: INodeProperties[] = [
  {
    displayName: 'Flute ID',
    name: 'fluteId',
    type: 'string',
    required: true,
    default: '',
    description: 'ID of the corrugated flute to retrieve',
    displayOptions: {
      show: {
        resource: ['corrugatedFlute'],
        operation: ['get'],
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
        resource: ['corrugatedFlute'],
        operation: ['get'],
      },
    },
    options: [
      // Add any additional options for retrieving corrugated flutes
    ],
  },
];

// Execute function for the Get operation
export async function execute(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  // This is just a scaffold, implementation will be added later
  const returnData: INodeExecutionData[] = [];
  
  const credentials = await this.getCredentials('hipe');
  let baseUrl = credentials.url;
  if (typeof baseUrl !== 'string') {
    throw new Error('HIPE base URL is not a string');
  }
  baseUrl = baseUrl.replace(/\/$/, '');

  // Process each item
  for (let i = 0; i < items.length; i++) {
    try {
      // Get input data
      const fluteId = this.getNodeParameter('fluteId', i) as string;
      // const options = this.getNodeParameter('options', i, {}) as object;
      
      // In the actual implementation, this would make an API call to get the corrugated flute
      // For now, we just return placeholder data
      const response = await this.helpers.requestWithAuthentication.call(this, "hipe", {
        method: 'GET',
        url: `${baseUrl}/api/corrugated-flutes/${fluteId}`,
        json: true,
      });
      returnData.push({ json: response });
      // returnData.push({
      //   json: {
      //     success: true,
      //     data: {
      //       id: fluteId,
      //       name: 'Sample Corrugated Flute',
      //       height: 3.5,
      //       ...options,
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
