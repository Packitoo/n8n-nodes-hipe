import * as create from './Create';
import * as get from './Get';
import * as list from './List';
import * as update from './Update';

export const RESOURCE = 'corrugatedLiner';

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
			displayOptions: {
				show: { resource: [RESOURCE] },
			},
			options: [
				{
					name: 'Create',
					value: 'create',
					description: 'Create a new corrugated liner',
					action: 'Create a new corrugated liner',
				},
				{
					name: 'Get',
					value: 'get',
					description: 'Get a specific corrugated liner',
					action: 'Get a specific corrugated liner',
				},
				{
					name: 'Get Many',
					value: 'getMany',
					description: 'Get multiple corrugated liners',
					action: 'Get multiple corrugated liners',
				},
				{
					name: 'Update',
					value: 'update',
					description: 'Update a specific corrugated liner',
					action: 'Update a specific corrugated liner',
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
