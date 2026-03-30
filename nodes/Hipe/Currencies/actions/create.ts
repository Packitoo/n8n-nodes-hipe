import { IExecuteFunctions, INodeExecutionData, INodeProperties, sleep } from 'n8n-workflow';
import { RESOURCES, OPERATIONS } from '../../constants';

export const properties: INodeProperties[] = [
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		required: true,
		default: '',
		description: 'Name of the currency (e.g., EURO)',
		displayOptions: {
			show: {
				resource: [RESOURCES.CURRENCY],
				operation: [OPERATIONS.CREATE],
			},
		},
	},
	{
		displayName: 'Code',
		name: 'code',
		type: 'string',
		required: true,
		default: '',
		description: 'Currency code (e.g., EUR)',
		displayOptions: {
			show: {
				resource: [RESOURCES.CURRENCY],
				operation: [OPERATIONS.CREATE],
			},
		},
	},
	{
		displayName: 'Symbol',
		name: 'symbol',
		type: 'string',
		required: true,
		default: '',
		description: 'Currency symbol (e.g., €)',
		displayOptions: {
			show: {
				resource: [RESOURCES.CURRENCY],
				operation: [OPERATIONS.CREATE],
			},
		},
	},
	{
		displayName: 'Country Code',
		name: 'countryCode',
		type: 'string',
		default: '',
		description: 'ISO 3166-1 alpha-2 country code (e.g., eu)',
		displayOptions: {
			show: {
				resource: [RESOURCES.CURRENCY],
				operation: [OPERATIONS.CREATE],
			},
		},
	},
	{
		displayName: 'External ID',
		name: 'externalId',
		type: 'string',
		default: '',
		description: 'External ID from an external system',
		displayOptions: {
			show: {
				resource: [RESOURCES.CURRENCY],
				operation: [OPERATIONS.CREATE],
			},
		},
	},
	{
		displayName: 'Enable',
		name: 'enable',
		type: 'boolean',
		default: true,
		description: 'Whether the currency is enabled',
		displayOptions: {
			show: {
				resource: [RESOURCES.CURRENCY],
				operation: [OPERATIONS.CREATE],
			},
		},
	},
	{
		displayName: 'Default',
		name: 'default',
		type: 'boolean',
		default: false,
		description: 'Whether to set as default currency (only one default per environment)',
		displayOptions: {
			show: {
				resource: [RESOURCES.CURRENCY],
				operation: [OPERATIONS.CREATE],
			},
		},
	},
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		options: [],
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: [RESOURCES.CURRENCY],
				operation: [OPERATIONS.CREATE],
			},
		},
	},
];

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
		const name = this.getNodeParameter('name', i) as string;
		const code = this.getNodeParameter('code', i) as string;
		const symbol = this.getNodeParameter('symbol', i) as string;
		const countryCode = this.getNodeParameter('countryCode', i) as string;
		const externalId = this.getNodeParameter('externalId', i) as string;
		const enable = this.getNodeParameter('enable', i) as boolean;
		const defaultCurrency = this.getNodeParameter('default', i) as boolean;

		try {
			// Make API call to create currency
			const response = await this.helpers.requestWithAuthentication.call(this, 'hipeApi', {
				method: 'POST',
				url: `${baseUrl}/api/currencies`,
				json: true,
				body: {
					name,
					code,
					symbol,
					countryCode,
					externalId,
					enable,
					default: defaultCurrency,
				},
			});

			returnData.push({ json: response, pairedItem: { item: i } });
		} catch (error) {
			if (this.continueOnFail()) {
				returnData.push({ json: { error: error.message }, pairedItem: { item: i } });
				continue;
			}
			throw error;
		}
		sleep(500);
	}
	return returnData;
}
