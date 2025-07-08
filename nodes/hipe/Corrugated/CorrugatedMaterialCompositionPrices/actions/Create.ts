import { IExecuteFunctions } from 'n8n-workflow';
import { INodeExecutionData, INodeProperties } from 'n8n-workflow';
import { ICorrugatedMaterialCompositionPrice } from '../../../interfaces';

// Properties for the Create operation
export const properties: INodeProperties[] = [
  {
    displayName: 'Corrugated Material Composition',
    name: 'corrugatedMaterialComposition',
    type: 'string',
    required: true,
    default: '',
    description: 'ID of the corrugated material composition',
  },
  {
    displayName: 'Price',
    name: 'price',
    type: 'number',
    required: true,
    default: 0,
    description: 'Price of the composition',
  },
  {
    displayName: 'Currency',
    name: 'currency',
    type: 'string',
    required: true,
    default: 'EUR',
    description: 'Currency of the price',
  },
  {
    displayName: 'Additional Fields',
    name: 'additionalFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    options: [
      {
        displayName: 'Valid From',
        name: 'validFrom',
        type: 'dateTime',
        default: '',
        description: 'Date from which the price is valid',
      },
      {
        displayName: 'Valid To',
        name: 'validTo',
        type: 'dateTime',
        default: '',
        description: 'Date until which the price is valid',
      },
      // Add any additional fields specific to creating corrugated material composition prices
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
      const corrugatedMaterialComposition = this.getNodeParameter('corrugatedMaterialComposition', i) as string;
      const price = this.getNodeParameter('price', i) as number;
      const currency = this.getNodeParameter('currency', i) as string;
      const additionalFields = this.getNodeParameter('additionalFields', i, {}) as object;
      
      // Prepare request data
      const requestData: ICorrugatedMaterialCompositionPrice = {
        corrugatedMaterialComposition,
        price,
        currency,
        ...additionalFields,
      };
      
      // In the actual implementation, this would make an API call to create the corrugated material composition price
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
