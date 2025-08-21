import * as create from './Create';
import * as get from './Get';
import * as list from './List';
import * as update from './Update';

export const RESOURCE = 'corrugatedMaterial';

export const ACTIONS = {
	create: create,
	get: get,
	getMany: list,
	update: update,
};

// Factory function to build all corrugated material properties for node usage
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
					description: 'Create a new corrugated material',
					action: 'Create a new corrugated material',
				},
				{
					name: 'Get',
					value: 'get',
					description: 'Get a specific corrugated material',
					action: 'Get a specific corrugated material',
				},
				{
					name: 'Get Many',
					value: 'getMany',
					description: 'Get multiple corrugated materials',
					action: 'Get multiple corrugated materials',
				},
				{
					name: 'Update',
					value: 'update',
					description: 'Update a specific corrugated material',
					action: 'Update a specific corrugated material',
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
