import { IExecuteFunctions } from 'n8n-workflow';
import { INodeExecutionData, INodeProperties } from 'n8n-workflow';

// Properties for the Get operation
export const properties: INodeProperties[] = [
  {
    displayName: 'user ID',
    name: 'id',
    type: 'string',
    required: true,
    default: '',
    description: 'ID of the user to retrieve',
    displayOptions: {
      show: {
        resource: ['user'],
        operation: ['get']
      }
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
        resource: ['user'],
        operation: ['get']
      }
    },
    options: [
      // Add any additional options for retrieving corrugated formats
    ],
  },
];

// Execute function for the Get operation
export async function execute(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];

  // Get credentials
  const credentials = await this.getCredentials('hipe');
  let baseUrl = credentials.url;
  if (!baseUrl || typeof baseUrl !== 'string' || !/^https?:\/\//.test(baseUrl)) {
    throw new Error('HIPE base URL is not set or is invalid: ' + baseUrl);
  }
  baseUrl = baseUrl.replace(/\/$/, '');

  // Process each item
  for (let i = 0; i < items.length; i++) {
    try {
      // Get input data
      const id = this.getNodeParameter('id', i) as string;
      // const options = this.getNodeParameter('options', i, {}) as { includeDetails?: boolean };
      
      // Make API call to get the corrugated format
      const response = await this.helpers.requestWithAuthentication.call(this, "hipe", {
        method: 'GET',
        url: `${baseUrl}/api/users/${id}`,
        json: true,
      });

      returnData.push({ json: response });
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
