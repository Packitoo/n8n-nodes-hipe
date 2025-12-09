import { IExecuteFunctions, INodeExecutionData, INodeProperties, sleep } from 'n8n-workflow';

export const properties: INodeProperties[] = [
	{
		displayName: 'Addresses (JSON Array)',
		name: 'addresses',
		type: 'json',
		required: true,
		default: '[]',
		description: 'Array of addresses to create in bulk. Each address should contain: address, city, country, firstComplementaryAddress, secondComplementaryAddress, name, position, state, zipCode, and optionally companyId and externalId.',
		displayOptions: {
			show: {
				resource: ['address'],
				operation: ['createBulk'],
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
				resource: ['address'],
				operation: ['createBulk'],
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
		const addressesJson = this.getNodeParameter('addresses', i) as string;

		try {
			let addresses: any[];

			// Parse the JSON array
			if (typeof addressesJson === 'string') {
				addresses = JSON.parse(addressesJson);
			} else {
				addresses = addressesJson as any[];
			}

			if (!Array.isArray(addresses)) {
				throw new Error('Addresses must be an array');
			}

			if (addresses.length === 0) {
				throw new Error('Addresses array cannot be empty');
			}

			// Make API call to create addresses in bulk
			const response = await this.helpers.requestWithAuthentication.call(this, 'hipeApi', {
				method: 'POST',
				url: `${baseUrl}/api/addresses/bulk`,
				json: true,
				body: {
					bulk: addresses,
				},
			});

			// Handle response - API returns array of created addresses
			if (Array.isArray(response)) {
				response.forEach((item) => returnData.push({ json: item }));
			} else {
				returnData.push({ json: response });
			}
		} catch (error) {
			if (this.continueOnFail()) {
				returnData.push({ json: { error: error.message } });
				continue;
			}
			throw error;
		}
		sleep(500);
	}
	return returnData;
}
