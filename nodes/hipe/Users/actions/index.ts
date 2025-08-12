import * as create from './CreateContact';
import * as get from './Get';
import * as list from './List';
import * as update from './Update';

export const RESOURCE = 'user';

export const ACTIONS = {
	createContact: create,
	get: get,
	getMany: list,
	update: update,
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
	];
	return [RESOURCE, properties];
}
