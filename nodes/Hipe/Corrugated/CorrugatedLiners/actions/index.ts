import * as create from './Create';
import * as get from './Get';
import * as list from './List';
import * as update from './Update';
import { RESOURCES, OPERATIONS } from '../../../constants';

export const RESOURCE = RESOURCES.CORRUGATED_LINER;

export const ACTIONS = {
	create: create,
	get: get,
	getMany: list,
	update: update,
};

// Factory function to build all corrugated liner properties for node usage
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
					description: 'Create a new corrugated liner',
					action: 'Create a new corrugated liner',
				},
				{
					name: 'Get',
					value: OPERATIONS.GET,
					description: 'Get a specific corrugated liner',
					action: 'Get a specific corrugated liner',
				},
				{
					name: 'Get Many',
					value: OPERATIONS.GET_MANY,
					description: 'Get multiple corrugated liners',
					action: 'Get multiple corrugated liners',
				},
				{
					name: 'Update',
					value: OPERATIONS.UPDATE,
					description: 'Update a specific corrugated liner',
					action: 'Update a specific corrugated liner',
				},
			],
			noDataExpression: true,
		},
		...create.properties,
		...get.properties,
		...list.properties,
		...update.properties,
	];
	return [RESOURCE, properties];
}
