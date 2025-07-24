import * as create from './Create';
import * as createBulk from './CreateBulk';
import * as get from './Get';
import * as list from './List';
import * as update from './Update';
import * as del from './Delete';

export const RESOURCE = 'corrugatedMaterialCompositionPrice';

export const ACTIONS = {
  create: create,
  createBulk: createBulk,
  get: get,
  getMany: list,
  update: update,
  delete: del,
};

// Factory function to build all corrugated material composition price properties for node usage
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
        { name: 'Create', value: 'create', description: 'Create a new corrugated material composition price', action: 'Create' },
        { name: 'Create Bulk', value: 'createBulk', description: 'Create multiple corrugated material composition prices', action: 'Create bulk' },
        { name: 'Get', value: 'get', description: 'Get a specific corrugated material composition price', action: 'Get' },
        { name: 'Get Many', value: 'getMany', description: 'Get multiple corrugated material composition prices', action: 'Get many' },
        { name: 'Update', value: 'update', description: 'Update a specific corrugated material composition price', action: 'Update' },
        { name: 'Delete', value: 'delete', description: 'Delete a specific corrugated material composition price', action: 'Delete' },
      ],
      default: 'getMany',
      noDataExpression: true,
    },
    ...create.properties,
    ...createBulk.properties,
    ...get.properties,
    ...list.properties,
    ...update.properties,
    ...del.properties,
  ];
  return [RESOURCE, properties];
}
