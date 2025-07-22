import {
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	IExecuteFunctions,
	NodeConnectionType,
	INodeProperties,
	LoggerProxy as Logger,
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
import * as companies from './Companies/actions';

const EMBEDDED_RESOURCES = [users, companies];

// Runtime check for resource registration
for (const res of EMBEDDED_RESOURCES) {
	if (!res.RESOURCE || typeof res.RESOURCE !== 'string') {
		Logger.error('[hipe][RESOURCE REGISTRATION] Missing or invalid RESOURCE:', res);
		throw new Error('[hipe][RESOURCE REGISTRATION] Resource missing RESOURCE property');
	}
	if (!res.ACTIONS || typeof res.ACTIONS !== 'object') {
		Logger.error(`[hipe][RESOURCE REGISTRATION] Resource ${res.RESOURCE} missing ACTIONS:`, res);
		throw new Error(
			`[hipe][RESOURCE REGISTRATION] Resource ${res.RESOURCE} missing ACTIONS property`,
		);
	}
	if (typeof res.buildProperties !== 'function') {
		Logger.error(
			`[hipe][RESOURCE REGISTRATION] Resource ${res.RESOURCE} missing buildProperties function:`,
			res,
		);
		throw new Error(
			`[hipe][RESOURCE REGISTRATION] Resource ${res.RESOURCE} missing buildProperties function`,
		);
	}
	// Log available actions
	Logger.info(
		`[hipe][RESOURCE REGISTRATION] Registered resource: ${res.RESOURCE}, actions: ${Object.keys(res.ACTIONS).join(', ')}`,
	);
}

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
		Logger.info(
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
    Logger.debug('[hipe][EXECUTE] === HIPE NODE EXECUTE START ===');
    try {
		const items = this.getInputData();
		// const returnData: INodeExecutionData[] = [];
		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;

		// Find the correct embedded resource
		Logger.debug(`[hipe][EXECUTE] Resource: ${resource}`);
		const embeddedResource = EMBEDDED_RESOURCES.find((r) => r.RESOURCE === resource);
		if (!embeddedResource) {
			Logger.error(`[hipe][EXECUTE] Resource not found: ${resource}`);
			throw new Error(`Resource "${resource}" not found!`);
		}
		Logger.debug(`[hipe][EXECUTE] Found resource: ${embeddedResource.RESOURCE}`);

		// Find the correct action
		const action = embeddedResource.ACTIONS[operation as keyof typeof embeddedResource.ACTIONS];
		Logger.debug(
			`[hipe][EXECUTE] Action key: ${operation}, available: ${Object.keys(embeddedResource.ACTIONS)}`,
		);
		if (!action || typeof action.execute !== 'function') {
			Logger.error(
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
        Logger.error(`[hipe][EXECUTE] ERROR: ${error instanceof Error ? error.stack : error}`);
        throw error;
    }
}
}
