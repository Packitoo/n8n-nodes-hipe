import * as create from './Create';
import * as get from './Get';
import * as list from './List';
import * as update from './Update';
import * as linkContact from './linkContact';
import * as unlinkContact from './unlinkContact';
import * as getAddresses from './getAddresses';
import * as search from './Search';

export const RESOURCE = 'company';

export const ACTIONS = {
	create: create,
	get: get,
	getMany: list,
	update: update,
	linkContact: linkContact,
	unlinkContact: unlinkContact,
	getAddresses: getAddresses,
	search: search,
};

// Factory function to build all user properties for node usage
export function buildProperties() {
	const properties = [
		{
			displayName: 'Operation',
			name: 'operation',
			type: 'options',
			displayOptions: {
				show: { resource: [RESOURCE] },
			},
			options: [
				{
					name: 'Create',
					value: 'create',
					description: 'Create a new company',
					action: 'Create a new company',
				},
				{
					name: 'Get',
					value: 'get',
					description: 'Get a specific company',
					action: 'Get a specific company',
				},
				{
					name: 'Get Addresses',
					value: 'getAddresses',
					description: 'Get addresses of a company',
					action: 'Get addresses of a company',
				},
				{
					name: 'Get Many',
					value: 'getMany',
					description: 'Get multiple companies',
					action: 'Get multiple companies',
				},
				{
					name: 'Link Contact',
					value: 'linkContact',
					description: 'Link an existing contact to a company',
					action: 'Link an existing contact to a company',
				},
				{
					name: 'Search',
					value: 'search',
					description: 'Search for companies',
					action: 'Search for companies',
				},
				{
					name: 'Unlink Contact',
					value: 'unlinkContact',
					description: 'Unlink a contact from a company',
					action: 'Unlink a contact from a company',
				},
				{
					name: 'Update',
					value: 'update',
					description: 'Update a specific company',
					action: 'Update a specific company',
				},
				// { name: 'Create Address', value: 'createAddress', description: 'Create a new address for a company', action: 'Create address' },
			],
			default: 'get',
			noDataExpression: true,
		},
		...create.properties,
		...get.properties,
		...list.properties,
		...update.properties,
		...linkContact.properties,
		...unlinkContact.properties,
		...getAddresses.properties,
		...search.properties,
	];
	return [RESOURCE, properties];
}
