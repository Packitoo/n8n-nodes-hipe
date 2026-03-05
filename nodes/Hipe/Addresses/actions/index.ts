import { RESOURCES, OPERATIONS } from '../../constants';
import * as create from './create';
import * as get from './get';
import * as list from './list';
import * as update from './update';
import * as remove from './remove';
import * as search from './search';

export const RESOURCE = RESOURCES.ADDRESS;

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
			default: `${OPERATIONS.GET}`,
			displayOptions: {
				show: { resource: [RESOURCE] },
			},
			options: [
				{
					name: 'Create',
					value: OPERATIONS.CREATE,
					description: 'Create a new address',
					action: 'Create a new address',
				},
				{
					name: 'Delete',
					value: OPERATIONS.DELETE,
					description: 'Delete a specific address',
					action: 'Delete a specific address',
				},
				{
					name: 'Get',
					value: OPERATIONS.GET,
					description: 'Get a specific address',
					action: 'Get a specific address',
				},
				// { name: 'Get Many', value: 'getMany', description: 'Get multiple addresses', action: 'Get many' }, // TODO: implement backend
				{
					name: 'Search',
					value: OPERATIONS.SEARCH,
					description: 'Search for addresses',
					action: 'Search for addresses',
				},
				{
					name: 'Update',
					value: OPERATIONS.UPDATE,
					description: 'Update a specific address',
					action: 'Update a specific address',
				},
			],
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
