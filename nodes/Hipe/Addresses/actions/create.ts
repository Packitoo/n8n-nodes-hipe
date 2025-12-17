import { IExecuteFunctions, INodeExecutionData, INodeProperties, sleep } from 'n8n-workflow';
import { getAsyncHeaders } from '../../utils/asyncMode';

export const properties: INodeProperties[] = [
	{
		displayName: 'Company ID',
		name: 'companyId',
		type: 'string',
		default: '',
		description: 'ID of the company (optional)',
		displayOptions: {
			show: {
				resource: ['address'],
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'Address',
		name: 'address',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['address'],
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'City',
		name: 'city',
		type: 'string',
		required: true,
		default: '',
		description: 'City of the address',
		displayOptions: {
			show: {
				resource: ['address'],
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'Country',
		name: 'country',
		type: 'string',
		required: true,
		default: '',
		description: 'Country of the address',
		displayOptions: {
			show: {
				resource: ['address'],
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'First Complementary Address',
		name: 'firstComplementaryAddress',
		type: 'string',
		required: true,
		default: '',
		description: 'First complementary address of the company',
		displayOptions: {
			show: {
				resource: ['address'],
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'Second Complementary Address',
		name: 'secondComplementaryAddress',
		type: 'string',
		required: true,
		default: '',
		description: 'Second complementary address of the company',
		displayOptions: {
			show: {
				resource: ['address'],
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		required: true,
		default: '',
		description: 'Name of the address',
		displayOptions: {
			show: {
				resource: ['address'],
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'Position',
		name: 'position',
		type: 'number',
		required: true,
		default: 1,
		description: 'Position of the address',
		displayOptions: {
			show: {
				resource: ['address'],
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'State',
		name: 'state',
		type: 'string',
		required: true,
		default: '',
		description: 'State of the address',
		displayOptions: {
			show: {
				resource: ['address'],
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'Zip Code',
		name: 'zipCode',
		type: 'string',
		required: true,
		default: '',
		description: 'Zip code of the address',
		displayOptions: {
			show: {
				resource: ['address'],
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'External ID',
		name: 'externalId',
		type: 'string',
		default: '',
		description: 'External ID of the address',
		displayOptions: {
			show: {
				resource: ['address'],
				operation: ['create'],
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
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'Async Mode',
		name: 'asyncMode',
		type: 'boolean',
		default: false,
		description: 'Whether to use asynchronous processing (returns a job ID instead of waiting for completion)',
		displayOptions: {
			show: {
				resource: ['address'],
				operation: ['create'],
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
		const externalId = this.getNodeParameter('externalId', i) as string;
		const asyncMode = this.getNodeParameter('asyncMode', i, false) as boolean;
		try {
			// Make API call to create address
			const response = await this.helpers.requestWithAuthentication.call(this, 'hipeApi', {
				method: 'POST',
				url: `${baseUrl}/api/addresses`,
				json: true,
				body: {
					companyId,
					address,
					city,
					country,
					firstComplementaryAddress,
					name,
					position,
					secondComplementaryAddress,
					state,
					zipCode,
					externalId
				},
				headers: getAsyncHeaders(asyncMode),
			});

			returnData.push({ json: response });
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
