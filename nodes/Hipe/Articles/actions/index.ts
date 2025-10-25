import * as create from './Create';
import * as get from './Get';
import * as list from './List';
import * as update from './Update';
import * as getFiles from './GetFiles';
import * as uploadFile from './UploadFile';
import * as deleteFile from './DeleteFile';
import * as setPreview from './SetPreview';
import * as deleteArticle from './Delete';

export const RESOURCE = 'article';

export const ACTIONS = {
	create: create,
	get: get,
	getMany: list,
	update: update,
	getFiles: getFiles,
	uploadFile: uploadFile,
	deleteFile: deleteFile,
	setPreview: setPreview,
	delete: deleteArticle,
};

// Factory function to build all article properties for node usage
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
					description: 'Create a new article',
					action: 'Create a new article',
				},
				{
					name: 'Delete',
					value: 'delete',
					description: 'Delete an article',
					action: 'Delete an article',
				},
				{
					name: 'Delete File',
					value: 'deleteFile',
					description: 'Delete a file from an article',
					action: 'Delete a file from an article',
				},
				{
					name: 'Get',
					value: 'get',
					description: 'Get a specific article',
					action: 'Get a specific article',
				},
				{
					name: 'Get Files',
					value: 'getFiles',
					description: 'Retrieve files for an article',
					action: 'Retrieve files for an article',
				},
				{
					name: 'Get Many',
					value: 'getMany',
					description: 'Get multiple articles',
					action: 'Get multiple articles',
				},
				{
					name: 'Set Preview',
					value: 'setPreview',
					description: 'Set a file as the preview image for an article',
					action: 'Set a file as the preview image for an article',
				},
				{
					name: 'Update',
					value: 'update',
					description: 'Update a specific article',
					action: 'Update a specific article',
				},
				{
					name: 'Upload File',
					value: 'uploadFile',
					description: 'Upload a file to an article',
					action: 'Upload a file to an article',
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
		...setPreview.properties,
		...deleteArticle.properties,
	];
	return [RESOURCE, properties];
}
