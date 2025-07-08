import {
  INodeExecutionData,
  INodeProperties,
  INodeType,
  INodeTypeDescription,

  IExecuteFunctions,
  NodeConnectionType,
} from 'n8n-workflow';

// Import all resource operations
import * as corrugatedMaterials from './Corrugated/CorrugatedMaterials/actions';
import * as corrugatedMaterialCompositions from './Corrugated/CorrugatedMaterialCompositions/actions';
import * as corrugatedMaterialCompositionPrices from './Corrugated/CorrugatedMaterialCompositionPrices/actions';
import * as corrugatedFormats from './Corrugated/CorrugatedFormats/actions';
import * as corrugatedSuppliers from './Corrugated/CorrugatedSuppliers/actions';
import * as corrugatedFlutes from './Corrugated/CorrugatedFlutes/actions';
import * as corrugatedLiners from './Corrugated/CorrugatedLiners/actions';
import * as projects from './Projects/actions';

export class hipe implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'hipe',
    name: 'hipe',
    icon: 'file:logo.svg',
    group: ['transform'],
    version: 1,
    subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
    description: 'Interact with HIPE API',
    defaults: {
      name: 'hipe',
      color: '#000000',
    },
    inputs: ['main'] as NodeConnectionType[],
    outputs: ['main'] as NodeConnectionType[],
    credentials: [
      {
        name: 'hipe',
        required: true,
      },
    ],
    properties: [
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        noDataExpression: true,
        options: [
          {
            name: 'Corrugated Material',
            value: 'corrugatedMaterial',
          },
          {
            name: 'Corrugated Material Composition',
            value: 'corrugatedMaterialComposition',
          },
          {
            name: 'Corrugated Material Composition Price',
            value: 'corrugatedMaterialCompositionPrice',
          },
          {
            name: 'Corrugated Format',
            value: 'corrugatedFormat',
          },
          {
            name: 'Corrugated Supplier',
            value: 'corrugatedSupplier',
          },
          {
            name: 'Corrugated Flute',
            value: 'corrugatedFlute',
          },
          {
            name: 'Corrugated Liner',
            value: 'corrugatedLiner',
          },
          {
            name: 'Project',
            value: 'project',
          },
        ],
        default: 'corrugatedMaterial',
      },
      // Operations will be dynamically loaded based on the selected resource
      ...this.getResourceOperations() as INodeProperties[],
      // Fields will be dynamically loaded based on the selected resource and operation
    ],
  };

  private getResourceOperations() {
    return [
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        displayOptions: {
          show: {
            resource: [
              'corrugatedMaterial',
            ],
          },
        },
        options: [
          {
            name: 'Create',
            value: 'create',
            description: 'Create a corrugated material',
            action: 'Create a corrugated material',
          },
          {
            name: 'Get',
            value: 'get',
            description: 'Get a corrugated material',
            action: 'Get a corrugated material',
          },
          {
            name: 'Get Many',
            value: 'getMany',
            description: 'Get many corrugated materials',
            action: 'Get many corrugated materials',
          },
          {
            name: 'Update',
            value: 'update',
            description: 'Update a corrugated material',
            action: 'Update a corrugated material',
          },
        ],
        default: 'getMany',
        noDataExpression: true,
      },
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        displayOptions: {
          show: {
            resource: [
              'corrugatedMaterialComposition',
            ],
          },
        },
        options: [
          {
            name: 'Create',
            value: 'create',
            description: 'Create a corrugated material composition',
            action: 'Create a corrugated material composition',
          },
          {
            name: 'Create Bulk',
            value: 'createBulk',
            description: 'Create multiple corrugated material compositions',
            action: 'Create multiple corrugated material compositions',
          },
          {
            name: 'Delete',
            value: 'delete',
            description: 'Delete a corrugated material composition',
            action: 'Delete a corrugated material composition',
          },
          {
            name: 'Get',
            value: 'get',
            description: 'Get a corrugated material composition',
            action: 'Get a corrugated material composition',
          },
          {
            name: 'Get Many',
            value: 'getMany',
            description: 'Get many corrugated material compositions',
            action: 'Get many corrugated material compositions',
          },
          {
            name: 'Update',
            value: 'update',
            description: 'Update a corrugated material composition',
            action: 'Update a corrugated material composition',
          },
        ],
        default: 'getMany',
        noDataExpression: true,
      },
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        displayOptions: {
          show: {
            resource: [
              'corrugatedMaterialCompositionPrice',
            ],
          },
        },
        options: [
          {
            name: 'Create',
            value: 'create',
            description: 'Create a corrugated material composition price',
            action: 'Create a corrugated material composition price',
          },
          {
            name: 'Create Bulk',
            value: 'createBulk',
            description: 'Create multiple corrugated material composition prices',
            action: 'Create multiple corrugated material composition prices',
          },
          {
            name: 'Delete',
            value: 'delete',
            description: 'Delete a corrugated material composition price',
            action: 'Delete a corrugated material composition price',
          },
          {
            name: 'Get',
            value: 'get',
            description: 'Get a corrugated material composition price',
            action: 'Get a corrugated material composition price',
          },
          {
            name: 'Get Many',
            value: 'getMany',
            description: 'Get many corrugated material composition prices',
            action: 'Get many corrugated material composition prices',
          },
          {
            name: 'Update',
            value: 'update',
            description: 'Update a corrugated material composition price',
            action: 'Update a corrugated material composition price',
          },
        ],
        default: 'getMany',
        noDataExpression: true,
      },
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        displayOptions: {
          show: {
            resource: [
              'corrugatedFormat',
            ],
          },
        },
        options: [
          {
            name: 'Create',
            value: 'create',
            description: 'Create a corrugated format',
            action: 'Create a corrugated format',
          },
          {
            name: 'Get',
            value: 'get',
            description: 'Get a corrugated format',
            action: 'Get a corrugated format',
          },
          {
            name: 'Get Many',
            value: 'getMany',
            description: 'Get many corrugated formats',
            action: 'Get many corrugated formats',
          },
          {
            name: 'Update',
            value: 'update',
            description: 'Update a corrugated format',
            action: 'Update a corrugated format',
          },
        ],
        default: 'getMany',
        noDataExpression: true,
      },
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        displayOptions: {
          show: {
            resource: [
              'corrugatedSupplier',
            ],
          },
        },
        options: [
          {
            name: 'Create',
            value: 'create',
            description: 'Create a corrugated supplier',
            action: 'Create a corrugated supplier',
          },
          {
            name: 'Get Many',
            value: 'getMany',
            description: 'Get many corrugated suppliers',
            action: 'Get many corrugated suppliers',
          },
          {
            name: 'Update',
            value: 'update',
            description: 'Update a corrugated supplier',
            action: 'Update a corrugated supplier',
          },
        ],
        default: 'getMany',
        noDataExpression: true,
      },
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        displayOptions: {
          show: {
            resource: [
              'corrugatedFlute',
            ],
          },
        },
        options: [
          {
            name: 'Create',
            value: 'create',
            description: 'Create a corrugated flute',
            action: 'Create a corrugated flute',
          },
          {
            name: 'Get',
            value: 'get',
            description: 'Get a corrugated flute',
            action: 'Get a corrugated flute',
          },
          {
            name: 'Get Many',
            value: 'getMany',
            description: 'Get many corrugated flutes',
            action: 'Get many corrugated flutes',
          },
          {
            name: 'Update',
            value: 'update',
            description: 'Update a corrugated flute',
            action: 'Update a corrugated flute',
          },
        ],
        default: 'getMany',
        noDataExpression: true,
      },
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        displayOptions: {
          show: {
            resource: [
              'corrugatedLiner',
            ],
          },
        },
        options: [
          {
            name: 'Create',
            value: 'create',
            description: 'Create a corrugated liner',
            action: 'Create a corrugated liner',
          },
          {
            name: 'Get',
            value: 'get',
            description: 'Get a corrugated liner',
            action: 'Get a corrugated liner',
          },
          {
            name: 'Get Many',
            value: 'getMany',
            description: 'Get many corrugated liners',
            action: 'Get many corrugated liners',
          },
          {
            name: 'Update',
            value: 'update',
            description: 'Update a corrugated liner',
            action: 'Update a corrugated liner',
          },
        ],
        default: 'getMany',
        noDataExpression: true,
      },
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        displayOptions: {
          show: {
            resource: [
              'project',
            ],
          },
        },
        options: [
          {
            name: 'Create',
            value: 'create',
            description: 'Create a project',
            action: 'Create a project',
          },
          {
            name: 'Get',
            value: 'get',
            description: 'Get a project',
            action: 'Get a project',
          },
          {
            name: 'Get Many',
            value: 'getMany',
            description: 'Get many projects',
            action: 'Get many projects',
          },
          {
            name: 'Update',
            value: 'update',
            description: 'Update a project',
            action: 'Update a project',
          },
        ],
        default: 'getMany',
        noDataExpression: true,
      },
    ];
  }

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const returnData: INodeExecutionData[] = [];
    const resource = this.getNodeParameter('resource', 0) as string;
    const operation = this.getNodeParameter('operation', 0) as string;
    
    let responseData;

    // Execute the appropriate operation based on the selected resource and operation
    switch (resource) {
      case 'corrugatedMaterial':
        switch (operation) {
          case 'create':
            responseData = await corrugatedMaterials.create.execute.call(this, items);
            break;
          case 'get':
            responseData = await corrugatedMaterials.get.execute.call(this, items);
            break;
          case 'getMany':
            responseData = await corrugatedMaterials.list.execute.call(this, items);
            break;
          case 'update':
            responseData = await corrugatedMaterials.update.execute.call(this, items);
            break;
          default:
            throw new Error(`The operation "${operation}" is not supported for resource "${resource}"!`);
        }
        break;
      case 'corrugatedMaterialComposition':
        switch (operation) {
          case 'create':
            responseData = await corrugatedMaterialCompositions.create.execute.call(this, items);
            break;
          case 'createBulk':
            responseData = await corrugatedMaterialCompositions.createBulk.execute.call(this, items);
            break;
          case 'delete':
            responseData = await corrugatedMaterialCompositions.delete.execute.call(this, items);
            break;
          case 'get':
            responseData = await corrugatedMaterialCompositions.get.execute.call(this, items);
            break;
          case 'getMany':
            responseData = await corrugatedMaterialCompositions.list.execute.call(this, items);
            break;
          case 'update':
            responseData = await corrugatedMaterialCompositions.update.execute.call(this, items);
            break;
          default:
            throw new Error(`The operation "${operation}" is not supported for resource "${resource}"!`);
        }
        break;
      case 'corrugatedMaterialCompositionPrice':
        switch (operation) {
          case 'create':
            responseData = await corrugatedMaterialCompositionPrices.create.execute.call(this, items);
            break;
          case 'createBulk':
            responseData = await corrugatedMaterialCompositionPrices.createBulk.execute.call(this, items);
            break;
          case 'delete':
            responseData = await corrugatedMaterialCompositionPrices.delete.execute.call(this, items);
            break;
          case 'get':
            responseData = await corrugatedMaterialCompositionPrices.get.execute.call(this, items);
            break;
          case 'getMany':
            responseData = await corrugatedMaterialCompositionPrices.list.execute.call(this, items);
            break;
          case 'update':
            responseData = await corrugatedMaterialCompositionPrices.update.execute.call(this, items);
            break;
          default:
            throw new Error(`The operation "${operation}" is not supported for resource "${resource}"!`);
        }
        break;
      case 'corrugatedFormat':
        switch (operation) {
          case 'create':
            responseData = await corrugatedFormats.create.execute.call(this, items);
            break;
          case 'get':
            responseData = await corrugatedFormats.get.execute.call(this, items);
            break;
          case 'getMany':
            responseData = await corrugatedFormats.list.execute.call(this, items);
            break;
          case 'update':
            responseData = await corrugatedFormats.update.execute.call(this, items);
            break;
          default:
            throw new Error(`The operation "${operation}" is not supported for resource "${resource}"!`);
        }
        break;
      case 'corrugatedSupplier':
        switch (operation) {
          case 'create':
            responseData = await corrugatedSuppliers.create.execute.call(this, items);
            break;
          case 'getMany':
            responseData = await corrugatedSuppliers.list.execute.call(this, items);
            break;
          case 'update':
            responseData = await corrugatedSuppliers.update.execute.call(this, items);
            break;
          default:
            throw new Error(`The operation "${operation}" is not supported for resource "${resource}"!`);
        }
        break;
      case 'corrugatedFlute':
        switch (operation) {
          case 'create':
            responseData = await corrugatedFlutes.create.execute.call(this, items);
            break;
          case 'get':
            responseData = await corrugatedFlutes.get.execute.call(this, items);
            break;
          case 'getMany':
            responseData = await corrugatedFlutes.list.execute.call(this, items);
            break;
          case 'update':
            responseData = await corrugatedFlutes.update.execute.call(this, items);
            break;
          default:
            throw new Error(`The operation "${operation}" is not supported for resource "${resource}"!`);
        }
        break;
      case 'corrugatedLiner':
        switch (operation) {
          case 'create':
            responseData = await corrugatedLiners.create.execute.call(this, items);
            break;
          case 'get':
            responseData = await corrugatedLiners.get.execute.call(this, items);
            break;
          case 'getMany':
            responseData = await corrugatedLiners.list.execute.call(this, items);
            break;
          case 'update':
            responseData = await corrugatedLiners.update.execute.call(this, items);
            break;
          default:
            throw new Error(`The operation "${operation}" is not supported for resource "${resource}"!`);
        }
        break;
      case 'project':
        switch (operation) {
          case 'create':
            responseData = await projects.create.execute.call(this, items);
            break;
          case 'get':
            responseData = await projects.get.execute.call(this, items);
            break;
          case 'getMany':
            responseData = await projects.list.execute.call(this, items);
            break;
          case 'update':
            responseData = await projects.update.execute.call(this, items);
            break;
          default:
            throw new Error(`The operation "${operation}" is not supported for resource "${resource}"!`);
        }
        break;
      default:
        throw new Error(`The resource "${resource}" is not supported!`);
    }

    // Return the response data
    if (Array.isArray(responseData)) {
      returnData.push(...responseData);
    } else {
      returnData.push({ json: responseData });
    }

    return [returnData];
  }
}
