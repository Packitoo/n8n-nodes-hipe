import * as list from './List';
import * as create from './Create';
import * as get from './Get';
import * as archive from './Archive';
import * as download from './Download';
import * as getTypes from './GetTypes';
import * as getStatus from './GetStatus';
import * as getDelimiters from './GetDelimiters';
import { RESOURCES, OPERATIONS } from '../../constants';

export const RESOURCE = RESOURCES.IMPORT;

export const ACTIONS = {
	create: create,
	get: get,
	getMany: list,
	archive: archive,
	download: download,
	getTypes: getTypes,
	getStatus: getStatus,
	getDelimiters: getDelimiters,
};

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
					name: 'Archive',
					value: OPERATIONS.ARCHIVE,
					description: 'Archive a specific import',
					action: 'Archive a specific import',
				},
				{
					name: 'Create',
					value: OPERATIONS.CREATE,
					description: 'Create a new import',
					action: 'Create a new import',
				},
				{
					name: 'Download File',
					value: OPERATIONS.DOWNLOAD,
					description: 'Download file for a specific import',
					action: 'Download file for a specific import',
				},
				{
					name: 'Get',
					value: OPERATIONS.GET,
					description: 'Get a specific import',
					action: 'Get a specific import',
				},
				{
					name: 'Get Delimiters Enum',
					value: 'getDelimiters',
					description: 'Get import delimiters enum',
					action: 'Get import delimiters enum',
				},
				{
					name: 'Get Many',
					value: OPERATIONS.GET_MANY,
					description: 'Get multiple imports',
					action: 'Get multiple imports',
				},
				{
					name: 'Get Status Enum',
					value: 'getStatus',
					description: 'Get import status enum',
					action: 'Get import status enum',
				},
				{
					name: 'Get Types Enum',
					value: 'getTypes',
					description: 'Get import types enum',
					action: 'Get import types enum',
				},
			],
			noDataExpression: true,
		},
		...create.properties,
		...get.properties,
		...list.properties,
		...archive.properties,
		...download.properties,
		...getTypes.properties,
		...getStatus.properties,
		...getDelimiters.properties,
	];
	return [RESOURCE, properties];
}
