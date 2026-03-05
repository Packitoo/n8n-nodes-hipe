import * as create from './Create';
import * as get from './Get';
import * as list from './List';
import * as update from './Update';
import { RESOURCES, OPERATIONS } from '../../../constants';

export const RESOURCE = RESOURCES.CORRUGATED_FORMAT;

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
			default: '',
			displayOptions: {
				show: { resource: [RESOURCE] },
			},
			options: [
				{
					name: 'Create',
					value: OPERATIONS.CREATE,
					description: 'Create a new corrugated format',
					action: 'Create a new corrugated format',
				},
				{
					name: 'Get',
					value: OPERATIONS.GET,
					description: 'Get a specific corrugated format',
					action: 'Get a specific corrugated format',
				},
				{
					name: 'Get Many',
					value: OPERATIONS.GET_MANY,
					description: 'Get multiple corrugated formats',
					action: 'Get multiple corrugated formats',
				},
				{
					name: 'Update',
					value: OPERATIONS.UPDATE,
					description: 'Update a specific corrugated format',
					action: 'Update a specific corrugated format',
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
