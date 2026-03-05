import * as create from './Create';
import * as get from './Get';
import * as list from './List';
import * as update from './Update';
import { RESOURCES, OPERATIONS } from '../../../constants';

export const RESOURCE = RESOURCES.CORRUGATED_MATERIAL;

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
			default: '',
			displayOptions: {
				show: { resource: [RESOURCE] },
			},
			options: [
				{
					name: 'Create',
					value: OPERATIONS.CREATE,
					description: 'Create a new corrugated material',
					action: 'Create a new corrugated material',
				},
				{
					name: 'Get',
					value: OPERATIONS.GET,
					description: 'Get a specific corrugated material',
					action: 'Get a specific corrugated material',
				},
				{
					name: 'Get Many',
					value: OPERATIONS.GET_MANY,
					description: 'Get multiple corrugated materials',
					action: 'Get multiple corrugated materials',
				},
				{
					name: 'Update',
					value: OPERATIONS.UPDATE,
					description: 'Update a specific corrugated material',
					action: 'Update a specific corrugated material',
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
