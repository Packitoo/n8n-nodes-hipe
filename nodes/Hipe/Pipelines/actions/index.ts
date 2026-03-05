import * as list from './List';
import * as get from './Get';
import { RESOURCES, OPERATIONS } from '../../constants';

export const RESOURCE = RESOURCES.PIPELINES;

export const ACTIONS = {
	getMany: list,
	get: get,
};

// Factory function to build all user properties for node usage
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
					name: 'Get Many',
					value: OPERATIONS.GET_MANY,
					description: 'Get pipelines for a given entity',
					action: 'Get pipelines for a given entity',
				},
				{
					name: 'Get',
					value: OPERATIONS.GET,
					description: 'Get a specific pipeline',
					action: 'Get a specific pipeline',
				},
			],
			default: OPERATIONS.GET_MANY,
			noDataExpression: true,
		},
		...list.properties,
		...get.properties,
	];
	return [RESOURCE, properties];
}
