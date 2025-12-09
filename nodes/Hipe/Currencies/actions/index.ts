import * as create from './create';
import * as get from './get';
import * as list from './list';
import * as update from './update';
import * as remove from './remove';
import * as search from './search';

export const RESOURCE = 'currency';

export const ACTIONS = {
	create: create,
	get: get,
	getMany: list,
	update: update,
	delete: remove,
	search: search,
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
				{
					name: 'Create',
					value: 'create',
					description: 'Create a new currency',
					action: 'Create a new currency',
				},
				{
					name: 'Delete',
					value: 'delete',
					description: 'Delete a specific currency',
					action: 'Delete a specific currency',
				},
				{
					name: 'Get',
					value: 'get',
					description: 'Get a specific currency',
					action: 'Get a specific currency',
				},
				{
					name: 'Get Many',
					value: 'getMany',
					description: 'Get multiple currencies',
					action: 'Get many currencies',
				},
				{
					name: 'Search',
					value: 'search',
					description: 'Search for currencies',
					action: 'Search for currencies',
				},
				{
					name: 'Update',
					value: 'update',
					description: 'Update a specific currency',
					action: 'Update a specific currency',
				},
			],
			default: 'get',
			noDataExpression: true,
		},
		...create.properties,
		...get.properties,
		...list.properties,
		...search.properties,
		...update.properties,
		...remove.properties,
	];
	return [RESOURCE, properties];
}
