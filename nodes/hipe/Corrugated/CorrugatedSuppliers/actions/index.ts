import * as create from './Create';
import * as list from './List';
import * as update from './Update';

export const RESOURCE = 'corrugatedSupplier';

export const ACTIONS = {
	create: create,
	getMany: list,
	update: update,
};

// Factory function to build all corrugated supplier properties for node usage
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
					description: 'Create a new corrugated supplier',
					action: 'Create',
				},
				{
					name: 'Get Many',
					value: 'getMany',
					description: 'Get multiple corrugated suppliers',
					action: 'Get many',
				},
				{
					name: 'Update',
					value: 'update',
					description: 'Update a specific corrugated supplier',
					action: 'Update',
				},
			],
			default: 'getMany',
			noDataExpression: true,
		},
		...create.properties,
		...list.properties,
		...update.properties,
	];
	return [RESOURCE, properties];
}
