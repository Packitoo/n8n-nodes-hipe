import {
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	IExecuteFunctions,
	NodeConnectionType,
  INodeProperties,
} from 'n8n-workflow';

// Import all resource operations
// import * as corrugatedMaterials from './Corrugated/CorrugatedMaterials/actions';
// import * as corrugatedMaterialCompositions from './Corrugated/CorrugatedMaterialCompositions/actions';
// import * as corrugatedMaterialCompositionPrices from './Corrugated/CorrugatedMaterialCompositionPrices/actions';
// import * as corrugatedFormats from './Corrugated/CorrugatedFormats/actions';
// import * as corrugatedSuppliers from './Corrugated/CorrugatedSuppliers/actions';
// import * as corrugatedFlutes from './Corrugated/CorrugatedFlutes/actions';
// import * as corrugatedLiners from './Corrugated/CorrugatedLiners/actions';
// import * as projects from './Projects/actions';
import * as users from './Users/actions';

const EMBEDDED_RESOURCES = [
  users,
];

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
		properties: this.buildProperties(EMBEDDED_RESOURCES),
	};

	buildProperties(embeddedResources: any[]) {
		const properties = [];
		const resource: INodeProperties = {
			displayName: 'Resource',
			name: 'resource',
			type: 'options',
			noDataExpression: true,
			options: [],
      default: '',
		};

    if (embeddedResources.length > 0) {
      resource.default = embeddedResources[0].RESOURCE;
    }

    for (const embeddedResource of embeddedResources) {
      const [resourceName, resourceProperties] = embeddedResource.buildProperties();
      resource.options?.push({
        name: resourceName,
        value: resourceName,
      });
      properties.push(...resourceProperties);
    }
		properties.push(resource);
		return properties;
	}

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    // const returnData: INodeExecutionData[] = [];
    const resource = this.getNodeParameter('resource', 0) as string;
    const operation = this.getNodeParameter('operation', 0) as string;
  
    // Find the correct embedded resource
    const embeddedResource = EMBEDDED_RESOURCES.find(r => r.RESOURCE === resource);
    if (!embeddedResource) {
      throw new Error(`Resource "${resource}" not found!`);
    }
  
    // Find the correct action
    const action = embeddedResource.ACTIONS[operation as keyof typeof embeddedResource.ACTIONS];
    if (!action || typeof action.execute !== 'function') {
      throw new Error(`Operation "${operation}" not found for resource "${resource}"!`);
    }
  
    // Call the action's execute
    const result = await action.execute.call(this, items);
  
    // Normalize result for n8n
    if (Array.isArray(result)) {
      return [result];
    }
    return [[{ json: result }]];
  }

// 	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
// 		const items = this.getInputData();
// 		const returnData: INodeExecutionData[] = [];
// 		const resource = this.getNodeParameter('resource', 0) as string;
// 		const operation = this.getNodeParameter('operation', 0) as string;

// 		let responseData;

