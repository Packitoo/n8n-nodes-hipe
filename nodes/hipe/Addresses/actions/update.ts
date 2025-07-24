import { IExecuteFunctions, INodeExecutionData, INodeProperties } from 'n8n-workflow';

export const properties: INodeProperties[] = [
	{
		displayName: 'Address ID',
		name: 'id',
		type: 'string',
		required: true,
		default: '',
		description: 'ID of the address to retrieve',
		displayOptions: {
			show: {
				resource: ['address'],
				operation: ['update'],
			},
		},
	},
	{
		displayName: 'Company ID',
		name: 'companyId',
		type: 'string',
		default: '',
		description: 'ID of the company to retrieve',
		displayOptions: {
			show: {
				resource: ['address'],
				operation: ['update'],
			},
		},
	},
	{
		displayName: 'Address',
		name: 'address',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: ['address'],
				operation: ['update'],
			},
		},
	},
	{
		displayName: 'City',
		name: 'city',
		type: 'string',
		default: '',
		description: 'City of the address',
		displayOptions: {
			show: {
				resource: ['address'],
				operation: ['update'],
			},
		},
	},
	{
		displayName: 'Country',
		name: 'country',
		type: 'string',
		default: '',
		description: 'Country of the address',
		displayOptions: {
			show: {
				resource: ['address'],
				operation: ['update'],
			},
		},
	},
	{
		displayName: 'First Complementary Address',
		name: 'firstComplementaryAddress',
		type: 'string',
		default: '',
		description: 'First complementary address of the company',
		displayOptions: {
			show: {
				resource: ['address'],
				operation: ['update'],
			},
		},
	},
	{
		displayName: 'Second Complementary Address',
		name: 'secondComplementaryAddress',
		type: 'string',
		default: '',
		description: 'Second complementary address of the company',
		displayOptions: {
			show: {
				resource: ['address'],
				operation: ['update'],
			},
		},
	},
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		default: '',
		description: 'Name of the address',
		displayOptions: {
			show: {
				resource: ['address'],
				operation: ['update'],
			},
		},
	},
	{
		displayName: 'Position',
		name: 'position',
		type: 'number',
		default: 1,
		description: 'Position of the address',
		displayOptions: {
			show: {
				resource: ['address'],
				operation: ['update'],
			},
		},
	},
	{
		displayName: 'State',
		name: 'state',
		type: 'string',
		default: '',
		description: 'State of the address',
		displayOptions: {
			show: {
				resource: ['address'],
				operation: ['update'],
			},
		},
	},
	{
		displayName: 'Zip Code',
		name: 'zipCode',
		type: 'string',
		default: '',
		description: 'Zip code of the address',
		displayOptions: {
			show: {
				resource: ['address'],
				operation: ['update'],
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
				resource: ['address'],
				operation: ['update'],
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
		const id = this.getNodeParameter('id', i) as string;

		const companyId = this.getNodeParameter('companyId', i) as string;
		const address = this.getNodeParameter('address', i) as string;
		const city = this.getNodeParameter('city', i) as string;
		const country = this.getNodeParameter('country', i) as string;
		const firstComplementaryAddress = this.getNodeParameter(
			'firstComplementaryAddress',
			i,
		) as string;
		const name = this.getNodeParameter('name', i) as string;
		const position = this.getNodeParameter('position', i) as number;
		const secondComplementaryAddress = this.getNodeParameter(
			'secondComplementaryAddress',
			i,
		) as string;
		const state = this.getNodeParameter('state', i) as string;
		const zipCode = this.getNodeParameter('zipCode', i) as string;
		try {
			// Get input data
			// const options = this.getNodeParameter('options', i, {}) as { includeDetails?: boolean };

			// Make API call to get the corrugated format
			const response = await this.helpers.requestWithAuthentication.call(this, 'hipeApi', {
				method: 'PATCH',
				url: `${baseUrl}/api/addresses/${id}`,
				json: true,
				body: {
					...(companyId ? { companyId } : {}),
					...(address ? { address } : {}),
					...(city ? { city } : {}),
					...(country ? { country } : {}),
					...(firstComplementaryAddress ? { firstComplementaryAddress } : {}),
					...(name ? { name } : {}),
					...(position ? { position } : {}),
					...(secondComplementaryAddress ? { secondComplementaryAddress } : {}),
					...(state ? { state } : {}),
					...(zipCode ? { zipCode } : {}),
				},
			});

			returnData.push({ json: response });
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
