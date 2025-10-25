import * as create from './Create';
import * as createBulk from './CreateBulk';
import * as get from './Get';
import * as list from './List';
import * as update from './Update';
import * as del from './Delete';

export const RESOURCE = 'corrugatedMaterialComposition';

export const ACTIONS = {
	create: create,
	createBulk: createBulk,
	get: get,
	getMany: list,
	update: update,
	delete: del,
};

// Factory function to build all corrugated material composition properties for node usage
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
					description: 'Create a new corrugated material composition',
					action: 'Create a new corrugated material composition',
				},
				{
					name: 'Create Bulk',
					value: 'createBulk',
					description: 'Create multiple corrugated material compositions',
					action: 'Create multiple corrugated material compositions',
				},
				{
					name: 'Delete',
					value: 'delete',
					description: 'Delete a specific corrugated material composition',
					action: 'Delete a specific corrugated material composition',
				},
				{
					name: 'Get',
					value: 'get',
					description: 'Get a specific corrugated material composition',
					action: 'Get a specific corrugated material composition',
				},
				{
					name: 'Get Many',
					value: 'getMany',
					description: 'Get multiple corrugated material compositions',
					action: 'Get multiple corrugated material compositions',
				},
				{
					name: 'Update',
					value: 'update',
					description: 'Update a specific corrugated material composition',
					action: 'Update a specific corrugated material composition',
				},
			],
			default: 'getMany',
			noDataExpression: true,
		},
		...create.properties,
		...createBulk.properties,
		...get.properties,
		...list.properties,
		...update.properties,
		...del.properties,
	];
	return [RESOURCE, properties];
}
