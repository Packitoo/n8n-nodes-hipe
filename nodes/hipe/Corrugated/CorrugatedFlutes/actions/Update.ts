import { IExecuteFunctions } from 'n8n-workflow';
import { INodeExecutionData, INodeProperties } from 'n8n-workflow';
import { ICorrugatedFlute } from '../../../interfaces';

// Properties for the Update operation
export const properties: INodeProperties[] = [
  {
    displayName: 'Flute ID',
    name: 'fluteId',
    type: 'string',
    required: true,
    default: '',
    description: 'ID of the corrugated flute to update',
    displayOptions: {
      show: {
        resource: ['corrugatedFlute'],
        operation: ['update'],
      },
    },
  },
  {
    displayName: 'Update Fields',
    name: 'updateFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: {
      show: {
        resource: ['corrugatedFlute'],
        operation: ['update'],
      },
    },
    options: [
      {
        displayName: 'Name',
        name: 'name',
        type: 'string',
        default: '',
        description: 'Name of the corrugated flute',
      },
      {
        displayName: 'Thickness',
        name: 'thickness',
        type: 'number',
        default: 0,
        description: 'Thickness of the flute in mm',
      },
      {
        displayName: 'Outside Gain',
        name: 'outsideGain',
        type: 'number',
        default: 0,
        description: 'Outside gain of the flute',
      },
      {
        displayName: 'Inside Loss',
        name: 'insideLoss',
        type: 'number',
        default: 0,
        description: 'Inside loss of the flute',
      },
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
      const fluteId = this.getNodeParameter('fluteId', i) as string;
      const updateFields = this.getNodeParameter('updateFields', i, {}) as ICorrugatedFlute;
      
      // Make API call to update the corrugated flute
      const response = await this.helpers.request!({
        method: 'PATCH',
        url: `${baseUrl}/api/corrugated-flutes/${encodeURIComponent(fluteId)}`,
        body: updateFields,
        json: true,
      });

      returnData.push({ json: response });
      // returnData.push({
      //   json: {
      //     success: true,
      //     data: {
      //       id: fluteId,
      //       ...updateFields,
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
