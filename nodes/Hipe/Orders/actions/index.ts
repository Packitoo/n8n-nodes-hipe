import * as create from './Create';
import * as get from './Get';
import * as list from './List';
import * as update from './Update';
import * as getFiles from './GetFiles';
import * as uploadFile from './UploadFile';
import * as deleteFile from './DeleteFile';
import * as addItems from './AddItems';
import * as removeItem from './RemoveItem';
import * as deleteOrder from './Delete';

export const RESOURCE = 'order';

export const ACTIONS = {
	create: create,
	get: get,
	getMany: list,
	update: update,
	getFiles: getFiles,
	uploadFile: uploadFile,
	deleteFile: deleteFile,
	addItems: addItems,
	removeItem: removeItem,
	delete: deleteOrder,
};

// Factory function to build all order properties for node usage
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
					name: 'Add Items',
					value: 'addItems',
					description: 'Add items to an order',
					action: 'Add items to an order',
				},
				{
					name: 'Create',
					value: 'create',
					description: 'Create a new order',
					action: 'Create a new order',
				},
				{
					name: 'Delete',
					value: 'delete',
					description: 'Delete an order',
					action: 'Delete an order',
				},
				{
					name: 'Delete File',
					value: 'deleteFile',
					description: 'Delete a file from an order',
					action: 'Delete a file from an order',
				},
				{
					name: 'Get',
					value: 'get',
					description: 'Get a specific order',
					action: 'Get a specific order',
				},
				{
					name: 'Get Files',
					value: 'getFiles',
					description: 'Retrieve files for an order',
					action: 'Retrieve files for an order',
				},
				{
					name: 'Get Many',
					value: 'getMany',
					description: 'Get multiple orders',
					action: 'Get multiple orders',
				},
				{
					name: 'Remove Item',
					value: 'removeItem',
					description: 'Remove an item from an order',
					action: 'Remove an item from an order',
				},
				{
					name: 'Update',
					value: 'update',
					description: 'Update a specific order',
					action: 'Update a specific order',
				},
				{
					name: 'Upload File',
					value: 'uploadFile',
					description: 'Upload a file to an order',
					action: 'Upload a file to an order',
				},
			],
			default: 'getMany',
			noDataExpression: true,
		},
		...create.properties,
		...get.properties,
		...list.properties,
		...update.properties,
		...getFiles.properties,
		...uploadFile.properties,
		...deleteFile.properties,
		...addItems.properties,
		...removeItem.properties,
		...deleteOrder.properties,
	];
	return [RESOURCE, properties];
}
