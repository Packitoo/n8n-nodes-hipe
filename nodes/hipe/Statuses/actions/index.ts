import * as create from './Create';
import * as list from './List';
import * as update from './Update';
import * as remove from './Delete';

export const RESOURCE = 'statuses';

export const ACTIONS = {
  create: create,
  getMany: list,
  update: update,
  delete: remove,
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
        { name: 'Create', value: 'create', description: 'Create a new status', action: 'Create' },
        { name: 'Get Many', value: 'getMany', description: 'Get statuses for a given entity', action: 'Get many' },
        { name: 'Update', value: 'update', description: 'Update a specific status', action: 'Update' },
        { name: 'Delete', value: 'delete', description: 'Delete a specific status', action: 'Delete' },
      ],
      default: 'getMany',
      noDataExpression: true,
    },
    ...create.properties,
    ...list.properties,
    ...update.properties,
    ...remove.properties,
  ];
  return [RESOURCE, properties];
}
