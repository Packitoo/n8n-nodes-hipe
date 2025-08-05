import * as create from './Create';
import * as get from './Get';
import * as list from './List';
import * as update from './Update';

export const RESOURCE = 'corrugatedFlute';

export const ACTIONS = {
	create: create,
	get: get,
	getMany: list,
	update: update,
};

// Factory function to build all corrugated flute properties for node usage
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
					description: 'Create a new corrugated flute',
					action: 'Create',
				},
				{
					name: 'Get',
					value: 'get',
					description: 'Get a specific corrugated flute',
					action: 'Get',
				},
				{
					name: 'Get Many',
					value: 'getMany',
					description: 'Get multiple corrugated flutes',
					action: 'Get many',
				},
				{
					name: 'Update',
					value: 'update',
					description: 'Update a specific corrugated flute',
					action: 'Update',
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
