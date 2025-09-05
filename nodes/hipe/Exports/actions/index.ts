import * as list from './List';
import * as create from './Create';
import * as get from './Get';
import * as archive from './Archive';
import * as download from './Download';
import * as getTypes from './GetTypes';
import * as getStatus from './GetStatus';

export const RESOURCE = 'export';

export const ACTIONS = {
    create: create,
    get: get,
    getMany: list,
    archive: archive,
    download: download,
    getTypes: getTypes,
    getStatus: getStatus,
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
                { name: 'Archive', value: 'archive', description: 'Archive a specific export', action: 'Archive a specific export' },
                { name: 'Create', value: 'create', description: 'Create a new export', action: 'Create a new export' },
                {
                    name: 'Download File',
                    value: 'download',
                    description: 'Download file for a specific export',
                    action: 'Download file for a specific export',
                },
                { name: 'Get', value: 'get', description: 'Get a specific export', action: 'Get a specific export' },
                {
                    name: 'Get Many',
                    value: 'getMany',
                    description: 'Get multiple exports',
                    action: 'Get multiple exports',
                },
                {
                    name: 'Get Status Enum',
                    value: 'getStatus',
                    description: 'Get export status enum',
                    action: 'Get export status enum',
                },
                {
                    name: 'Get Types Enum',
                    value: 'getTypes',
                    description: 'Get export types enum',
                    action: 'Get export types enum',
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
    ];
    return [RESOURCE, properties];
}
