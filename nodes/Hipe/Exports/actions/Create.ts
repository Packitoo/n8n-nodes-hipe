import { IExecuteFunctions, sleep } from 'n8n-workflow';
import { INodeExecutionData, INodeProperties } from 'n8n-workflow';

export const properties: INodeProperties[] = [
	{
		displayName: 'Type',
		name: 'type',
		type: 'number',
		required: true,
		default: 0,
		description: 'Type of the export',
		displayOptions: { show: { resource: ['export'], operation: ['create'] } },
	},
	{
		displayName: 'Start Date',
		name: 'startDate',
		type: 'string',
		default: '',
		description: 'Start date (ISO string)',
		displayOptions: { show: { resource: ['export'], operation: ['create'] } },
	},
	{
		displayName: 'End Date',
		name: 'endDate',
		type: 'string',
		default: '',
		description: 'End date (ISO string)',
		displayOptions: { show: { resource: ['export'], operation: ['create'] } },
	},
	{
		displayName: 'User IDs',
		name: 'userIds',
		type: 'fixedCollection',
		placeholder: 'Add User ID',
		default: {},
		typeOptions: { multipleValues: true },
		displayOptions: { show: { resource: ['export'], operation: ['create'] } },
		options: [
			{
				name: 'userIdFields',
				displayName: 'User Id',
				values: [{ displayName: 'ID', name: 'id', type: 'string', default: '' }],
			},
		],
	},
];

export async function execute(
	this: IExecuteFunctions,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];

	const credentials = await this.getCredentials('hipeApi');
	let baseUrl = credentials.url as string;
	if (!baseUrl || typeof baseUrl !== 'string' || !/^https?:\/\//.test(baseUrl)) {
		throw new Error('HIPE base URL is not set or is invalid: ' + baseUrl);
	}
	baseUrl = baseUrl.replace(/\/$/, '');

	for (let i = 0; i < items.length; i++) {
		try {
			const type = this.getNodeParameter('type', i) as number;
			const startDate = this.getNodeParameter('startDate', i, '') as string;
			const endDate = this.getNodeParameter('endDate', i, '') as string;
			const userIdsGroup = this.getNodeParameter('userIds', i, {}) as any;
			let user_ids: string[] = [];
			if (
				userIdsGroup &&
				typeof userIdsGroup === 'object' &&
				'userIdFields' in userIdsGroup &&
				Array.isArray(userIdsGroup.userIdFields)
			) {
				user_ids = userIdsGroup.userIdFields.map((f: any) => f.id).filter((v: string) => !!v);
			}

			const body = { type, start_date: startDate, end_date: endDate, user_ids };

			const response = await this.helpers.requestWithAuthentication.call(this, 'hipeApi', {
				method: 'POST',
				url: `${baseUrl}/api/exports`,
				body,
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
