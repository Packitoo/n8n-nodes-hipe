import { IExecuteFunctions } from 'n8n-workflow';
import { INodeExecutionData, INodeProperties } from 'n8n-workflow';
import { ICorrugatedMaterialCompositionPrice } from '../../../interfaces';

// Properties for the Get operation
export const properties: INodeProperties[] = [
  {
    displayName: 'Price ID',
    name: 'priceId',
    type: 'string',
    required: true,
    default: '',
    description: 'ID of the corrugated material composition price to retrieve',
    displayOptions: {
      show: {
        resource: ['corrugatedMaterialCompositionPrice'],
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
        resource: ['corrugatedMaterialCompositionPrice'],
        operation: ['get'],
      },
    },
    options: [
      // Add any additional options for retrieving corrugated material composition prices
    ],
  },
];

// Execute function for the Get operation
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
      const priceId = this.getNodeParameter('priceId', i) as string;
      const response = await this.helpers.requestWithAuthentication.call(this, 'hipe', {
        method: 'GET',
        url: `${baseUrl}/api/corrugated-material-composition-prices/${priceId}`,
        json: true,
      });
      returnData.push({ json: response as ICorrugatedMaterialCompositionPrice });
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
