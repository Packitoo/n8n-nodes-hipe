import * as create from './create';
import * as get from './get';
import * as list from './list';
import * as update from './update';
import * as remove from './remove';

export const RESOURCE = 'address';

export const ACTIONS = {
	create: create,
	get: get,
	getMany: list,
	update: update,
	delete: remove,
};

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
				{ name: 'Create', value: 'create', description: 'Create a new address', action: 'Create a new address' },
				{ name: 'Get', value: 'get', description: 'Get a specific address', action: 'Get a specific address' },
				// { name: 'Get Many', value: 'getMany', description: 'Get multiple addresses', action: 'Get many' }, // TODO: implement backend
				{
					name: 'Update',
					value: 'update',
					description: 'Update a specific address',
					action: 'Update a specific address',
				},
				{
					name: 'Delete',
					value: 'delete',
					description: 'Delete a specific address',
					action: 'Delete a specific address',
				},
			],
			default: 'get',
			noDataExpression: true,
		},
		...create.properties,
		...get.properties,
		...list.properties,
		...update.properties,
		...remove.properties,
	];
	return [RESOURCE, properties];
}
