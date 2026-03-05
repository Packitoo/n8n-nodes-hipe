import * as create from './Create';
import * as get from './Get';
import * as list from './List';
import * as update from './Update';
import { RESOURCES, OPERATIONS } from '../../../constants';

export const RESOURCE = RESOURCES.CORRUGATED_FLUTE;

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
			default: '',
			displayOptions: {
				show: { resource: [RESOURCE] },
			},
			options: [
				{
					name: 'Create',
					value: OPERATIONS.CREATE,
					description: 'Create a new corrugated flute',
					action: 'Create a new corrugated flute',
				},
				{
					name: 'Get',
					value: OPERATIONS.GET,
					description: 'Get a specific corrugated flute',
					action: 'Get a specific corrugated flute',
				},
				{
					name: 'Get Many',
					value: OPERATIONS.GET_MANY,
					description: 'Get multiple corrugated flutes',
					action: 'Get multiple corrugated flutes',
				},
				{
					name: 'Update',
					value: OPERATIONS.UPDATE,
					description: 'Update a specific corrugated flute',
					action: 'Update a specific corrugated flute',
				},
			],
			default: OPERATIONS.GET_MANY,
			noDataExpression: true,
		},
		...create.properties,
		...get.properties,
		...list.properties,
		...update.properties,
	];
	return [RESOURCE, properties];
}
