import * as create from './Create';
import * as get from './Get';
import * as list from './List';
import * as update from './Update';
import * as deleteOrderItem from './Delete';

export const RESOURCE = 'orderItem';

export const ACTIONS = {
	create: create,
	get: get,
	getMany: list,
	update: update,
	delete: deleteOrderItem,
};

// Factory function to build all order item properties for node usage
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
					description: 'Create a new order item',
					action: 'Create a new order item',
				},
				{
					name: 'Delete',
					value: 'delete',
					description: 'Delete an order item',
					action: 'Delete an order item',
				},
				{
					name: 'Get',
					value: 'get',
					description: 'Get a specific order item',
					action: 'Get a specific order item',
				},
				{
					name: 'Get Many',
					value: 'getMany',
					description: 'Get multiple order items',
					action: 'Get multiple order items',
				},
				{
					name: 'Update',
					value: 'update',
					description: 'Update an order item',
					action: 'Update an order item',
				},
			],
			default: 'getMany',
			noDataExpression: true,
		},
		...create.properties,
		...get.properties,
		...list.properties,
		...update.properties,
		...deleteOrderItem.properties,
	];
	return [RESOURCE, properties];
}
