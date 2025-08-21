import * as create from './Create';
import * as get from './Get';
import * as list from './List';
import * as update from './Update';

export const RESOURCE = 'corrugatedFormat';

export const ACTIONS = {
	create: create,
	get: get,
	getMany: list,
	update: update,
};

// Factory function to build all corrugated format properties for node usage
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
					description: 'Create a new corrugated format',
					action: 'Create a new corrugated format',
				},
				{
					name: 'Get',
					value: 'get',
					description: 'Get a specific corrugated format',
					action: 'Get a specific corrugated format',
				},
				{
					name: 'Get Many',
					value: 'getMany',
					description: 'Get multiple corrugated formats',
					action: 'Get multiple corrugated formats',
				},
				{
					name: 'Update',
					value: 'update',
					description: 'Update a specific corrugated format',
					action: 'Update a specific corrugated format',
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
