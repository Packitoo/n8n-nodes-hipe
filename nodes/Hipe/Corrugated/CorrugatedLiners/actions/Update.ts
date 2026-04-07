import { IExecuteFunctions, sleep } from 'n8n-workflow';
import { INodeExecutionData, INodeProperties } from 'n8n-workflow';
import { ICorrugatedLiner } from '../../../interfaces';
import { RESOURCES, OPERATIONS } from '../../../constants';

// Properties for the Update operation
export const properties: INodeProperties[] = [
	{
		displayName: 'Liner ID',
		name: 'linerId',
		type: 'string',
		required: true,
		default: '',
		description: 'ID of the corrugated liner to update',
		displayOptions: {
			show: {
				resource: [RESOURCES.CORRUGATED_LINER],
				operation: [OPERATIONS.UPDATE],
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
				resource: [RESOURCES.CORRUGATED_LINER],
				operation: [OPERATIONS.UPDATE],
			},
		},
		options: [
			{
				displayName: 'Category',
				name: 'category',
				type: 'options',
				options: [
					{
						name: 'Kraft',
						value: 'Kraft',
					},
					{
						name: 'Test',
						value: 'Test',
					},
					{
						name: 'Other',
						value: 'Other',
					},
				],
				default: 'Kraft',
				description: 'Category of the corrugated liner',
				displayOptions: {
					show: {
						resource: [RESOURCES.CORRUGATED_LINER],
						operation: [OPERATIONS.CREATE],
					},
				},
			},
			{
				displayName: 'Ink Porosity',
				name: 'inkPorosity',
				type: 'number',
				required: true,
				default: 0,
				description: 'Ink porosity of the corrugated liner',
				displayOptions: {
					show: {
						resource: [RESOURCES.CORRUGATED_LINER],
						operation: [OPERATIONS.CREATE],
					},
				},
			},
			{
				displayName: 'Label',
				name: 'label',
				type: 'json',
				default: {
					'en-US': '',
					'fr-FR': '',
				},
				description: 'Label of the corrugated liner',
				displayOptions: {
					show: {
						resource: [RESOURCES.CORRUGATED_LINER],
						operation: [OPERATIONS.CREATE],
					},
				},
			},
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'Name of the corrugated liner',
				displayOptions: {
					show: {
						resource: [RESOURCES.CORRUGATED_LINER],
						operation: [OPERATIONS.CREATE],
					},
				},
			},
			{
				displayName: 'Varnish Porosity',
				name: 'varnishPorosity',
				type: 'number',
				required: true,
				default: 0,
				description: 'Varnish porosity of the corrugated liner',
				displayOptions: {
					show: {
						resource: [RESOURCES.CORRUGATED_LINER],
						operation: [OPERATIONS.CREATE],
					},
				},
			},
			// Add any additional fields specific to updating corrugated liners
		],
	},
];

// Execute function for the Update operation
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
			// Get input data
			const linerId = this.getNodeParameter('linerId', i) as string;
			const updateFields = this.getNodeParameter('updateFields', i, {}) as ICorrugatedLiner;

			// Make API call to update the corrugated liner
			const response = await this.helpers.requestWithAuthentication.call(this, 'hipeApi', {
				method: 'PATCH',
				url: `${baseUrl}/api/corrugated-liners/${encodeURIComponent(linerId)}`,
				body: updateFields,
				json: true,
			});
			returnData.push({ json: response });
		} catch (error: any) {
			if (this.continueOnFail()) {
				returnData.push({ json: { error: error.message } });
				continue;
			}
			throw error;
		}
		await sleep(500);
	}
	return returnData;
}
