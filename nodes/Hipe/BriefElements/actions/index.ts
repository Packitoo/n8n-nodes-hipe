import * as create from './Create';
import * as get from './Get';
import * as list from './List';
import * as update from './Update';
import * as deleteBriefElement from './Delete';
import { RESOURCES, OPERATIONS } from '../../constants';

export const RESOURCE = RESOURCES.BRIEF_ELEMENT;

export const ACTIONS = {
	create: create,
	get: get,
	getMany: list,
	update: update,
	delete: deleteBriefElement,
};

// Factory function to build all brief element properties for node usage
export function buildProperties() {
	const properties = [
		{
			displayName: 'Operation',
			name: 'operation',
			type: 'options',
			default: OPERATIONS.GET_MANY,
			displayOptions: {
				show: { resource: [RESOURCE] },
			},
			options: [
				{
					name: 'Create',
					value: OPERATIONS.CREATE,
					description: 'Create a new brief element',
					action: 'Create a new brief element',
				},
				{
					name: 'Delete',
					value: OPERATIONS.DELETE,
					description: 'Delete a brief element',
					action: 'Delete a brief element',
				},
				{
					name: 'Get',
					value: OPERATIONS.GET,
					description: 'Get a specific brief element',
					action: 'Get a specific brief element',
				},
				{
					name: 'Get Many',
					value: OPERATIONS.GET_MANY,
					description: 'Get multiple brief elements',
					action: 'Get multiple brief elements',
				},
				{
					name: 'Update',
					value: OPERATIONS.UPDATE,
					description: 'Update a specific brief element',
					action: 'Update a specific brief element',
				},
			],
			noDataExpression: true,
		},
		...create.properties,
		...get.properties,
		...list.properties,
		...update.properties,
		...deleteBriefElement.properties,
	];
	return [RESOURCE, properties];
}
