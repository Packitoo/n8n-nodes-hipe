import { IExecuteFunctions, sleep } from 'n8n-workflow';
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
		displayOptions: {
			show: {
				resource: ['corrugatedMaterialCompositionPrice'],
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'Price',
		name: 'price',
		type: 'number',
		required: true,
		default: 0,
		description: 'Price of the composition',
		displayOptions: {
			show: {
				resource: ['corrugatedMaterialCompositionPrice'],
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'Currency',
		name: 'currency',
		type: 'string',
		required: true,
		default: 'EUR',
		description: 'Currency of the price',
		displayOptions: {
			show: {
				resource: ['corrugatedMaterialCompositionPrice'],
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
				resource: ['corrugatedMaterialCompositionPrice'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Valid From',
				name: 'validFrom',
				type: 'dateTime',
				default: '',
				description: 'Date from which the price is valid',
				displayOptions: {
					show: {
						resource: ['corrugatedMaterialCompositionPrice'],
						operation: ['create'],
					},
				},
			},
			{
				displayName: 'Valid To',
				name: 'validTo',
				type: 'dateTime',
				default: '',
				description: 'Date until which the price is valid',
				displayOptions: {
					show: {
						resource: ['corrugatedMaterialCompositionPrice'],
						operation: ['create'],
					},
				},
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
	const returnData: INodeExecutionData[] = [];

	// Get credentials and normalize base URL
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
			const corrugatedMaterialComposition = this.getNodeParameter(
				'corrugatedMaterialComposition',
				i,
			) as string;
			const price = this.getNodeParameter('price', i) as number;
			const currency = this.getNodeParameter('currency', i) as string;
			const additionalFields = this.getNodeParameter('additionalFields', i, {}) as object;

			// Prepare request data
			const requestData: ICorrugatedMaterialCompositionPrice = {
				corrugatedMaterialComposition,
				price,
				currency,
				...(additionalFields as object),
			} as ICorrugatedMaterialCompositionPrice;

			const response = await this.helpers.requestWithAuthentication.call(this, 'hipeApi', {
				method: 'POST',
				url: `${baseUrl}/api/corrugated-material-composition-prices`,
				body: requestData,
				json: true,
			});

			returnData.push({ json: response });
		} catch (error) {
			if (this.continueOnFail()) {
				returnData.push({ json: { error: (error as Error).message } });
				continue;
			}
			throw error;
		}
		sleep(500);
	}
	return returnData;
}
