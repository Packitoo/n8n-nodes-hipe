import * as create from './Create';
import * as list from './List';
import * as update from './Update';
import { RESOURCES, OPERATIONS } from '../../../constants';

export const RESOURCE = RESOURCES.CORRUGATED_SUPPLIER;

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
			default: '',
			displayOptions: {
				show: { resource: [RESOURCE] },
			},
			options: [
				{
					name: 'Create',
					value: OPERATIONS.CREATE,
					description: 'Create a new corrugated supplier',
					action: 'Create a new corrugated supplier',
				},
				{
					name: 'Get Many',
					value: OPERATIONS.GET_MANY,
					description: 'Get multiple corrugated suppliers',
					action: 'Get multiple corrugated suppliers',
				},
				{
					name: 'Update',
					value: OPERATIONS.UPDATE,
					description: 'Update a specific corrugated supplier',
					action: 'Update a specific corrugated supplier',
				},
			],
			default: OPERATIONS.GET_MANY,
			noDataExpression: true,
		},
		...create.properties,
		...list.properties,
		...update.properties,
	];
	return [RESOURCE, properties];
}
