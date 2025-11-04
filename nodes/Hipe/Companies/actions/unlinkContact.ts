import { IExecuteFunctions, sleep, INodeExecutionData, INodeProperties } from 'n8n-workflow';

export const properties: INodeProperties[] = [
	{
		displayName: 'Company ID',
		name: 'companyId',
		type: 'string',
		required: true,
		default: '',
		description: 'ID of the company to add the contact to',
		displayOptions: {
			show: {
				resource: ['company'],
				operation: ['addExistingContact'],
			},
		},
	},
	{
		displayName: 'Contact ID',
		name: 'contactId',
		type: 'string',
		required: true,
		default: '',
		description: 'ID of the contact to add',
		displayOptions: {
			show: {
				resource: ['company'],
				operation: ['addExistingContact'],
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
		try {
			const contactId = this.getNodeParameter('contactId', i) as string;
			const companyId = this.getNodeParameter('companyId', i) as string;

			const response = await this.helpers.requestWithAuthentication.call(this, 'hipeApi', {
				method: 'DELETE',
				url: `${baseUrl}/api/companies/${companyId}/contacts/${contactId}`,
				json: true,
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
