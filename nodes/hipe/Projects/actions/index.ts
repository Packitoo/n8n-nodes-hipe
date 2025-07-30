import * as create from './Create';
import * as get from './Get';
import * as list from './List';
import * as update from './Update';

export const RESOURCE = 'project';

export const ACTIONS = {
  create: create,
  get: get,
  getMany: list,
  update: update,
}

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
        { name: 'Create', value: 'create', description: 'Create a new project', action: 'Create' },
        { name: 'Get', value: 'get', description: 'Get a specific project', action: 'Get' },
        { name: 'Get Many', value: 'getMany', description: 'Get multiple projects', action: 'Get many' },
        { name: 'Update', value: 'update', description: 'Update a specific project', action: 'Update' },
      ],
      default: 'getMany',
      noDataExpression: true,
    },
    ...create.properties,
    ...get.properties,
    ...list.properties,
    ...update.properties,
  ];
  return [RESOURCE, properties];
}
