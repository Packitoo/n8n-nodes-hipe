import * as create from './Create';
import * as get from './Get';
import * as list from './List';
import * as update from './Update';
import * as uploadFile from './UploadFile';
import * as getFiles from './GetFiles';
import { RESOURCES, OPERATIONS } from '../../constants';

export const RESOURCE = RESOURCES.PROJECT;

export const ACTIONS = {
	create: create,
	get: get,
	getMany: list,
	update: update,
	uploadFile: uploadFile,
	getFiles: getFiles,
};

// Factory function to build all user properties for node usage
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
					description: 'Create a new project',
					action: 'Create a new project',
				},
				{
					name: 'Get',
					value: OPERATIONS.GET,
					description: 'Get a specific project',
					action: 'Get a specific project',
				},
				{
					name: 'Get Files',
					value: OPERATIONS.GET_FILES,
					description: 'Retrieve files for a project',
					action: 'Retrieve files for a project',
				},
				{
					name: 'Get Many',
					value: OPERATIONS.GET_MANY,
					description: 'Get multiple projects',
					action: 'Get multiple projects',
				},
				{
					name: 'Update',
					value: OPERATIONS.UPDATE,
					description: 'Update a specific project',
					action: 'Update a specific project',
				},
				{
					name: 'Upload File',
					value: OPERATIONS.UPLOAD_FILE,
					description: 'Upload a file to a project',
					action: 'Upload a file to a project',
				},
			],
			noDataExpression: true,
		},
		...create.properties,
		...get.properties,
		...list.properties,
		...update.properties,
		...uploadFile.properties,
		...getFiles.properties,
	];
	return [RESOURCE, properties];
}
