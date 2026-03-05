import * as create from './Create';
import * as createBulk from './CreateBulk';
import * as get from './Get';
import * as list from './List';
import * as update from './Update';
import * as del from './Delete';
import { RESOURCES, OPERATIONS } from '../../../constants';

export const RESOURCE = RESOURCES.CORRUGATED_MATERIAL_COMPOSITION;

export const ACTIONS = {
	create: create,
	createBulk: createBulk,
	get: get,
	getMany: list,
	update: update,
	delete: del,
};

// Factory function to build all corrugated material composition properties for node usage
export function buildProperties() {
	const properties = [
		{
			displayName: 'Operation',
			name: 'operation',
			type: 'options',
			default: OPERATIONS.GET_MANY,
			displayOptions: {
				show: { resource: [RESOURCE] },
			},
			options: [
				{
					name: 'Create',
					value: OPERATIONS.CREATE,
					description: 'Create a new corrugated material composition',
					action: 'Create a new corrugated material composition',
				},
				{
					name: 'Create Bulk',
					value: OPERATIONS.CREATE_BULK,
					description: 'Create multiple corrugated material compositions',
					action: 'Create multiple corrugated material compositions',
				},
				{
					name: 'Delete',
					value: OPERATIONS.DELETE,
					description: 'Delete a specific corrugated material composition',
					action: 'Delete a specific corrugated material composition',
				},
				{
					name: 'Get',
					value: OPERATIONS.GET,
					description: 'Get a specific corrugated material composition',
					action: 'Get a specific corrugated material composition',
				},
				{
					name: 'Get Many',
					value: OPERATIONS.GET_MANY,
					description: 'Get multiple corrugated material compositions',
					action: 'Get multiple corrugated material compositions',
				},
				{
					name: 'Update',
					value: OPERATIONS.UPDATE,
					description: 'Update a specific corrugated material composition',
					action: 'Update a specific corrugated material composition',
				},
			],
			noDataExpression: true,
		},
		...create.properties,
		...createBulk.properties,
		...get.properties,
		...list.properties,
		...update.properties,
		...del.properties,
	];
	return [RESOURCE, properties];
}
