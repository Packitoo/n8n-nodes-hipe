import * as create from './CreateContact';
import * as get from './Get';
import * as hardDelete from './HardDelete';
import * as list from './List';
import * as update from './Update';
import * as getMe from './GetMe';
import * as search from './Search';
import * as archive from './Archive';
import * as unarchive from './Unarchive';
import { RESOURCES, OPERATIONS } from '../../constants';

export const RESOURCE = RESOURCES.USER;

export const ACTIONS = {
	createContact: create,
	get: get,
	hardDelete: hardDelete,
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
			default: '',
			displayOptions: {
				show: { resource: [RESOURCE] },
			},
			options: [
				{
					name: 'Archive',
					value: OPERATIONS.ARCHIVE,
					description: 'Archive a user',
					action: 'Archive a user',
				},
				{
					name: 'Create Contact',
					value: OPERATIONS.CREATE_CONTACT,
					description: 'Create a new contact',
					action: 'Create a new contact',
				},
				{
					name: 'Get',
					value: OPERATIONS.GET,
					description: 'Get a specific user',
					action: 'Get a specific user',
				},
				{
					name: 'Get Many',
					value: OPERATIONS.GET_MANY,
					description: 'Get multiple users',
					action: 'Get multiple users',
				},
				{
					name: 'Get Me',
					value: OPERATIONS.GET_ME,
					description: 'Get current authenticated user',
					action: 'Get current authenticated user',
				},
				{
					name: 'Hard Delete',
					value: OPERATIONS.HARD_DELETE,
					description: 'Permanently delete a contact user (users without roles only)',
					action: 'Hard delete a contact user',
				},
				{
					name: 'Search',
					value: OPERATIONS.SEARCH,
					description: 'Advanced search over users',
					action: 'Search users',
				},
				{
					name: 'Unarchive',
					value: OPERATIONS.UNARCHIVE,
					description: 'Unarchive a user',
					action: 'Unarchive a user',
				},
				{
					name: 'Update',
					value: OPERATIONS.UPDATE,
					description: 'Update a specific user',
					action: 'Update a specific user',
				},
			],
			default: OPERATIONS.GET_MANY,
			noDataExpression: true,
		},
		...create.properties,
		...get.properties,
		...hardDelete.properties,
		...list.properties,
		...update.properties,
		...getMe.properties,
		...search.properties,
		...archive.properties,
		...unarchive.properties,
	];
	return [RESOURCE, properties];
}
