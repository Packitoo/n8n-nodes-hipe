import * as create from './CreateContact';
import * as get from './Get';
import * as list from './List';
import * as update from './Update';
import * as getMe from './GetMe';
import * as search from './Search';
import * as archive from './Archive';
import * as unarchive from './Unarchive';

export const RESOURCE = 'user';

export const ACTIONS = {
	createContact: create,
	get: get,
	getMany: list,
	update: update,
	getMe: getMe,
	search: search,
	archive: archive,
	unarchive: unarchive,
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
					name: 'Archive',
					value: 'archive',
					description: 'Archive a user',
					action: 'Archive a user',
				},
				{
					name: 'Create Contact',
					value: 'createContact',
					description: 'Create a new contact',
					action: 'Create a new contact',
				},
				{ name: 'Get', value: 'get', description: 'Get a specific user', action: 'Get a specific user' },
				{
					name: 'Get Many',
					value: 'getMany',
					description: 'Get multiple users',
					action: 'Get multiple users',
				},
				{
					name: 'Get Me',
					value: 'getMe',
					description: 'Get current authenticated user',
					action: 'Get current authenticated user',
				},
				{
					name: 'Search',
					value: 'search',
					description: 'Advanced search over users',
					action: 'Search users',
				},
				{
					name: 'Unarchive',
					value: 'unarchive',
					description: 'Unarchive a user',
					action: 'Unarchive a user',
				},
				{
					name: 'Update',
					value: 'update',
					description: 'Update a specific user',
					action: 'Update a specific user',
				},
			],
			default: 'getMany',
			noDataExpression: true,
		},
		...create.properties,
		...get.properties,
		...list.properties,
		...update.properties,
		...getMe.properties,
		...search.properties,
		...archive.properties,
		...unarchive.properties,
	];
	return [RESOURCE, properties];
}
