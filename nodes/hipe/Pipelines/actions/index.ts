import * as list from './List';
import * as get from './Get';

export const RESOURCE = 'pipelines';

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
			displayOptions: {
				show: { resource: [RESOURCE] },
			},
			options: [
				{
					name: 'Get Many',
					value: 'getMany',
					description: 'Get pipelines for a given entity',
					action: 'Get pipelines for a given entity',
				},
				{
					name: 'Get',
					value: 'get',
					description: 'Get a specific pipeline',
					action: 'Get a specific pipeline',
				},
			],
			default: 'getMany',
			noDataExpression: true,
		},
		...list.properties,
		...get.properties,
	];
	return [RESOURCE, properties];
}
