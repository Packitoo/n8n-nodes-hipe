import * as create from './Create';
import * as get from './Get';
import * as list from './List';
import * as update from './Update';
import * as uploadFile from './UploadFile';
import * as getFiles from './GetFiles';

export const RESOURCE = 'project';

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
			displayOptions: {
				show: { resource: [RESOURCE] },
			},
			options: [
				{ name: 'Create', value: 'create', description: 'Create a new project', action: 'Create a new project' },
				{ name: 'Get', value: 'get', description: 'Get a specific project', action: 'Get a specific project' },
				{
					name: 'Get Files',
					value: 'getFiles',
					description: 'Retrieve files for a project',
					action: 'Retrieve files for a project',
				},
				{
					name: 'Get Many',
					value: 'getMany',
					description: 'Get multiple projects',
					action: 'Get multiple projects',
				},
				{
					name: 'Update',
					value: 'update',
					description: 'Update a specific project',
					action: 'Update a specific project',
				},
				{
					name: 'Upload File',
					value: 'uploadFile',
					description: 'Upload a file to a project',
					action: 'Upload a file to a project',
				},
			],
			default: 'getMany',
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
