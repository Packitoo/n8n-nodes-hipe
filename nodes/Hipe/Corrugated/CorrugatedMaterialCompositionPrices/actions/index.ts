import * as create from './Create';
import * as createBulk from './CreateBulk';
import * as get from './Get';
import * as list from './List';
import * as update from './Update';
import * as del from './Delete';
import { RESOURCES, OPERATIONS } from '../../../constants';

export const RESOURCE = RESOURCES.CORRUGATED_MATERIAL_COMPOSITION_PRICE;

export const ACTIONS = {
	create: create,
	createBulk: createBulk,
	get: get,
	getMany: list,
	update: update,
	delete: del,
};

// Factory function to build all corrugated material composition price properties for node usage
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
					description: 'Create a new corrugated material composition price',
					action: 'Create a new corrugated material composition price',
				},
				{
					name: 'Create Bulk',
					value: OPERATIONS.CREATE_BULK,
					description: 'Create multiple corrugated material composition prices',
					action: 'Create multiple corrugated material composition prices',
				},
				{
					name: 'Delete',
					value: OPERATIONS.DELETE,
					description: 'Delete a specific corrugated material composition price',
					action: 'Delete a specific corrugated material composition price',
				},
				{
					name: 'Get',
					value: OPERATIONS.GET,
					description: 'Get a specific corrugated material composition price',
					action: 'Get a specific corrugated material composition price',
				},
				{
					name: 'Get Many',
					value: OPERATIONS.GET_MANY,
					description: 'Get multiple corrugated material composition prices',
					action: 'Get multiple corrugated material composition prices',
				},
				{
					name: 'Update',
					value: OPERATIONS.UPDATE,
					description: 'Update a specific corrugated material composition price',
					action: 'Update a specific corrugated material composition price',
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
