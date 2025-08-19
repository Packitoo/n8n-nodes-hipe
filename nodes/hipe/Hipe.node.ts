import {
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	IExecuteFunctions,
	NodeConnectionType,
	INodeProperties,
	ApplicationError,
	NodeOperationError,
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
import * as users from './Users/actions';
import * as companies from './Companies/actions';
import * as addresses from './Addresses/actions';
import * as statuses from './Statuses/actions';
import * as pipelines from './Pipelines/actions';

export const EMBEDDED_RESOURCES = [
	companies,
	addresses,
	users,
	projects,
	statuses,
	pipelines,
	corrugatedMaterials,
	corrugatedMaterialCompositions,
	corrugatedMaterialCompositionPrices,
	corrugatedFormats,
	corrugatedSuppliers,
	corrugatedFlutes,
	corrugatedLiners,
];

// Runtime check for resource registration

export class Hipe implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'HIPE',
		name: 'hipe',
		icon: 'file:logo.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with HIPE API',
		defaults: {
			name: 'Hipe',
		},
		inputs: ['main'] as NodeConnectionType[],
		outputs: ['main'] as NodeConnectionType[],
		credentials: [
			{
				name: 'hipeApi',
				required: true,
			},
		],
		properties: this.buildProperties(EMBEDDED_RESOURCES),
	};
	static default: any;

	validateResources() {
		for (const res of EMBEDDED_RESOURCES) {
			if (!res.RESOURCE || typeof res.RESOURCE !== 'string') {
				throw new ApplicationError(
					'[hipe][RESOURCE REGISTRATION] Resource missing RESOURCE property',
				);
			}
			if (!res.ACTIONS || typeof res.ACTIONS !== 'object') {
				throw new ApplicationError(
					`[hipe][RESOURCE REGISTRATION] Resource ${res.RESOURCE} missing ACTIONS property`,
				);
			}
			if (typeof res.buildProperties !== 'function') {
				throw new ApplicationError(
					`[hipe][RESOURCE REGISTRATION] Resource ${res.RESOURCE} missing buildProperties function`,
				);
			}
		}
	}

	// Runtime check for resource registration
	buildProperties(embeddedResources: any[]) {
		this.validateResources();
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
			if (!Array.isArray(resourceProperties)) {
				throw new ApplicationError(
					`Resource "${resourceName}" did not return a valid properties array!`,
				);
			}
			resource.options?.push({
				name: resourceName,
				value: resourceName,
			});
			properties.push(...resourceProperties);
		}
		properties.unshift(resource);
		return properties;
	}

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		this.logger.debug('[hipe][EXECUTE] === HIPE NODE EXECUTE START ===');
		try {
			const items = this.getInputData();
			// const returnData: INodeExecutionData[] = [];
			const resource = this.getNodeParameter('resource', 0) as string;
			const operation = this.getNodeParameter('operation', 0) as string;

			// Find the correct embedded resource
			this.logger.debug(`[hipe][EXECUTE] Resource: ${resource}`);
			const embeddedResource = EMBEDDED_RESOURCES.find((r) => r.RESOURCE === resource);
			if (!embeddedResource) {
				this.logger.error(`[hipe][EXECUTE] Resource not found: ${resource}`);
				throw new NodeOperationError(this.getNode(), `Resource "${resource}" not found!`);
			}
			this.logger.debug(`[hipe][EXECUTE] Found resource: ${embeddedResource.RESOURCE}`);

			// Find the correct action
			const action = embeddedResource.ACTIONS[operation as keyof typeof embeddedResource.ACTIONS];
			this.logger.debug(
				`[hipe][EXECUTE] Action key: ${operation}, available: ${Object.keys(embeddedResource.ACTIONS)}`,
			);
			if (!action || typeof action.execute !== 'function') {
				this.logger.error(
					`[hipe][EXECUTE] Operation not found or invalid for resource: ${resource}, operation: ${operation}`,
				);
				throw new NodeOperationError(
					this.getNode(),
					`Operation "${operation}" not found for resource "${resource}"!`,
				);
			}

			// Call the action's execute
			const result = await action.execute.call(this, items);

			// Normalize result for n8n
			if (Array.isArray(result)) {
				return [result];
			}
			return [[{ json: result }]];
		} catch (error) {
			this.logger.error(`[hipe][EXECUTE] ERROR: ${error instanceof Error ? error.stack : error}`);
			throw error;
		}
	}
}
