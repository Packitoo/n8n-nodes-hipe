import { IExecuteFunctions } from 'n8n-workflow';
import { INodeExecutionData, INodeProperties } from 'n8n-workflow';
import { ICorrugatedFormat } from '../../../interfaces';

// Properties for the Create operation
export const properties: INodeProperties[] = [
  {
    displayName: 'Width',
    name: 'width',
    type: 'number',
    required: true,
    default: 0,
    description: 'Width of the corrugated format in mm',
    displayOptions: {
      show: {
        resource: ['corrugatedFormat'],
        operation: ['create']
      }
    }
  },
  {
    displayName: 'Length',
    name: 'length',
    type: 'number',
    required: true,
    default: 0,
    description: 'Length of the corrugated format in mm',
    displayOptions: {
      show: {
        resource: ['corrugatedFormat'],
        operation: ['create']
      }
    }
  },
  {
    displayName: 'Additional Fields',
    name: 'additionalFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: {
      show: {
        resource: ['corrugatedFormat'],
        operation: ['create']
      }
    },
    options: [
      // Add any additional fields specific to creating corrugated formats
    ],
  },
];

// Execute function for the Create operation
export async function execute(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];

  // Get credentials
  const credentials = await this.getCredentials('hipeApi');
  let baseUrl = credentials.url;
  if (typeof baseUrl !== 'string') {
    throw new Error('HIPE base URL is not a string');
  }
  baseUrl = baseUrl.replace(/\/$/, '');

  for (let i = 0; i < items.length; i++) {
    try {
      // Get input data
      const width = this.getNodeParameter('width', i) as number;
      const length = this.getNodeParameter('length', i) as number;
      const additionalFields = this.getNodeParameter('additionalFields', i, {}) as object;

      // Prepare request data
      const requestData: ICorrugatedFormat = {
        width,
        length,
        ...additionalFields,
      };

      // Make API call to create the corrugated format
      const response = await this.helpers.request!(
        {
          method: 'POST',
          url: `${baseUrl}/api/corrugated-formats`,
          body: requestData,
          json: true,
        }
      );

      returnData.push({ json: response });
    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({ json: { error: error.message } });
        continue;
      }
      throw error;
    }
  }

  return returnData;
}

