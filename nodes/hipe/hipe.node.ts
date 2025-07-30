import {
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	IExecuteFunctions,
	NodeConnectionType,
	INodeProperties,
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

const EMBEDDED_RESOURCES = [companies, addresses, users, projects, corrugatedMaterials, corrugatedMaterialCompositions, corrugatedMaterialCompositionPrices, corrugatedFormats, corrugatedSuppliers, corrugatedFlutes, corrugatedLiners];

// Runtime check for resource registration
for (const res of EMBEDDED_RESOURCES) {
	if (!res.RESOURCE || typeof res.RESOURCE !== 'string') {
		console.error('[hipe][RESOURCE REGISTRATION] Missing or invalid RESOURCE:', res);
		throw new Error('[hipe][RESOURCE REGISTRATION] Resource missing RESOURCE property');
	}
	if (!res.ACTIONS || typeof res.ACTIONS !== 'object') {
		console.error(`[hipe][RESOURCE REGISTRATION] Resource ${res.RESOURCE} missing ACTIONS:`, res);
		throw new Error(
			`[hipe][RESOURCE REGISTRATION] Resource ${res.RESOURCE} missing ACTIONS property`,
		);
	}
	if (typeof res.buildProperties !== 'function') {
		console.error(
			`[hipe][RESOURCE REGISTRATION] Resource ${res.RESOURCE} missing buildProperties function:`,
			res,
		);
		throw new Error(
			`[hipe][RESOURCE REGISTRATION] Resource ${res.RESOURCE} missing buildProperties function`,
		);
	}
	// Log available actions
	console.info(
		`[hipe][RESOURCE REGISTRATION] Registered resource: ${res.RESOURCE}, actions: ${Object.keys(res.ACTIONS).join(', ')}`,
	);
}

export class Hipe implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'HIPE',
		name: 'Hipe',
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

	buildProperties(embeddedResources: any[]) {
		console.debug(
			`[hipe][BUILD PROPERTIES] Registered resources: ${embeddedResources.map((r) => r.RESOURCE).join(', ')}`,
		);
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
			console.debug(`[hipe][BUILD PROPERTIES] Processing resource: ${resourceName}`);
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
		console.debug('[hipe][EXECUTE] === HIPE NODE EXECUTE START ===');
		try {
			const items = this.getInputData();
			// const returnData: INodeExecutionData[] = [];
			const resource = this.getNodeParameter('resource', 0) as string;
			const operation = this.getNodeParameter('operation', 0) as string;

			// Find the correct embedded resource
			console.debug(`[hipe][EXECUTE] Resource: ${resource}`);
			const embeddedResource = EMBEDDED_RESOURCES.find((r) => r.RESOURCE === resource);
			if (!embeddedResource) {
				console.error(`[hipe][EXECUTE] Resource not found: ${resource}`);
				throw new Error(`Resource "${resource}" not found!`);
			}
			console.debug(`[hipe][EXECUTE] Found resource: ${embeddedResource.RESOURCE}`);

			// Find the correct action
			const action = embeddedResource.ACTIONS[operation as keyof typeof embeddedResource.ACTIONS];
			console.debug(
				`[hipe][EXECUTE] Action key: ${operation}, available: ${Object.keys(embeddedResource.ACTIONS)}`,
			);
			if (!action || typeof action.execute !== 'function') {
				console.error(
					`[hipe][EXECUTE] Operation not found or invalid for resource: ${resource}, operation: ${operation}`,
				);
				throw new Error(`Operation "${operation}" not found for resource "${resource}"!`);
			}

			// Call the action's execute
			const result = await action.execute.call(this, items);

			// Normalize result for n8n
			if (Array.isArray(result)) {
				return [result];
			}
			return [[{ json: result }]];
		} catch (error) {
			console.error(`[hipe][EXECUTE] ERROR: ${error instanceof Error ? error.stack : error}`);
			throw error;
		}
	}
}
