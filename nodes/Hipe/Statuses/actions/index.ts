import * as create from './Create';
import * as list from './List';
import * as update from './Update';
import * as remove from './Delete';
import { RESOURCES, OPERATIONS } from '../../constants';

export const RESOURCE = RESOURCES.STATUSES;

export const ACTIONS = {
	create: create,
	getMany: list,
	update: update,
	delete: remove,
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
					name: 'Create',
					value: OPERATIONS.CREATE,
					description: 'Create a new status',
					action: 'Create a new status',
				},
				{
					name: 'Get Many',
					value: OPERATIONS.GET_MANY,
					description: 'Get statuses for a given entity',
					action: 'Get statuses for a given entity',
				},
				{
					name: 'Update',
					value: OPERATIONS.UPDATE,
					description: 'Update a specific status',
					action: 'Update a specific status',
				},
				{
					name: 'Delete',
					value: OPERATIONS.DELETE,
					description: 'Delete a specific status',
					action: 'Delete a specific status',
				},
			],
			default: OPERATIONS.GET_MANY,
			noDataExpression: true,
		},
		...create.properties,
		...list.properties,
		...update.properties,
		...remove.properties,
	];
	return [RESOURCE, properties];
}
