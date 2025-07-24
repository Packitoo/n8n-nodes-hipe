import { IExecuteFunctions } from 'n8n-workflow';
import { INodeExecutionData, INodeProperties } from 'n8n-workflow';
import { ICorrugatedFlute } from '../../../interfaces';

// Properties for the Create operation
export const properties: INodeProperties[] = [
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		required: true,
		default: '',
		description: 'Name of the corrugated flute',
		displayOptions: {
			show: {
				resource: ['corrugatedFlute'],
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'Thickness',
		name: 'thickness',
		type: 'number',
		default: 0,
		description: 'Thickness of the flute in mm',
		displayOptions: {
			show: {
				resource: ['corrugatedFlute'],
				operation: ['create'],
			},
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
				resource: ['corrugatedFlute'],
				operation: ['create'],
			},
		},
		options: [
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
			// Add any additional fields specific to creating corrugated flutes
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
			const additionalFields = this.getNodeParameter('additionalFields', i, {}) as object;

			// Prepare request data
			const requestData: ICorrugatedFlute = {
				name,
				...additionalFields,
			};

      const response = await this.helpers.requestWithAuthentication.call(this, "hipeApi", {
        method: 'POST',
        url: `${baseUrl}/api/corrugated-flutes`,
        body: requestData,
        json: true,
      });
      returnData.push({ json: response });
			// In the actual implementation, this would make an API call to create the corrugated flute
			// For now, we just return the request data as a placeholder
			// returnData.push({
			// 	json: {
			// 		success: true,
			// 		data: requestData,
			// 	},
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
