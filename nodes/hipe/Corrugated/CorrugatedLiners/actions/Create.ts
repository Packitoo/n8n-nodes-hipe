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
    displayOptions: {
      show: {
        resource: ['corrugatedLiner'],
        operation: ['create']
      }
    },
  },
  {
    displayName: 'Label',
    name: 'label',
    type: 'json',
    placeholder: 'Add Label',
    default: {
      'en-US': '',
      'fr-FR': ''
    },
    description: 'Label of the corrugated liner',
    displayOptions: {
      show: {
        resource: ['corrugatedLiner'],
        operation: ['create']
      }
    },
  },
  {
    displayName: "Category",
    name: "category",
    type: 'options',
    options: [
      {
        name: 'Kraft',
        value: 'Kraft',
      },
      {
        name: 'Test',
        value: 'Test',
      },
      {
        name: 'Other',
        value: 'Other',
      }
    ],
    required: true,
    default: 'Kraft',
    description: "Category of the corrugated liner",
    displayOptions: {
      show: {
        resource: ['corrugatedLiner'],
        operation: ['create']
      }
    },
  },
  {
    displayName: 'Ink Porosity',
    name: 'inkPorosity',
    type: 'number',
    required: true,
    default: 0,
    description: 'Ink porosity of the corrugated liner',
    displayOptions: {
      show: {
        resource: ['corrugatedLiner'],
        operation: ['create']
      }
    },
  },
  {
    displayName: 'Varnish Porosity',
    name: 'varnishPorosity',
    type: 'number',
    required: true,
    default: 0,
    description: 'Varnish porosity of the corrugated liner',
    displayOptions: {
      show: {
        resource: ['corrugatedLiner'],
        operation: ['create']
      }
    },
  },
  {
    displayName: 'Additional Fields',
    name: 'additionalFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: {
      show: {
        resource: ['corrugatedLiner'],
        operation: ['create']
      }
    },
    options: [
      // Add any additional fields specific to creating corrugated liners
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

      // Make API call to create the corrugated liner
      const response = await this.helpers.requestWithAuthentication.call(this, "hipeApi", {
        method: 'POST',
        url: `${baseUrl}/api/corrugated-liners`,
        body: requestData,
        json: true,
      });
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