// 		// Execute the appropriate operation based on the selected resource and operation
// 		switch (resource) {
// 			case 'corrugatedMaterial':
// 				switch (operation) {
// 					case 'create':
// 						responseData = await corrugatedMaterials.create.execute.call(this, items);
// 						break;
// 					case 'get':
// 						responseData = await corrugatedMaterials.get.execute.call(this, items);
// 						break;
// 					case 'getMany':
// 						responseData = await corrugatedMaterials.list.execute.call(this, items);
// 						break;
// 					case 'update':
// 						responseData = await corrugatedMaterials.update.execute.call(this, items);
// 						break;
// 					default:
// 						throw new Error(
// 							`The operation "${operation}" is not supported for resource "${resource}"!`,
// 						);
// 				}
// 				break;
// 			case 'corrugatedMaterialComposition':
// 				switch (operation) {
// 					case 'create':
// 						responseData = await corrugatedMaterialCompositions.create.execute.call(this, items);
// 						break;
// 					case 'createBulk':
// 						responseData = await corrugatedMaterialCompositions.createBulk.execute.call(
// 							this,
// 							items,
// 						);
// 						break;
// 					case 'delete':
// 						responseData = await corrugatedMaterialCompositions.delete.execute.call(this, items);
// 						break;
// 					case 'get':
// 						responseData = await corrugatedMaterialCompositions.get.execute.call(this, items);
// 						break;
// 					case 'getMany':
// 						responseData = await corrugatedMaterialCompositions.list.execute.call(this, items);
// 						break;
// 					case 'update':
// 						responseData = await corrugatedMaterialCompositions.update.execute.call(this, items);
// 						break;
// 					default:
// 						throw new Error(
// 							`The operation "${operation}" is not supported for resource "${resource}"!`,
// 						);
// 				}
// 				break;
// 			case 'corrugatedMaterialCompositionPrice':
// 				switch (operation) {
// 					case 'create':
// 						responseData = await corrugatedMaterialCompositionPrices.create.execute.call(
// 							this,
// 							items,
// 						);
// 						break;
// 					case 'createBulk':
// 						responseData = await corrugatedMaterialCompositionPrices.createBulk.execute.call(
// 							this,
// 							items,
// 						);
// 						break;
// 					case 'delete':
// 						responseData = await corrugatedMaterialCompositionPrices.delete.execute.call(
// 							this,
// 							items,
// 						);
// 						break;
// 					case 'get':
// 						responseData = await corrugatedMaterialCompositionPrices.get.execute.call(this, items);
// 						break;
// 					case 'getMany':
// 						responseData = await corrugatedMaterialCompositionPrices.list.execute.call(this, items);
// 						break;
// 					case 'update':
// 						responseData = await corrugatedMaterialCompositionPrices.update.execute.call(
// 							this,
// 							items,
// 						);
// 						break;
// 					default:
// 						throw new Error(
// 							`The operation "${operation}" is not supported for resource "${resource}"!`,
// 						);
// 				}
// 				break;
// 			case 'corrugatedFormat':
// 				switch (operation) {
// 					case 'create':
// 						responseData = await corrugatedFormats.create.execute.call(this, items);
// 						break;
// 					case 'get':
// 						responseData = await corrugatedFormats.get.execute.call(this, items);
// 						break;
// 					case 'getMany':
// 						responseData = await corrugatedFormats.list.execute.call(this, items);
// 						break;
// 					case 'update':
// 						responseData = await corrugatedFormats.update.execute.call(this, items);
// 						break;
// 					default:
// 						throw new Error(
// 							`The operation "${operation}" is not supported for resource "${resource}"!`,
// 						);
// 				}
// 				break;
// 			case 'corrugatedSupplier':
// 				switch (operation) {
// 					case 'create':
// 						responseData = await corrugatedSuppliers.create.execute.call(this, items);
// 						break;
// 					case 'getMany':
// 						responseData = await corrugatedSuppliers.list.execute.call(this, items);
// 						break;
// 					case 'update':
// 						responseData = await corrugatedSuppliers.update.execute.call(this, items);
// 						break;
// 					default:
// 						throw new Error(
// 							`The operation "${operation}" is not supported for resource "${resource}"!`,
// 						);
// 				}
// 				break;
// 			case 'corrugatedFlute':
// 				switch (operation) {
// 					case 'create':
// 						responseData = await corrugatedFlutes.create.execute.call(this, items);
// 						break;
// 					case 'get':
// 						responseData = await corrugatedFlutes.get.execute.call(this, items);
// 						break;
// 					case 'getMany':
// 						responseData = await corrugatedFlutes.list.execute.call(this, items);
// 						break;
// 					case 'update':
// 						responseData = await corrugatedFlutes.update.execute.call(this, items);
// 						break;
// 					default:
// 						throw new Error(
// 							`The operation "${operation}" is not supported for resource "${resource}"!`,
// 						);
// 				}
// 				break;
// 			case 'corrugatedLiner':
// 				switch (operation) {
// 					case 'create':
// 						responseData = await corrugatedLiners.create.execute.call(this, items);
// 						break;
// 					case 'get':
// 						responseData = await corrugatedLiners.get.execute.call(this, items);
// 						break;
// 					case 'getMany':
// 						responseData = await corrugatedLiners.list.execute.call(this, items);
// 						break;
// 					case 'update':
// 						responseData = await corrugatedLiners.update.execute.call(this, items);
// 						break;
// 					default:
// 						throw new Error(
// 							`The operation "${operation}" is not supported for resource "${resource}"!`,
// 						);
// 				}
// 				break;
// 			case 'project':
// 				switch (operation) {
// 					case 'create':
// 						responseData = await projects.create.execute.call(this, items);
// 						break;
// 					case 'get':
// 						responseData = await projects.get.execute.call(this, items);
// 						break;
// 					case 'getMany':
// 						responseData = await projects.list.execute.call(this, items);
// 						break;
// 					case 'update':
// 						responseData = await projects.update.execute.call(this, items);
// 						break;
// 					default:
// 						throw new Error(
// 							`The operation "${operation}" is not supported for resource "${resource}"!`,
// 						);
// 				}
// 				break;
// 			default:
// 				throw new Error(`The resource "${resource}" is not supported!`);
// 		}

// 		// Return the response data
// 		if (Array.isArray(responseData)) {
// 			returnData.push(...responseData);
// 		} else {
// 			returnData.push({ json: responseData });
// 		}

// 		return [returnData];
// 	}
// }

}