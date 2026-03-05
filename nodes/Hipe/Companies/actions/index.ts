import * as create from './Create';
import * as get from './Get';
import * as hardDelete from './HardDelete';
import * as list from './List';
import * as update from './Update';
import * as linkContact from './linkContact';
import * as unlinkContact from './unlinkContact';
import * as getAddresses from './getAddresses';
import * as search from './Search';
import { RESOURCES, OPERATIONS } from '../../constants';

export const RESOURCE = RESOURCES.COMPANY;

export const ACTIONS = {
	create: create,
	get: get,
	hardDelete: hardDelete,
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
			default: OPERATIONS.GET,
			displayOptions: {
				show: { resource: [RESOURCE] },
			},
			options: [
				{
					name: 'Create',
					value: OPERATIONS.CREATE,
					description: 'Create a new company',
					action: 'Create a new company',
				},
				{
					name: 'Get',
					value: OPERATIONS.GET,
					description: 'Get a specific company',
					action: 'Get a specific company',
				},
				{
					name: 'Get Addresses',
					value: OPERATIONS.GET_ADDRESSES,
					description: 'Get addresses of a company',
					action: 'Get addresses of a company',
				},
				{
					name: 'Get Many',
					value: OPERATIONS.GET_MANY,
					description: 'Get multiple companies',
					action: 'Get multiple companies',
				},
				{
					name: 'Hard Delete',
					value: OPERATIONS.HARD_DELETE,
					description: 'Permanently delete a company',
					action: 'Hard delete a company',
				},
				{
					name: 'Link Contact',
					value: OPERATIONS.LINK_CONTACT,
					description: 'Link an existing contact to a company',
					action: 'Link an existing contact to a company',
				},
				{
					name: 'Search',
					value: OPERATIONS.SEARCH,
					description: 'Search for companies',
					action: 'Search for companies',
				},
				{
					name: 'Unlink Contact',
					value: OPERATIONS.UNLINK_CONTACT,
					description: 'Unlink a contact from a company',
					action: 'Unlink a contact from a company',
				},
				{
					name: 'Update',
					value: OPERATIONS.UPDATE,
					description: 'Update a specific company',
					action: 'Update a specific company',
				},
				// { name: 'Create Address', value: 'createAddress', description: 'Create a new address for a company', action: 'Create address' },
			],
			noDataExpression: true,
		},
		...create.properties,
		...get.properties,
		...hardDelete.properties,
		...list.properties,
		...update.properties,
		...linkContact.properties,
		...unlinkContact.properties,
		...getAddresses.properties,
		...search.properties,
	];
	return [RESOURCE, properties];
}
