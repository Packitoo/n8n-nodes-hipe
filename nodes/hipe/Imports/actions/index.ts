import * as list from './List';
import * as create from './Create';
import * as get from './Get';
import * as archive from './Archive';
import * as download from './Download';
import * as getTypes from './GetTypes';
import * as getStatus from './GetStatus';
import * as getDelimiters from './GetDelimiters';

export const RESOURCE = 'import';

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
            displayOptions: {
                show: { resource: [RESOURCE] },
            },
            options: [
                { name: 'Archive', value: 'archive', description: 'Archive a specific import', action: 'Archive a specific import' },
                { name: 'Create', value: 'create', description: 'Create a new import', action: 'Create a new import' },
                {
                    name: 'Download File',
                    value: 'download',
                    description: 'Download file for a specific import',
                    action: 'Download file for a specific import',
                },
                { name: 'Get', value: 'get', description: 'Get a specific import', action: 'Get a specific import' },
                {
                    name: 'Get Delimiters Enum',
                    value: 'getDelimiters',
                    description: 'Get import delimiters enum',
                    action: 'Get import delimiters enum',
                },
                {
                    name: 'Get Many',
                    value: 'getMany',
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
            default: 'getMany',
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
