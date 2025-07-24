import * as create from './Create';
import * as get from './Get';
import * as list from './List';
import * as update from './Update';
import * as linkContact from './linkContact';
import * as unlinkContact from './unlinkContact';
import * as getAddressess from './getAddresses';
// import * as createAddress from './createAddress';

export const RESOURCE = 'company';

export const ACTIONS = {
  create: create,
  get: get,
  getMany: list,
  update: update,
  linkContact: linkContact,
  unlinkContact: unlinkContact,
  getAddressess: getAddressess,
  // createAddress: createAddress,
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
        { name: 'Create', value: 'create', description: 'Create a new company', action: 'Create' },
        { name: 'Get', value: 'get', description: 'Get a specific company', action: 'Get' },
        { name: 'Get Many', value: 'getMany', description: 'Get multiple companies', action: 'Get many' },
        { name: 'Update', value: 'update', description: 'Update a specific company', action: 'Update' },
        { name: 'Link Contact', value: 'linkContact', description: 'Link an existing contact to a company', action: 'Link contact' },
        { name: 'Unlink Contact', value: 'unlinkContact', description: 'Unlink a contact from a company', action: 'Unlink contact' },
        { name: 'Get Addresses', value: 'getAddresses', description: 'Get addresses of a company', action: 'Get addresses' },
        // { name: 'Create Address', value: 'createAddress', description: 'Create a new address for a company', action: 'Create address' },
      ],
      default: 'get',
      noDataExpression: true,
    },
    ...create.properties,
    ...get.properties,
    ...list.properties,
    ...update.properties,
    ...linkContact.properties,
    ...unlinkContact.properties,
    ...getAddressess.properties,
    // ...createAddress.properties,
  ];
  return [RESOURCE, properties];
}
