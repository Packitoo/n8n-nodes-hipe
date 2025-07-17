import { IExecuteFunctions } from 'n8n-workflow';
import { INodeExecutionData, INodeProperties } from 'n8n-workflow';
import { ICorrugatedMaterial } from '../../../interfaces';

// Properties for the Get operation
export const properties: INodeProperties[] = [
  {
    displayName: 'Material ID',
    name: 'materialId',
    type: 'string',
    required: true,
    default: '',
    description: 'ID of the corrugated material to retrieve',
    displayOptions: {
      show: {
        resource: ['corrugatedMaterial'],
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
        resource: ['corrugatedMaterial'],
        operation: ['get'],
      },
    },
    options: [
      // Add any additional options for retrieving corrugated materials
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
  
  // Get credentials and baseUrl
  const credentials = await this.getCredentials('hipe');
  let baseUrl = credentials.url;
  if (typeof baseUrl !== 'string') {
    throw new Error('HIPE base URL is not a string');
  }
  baseUrl = baseUrl.replace(/\/$/, '');

  // Process each item
  for (let i = 0; i < items.length; i++) {
    try {
      const materialId = this.getNodeParameter('materialId', i) as string;
      const response = await this.helpers.requestWithAuthentication.call(this, 'hipe', {
        method: 'GET',
        url: `${baseUrl}/api/corrugated-materials/${materialId}`,
        json: true,
      });
      returnData.push({ json: response as ICorrugatedMaterial });
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
