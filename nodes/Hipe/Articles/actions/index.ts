import { RESOURCES, OPERATIONS } from '../../constants';
import * as create from './Create';
import * as get from './Get';
import * as list from './List';
import * as update from './Update';
import * as getFiles from './GetFiles';
import * as uploadFile from './UploadFile';
import * as deleteFile from './DeleteFile';
import * as setPreview from './SetPreview';
import * as deleteArticle from './Delete';
import * as addBriefElement from './AddBriefElement';

export const RESOURCE = RESOURCES.ARTICLE;

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
	addBriefElement: addBriefElement,
};

// Factory function to build all article properties for node usage
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
					name: 'Add Brief Element',
					value: OPERATIONS.ADD_BRIEF_ELEMENT,
					description: 'Add a brief element to an article',
					action: 'Add a brief element to an article',
				},
				{
					name: 'Create',
					value: OPERATIONS.CREATE,
					description: 'Create a new article',
					action: 'Create a new article',
				},
				{
					name: 'Delete',
					value: OPERATIONS.DELETE,
					description: 'Delete an article',
					action: 'Delete an article',
				},
				{
					name: 'Delete File',
					value: OPERATIONS.DELETE_FILE,
					description: 'Delete a file from an article',
					action: 'Delete a file from an article',
				},
				{
					name: 'Get',
					value: OPERATIONS.GET,
					description: 'Get a specific article',
					action: 'Get a specific article',
				},
				{
					name: 'Get Files',
					value: OPERATIONS.GET_FILES,
					description: 'Retrieve files for an article',
					action: 'Retrieve files for an article',
				},
				{
					name: 'Get Many',
					value: OPERATIONS.GET_MANY,
					description: 'Get multiple articles',
					action: 'Get multiple articles',
				},
				{
					name: 'Set Preview',
					value: OPERATIONS.SET_PREVIEW,
					description: 'Set a file as the preview image for an article',
					action: 'Set a file as the preview image for an article',
				},
				{
					name: 'Update',
					value: OPERATIONS.UPDATE,
					description: 'Update a specific article',
					action: 'Update a specific article',
				},
				{
					name: 'Upload File',
					value: OPERATIONS.UPLOAD_FILE,
					description: 'Upload a file to an article',
					action: 'Upload a file to an article',
				},
			],
			default: OPERATIONS.GET_MANY,
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
		...addBriefElement.properties,
	];
	return [RESOURCE, properties];
}
