import { INodeType, INodeTypeDescription, NodeConnectionType } from 'n8n-workflow';
import { corrugatedFlutesResource, corrugatedFlutesOperations } from './corrugatedFlutes.resource';
import { corrugatedFlutesFields } from './corrugatedFlutes.fields';
import { handleCorrugatedFlutes } from './corrugatedFlutes.handlers';
// import { corrugatedFormatsResource, corrugatedFormatsOperations } from './corrugatedFormats.resource';
// import { corrugatedFormatsFields } from './corrugatedFormats.fields';
// import { handleCorrugatedFormats } from './corrugatedFormats.handlers';
// import { corrugatedLinersResource, corrugatedLinersOperations } from './corrugatedLiners.resource';
// import { corrugatedLinersFields } from './corrugatedLiners.fields';
// import { handleCorrugatedLiners } from './corrugatedLiners.handlers';
// import { corrugatedMaterialCompositionPricesResource, corrugatedMaterialCompositionPricesOperations } from './corrugatedMaterialCompositionPrices.resource';
// import { corrugatedMaterialCompositionPricesFields } from './corrugatedMaterialCompositionPrices.fields';
// import { handleCorrugatedMaterialCompositionPrices } from './corrugatedMaterialCompositionPrices.handlers';
// import { corrugatedMaterialCompositionsResource, corrugatedMaterialCompositionsOperations } from './corrugatedMaterialCompositions.resource';
// import { corrugatedMaterialCompositionsFields } from './corrugatedMaterialCompositions.fields';
// import { handleCorrugatedMaterialCompositions } from './corrugatedMaterialCompositions.handlers';
// import { corrugatedMaterialsResource, corrugatedMaterialsOperations } from './corrugatedMaterials.resource';
// import { corrugatedMaterialsFields } from './corrugatedMaterials.fields';
// import { handleCorrugatedMaterials } from './corrugatedMaterials.handlers';
// import { corrugatedSuppliersResource, corrugatedSuppliersOperations } from './corrugatedSuppliers.resource';
// import { corrugatedSuppliersFields } from './corrugatedSuppliers.fields';
// import { handleCorrugatedSuppliers } from './corrugatedSuppliers.handlers';

export class hipe implements INodeType {
	description: INodeTypeDescription = {
        // Basic node details will go here
        version: 1,
        name: "hipe",
        displayName: "hipe",
        icon: 'file:logo.svg',
        subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
        properties: [
            corrugatedFlutesResource,
            corrugatedFlutesOperations,
            ...corrugatedFlutesFields,
            // corrugatedFormatsResource,
            // corrugatedFormatsOperations,
            // ...corrugatedFormatsFields,
            // corrugatedLinersResource,
            // corrugatedLinersOperations,
            // ...corrugatedLinersFields,
            // corrugatedMaterialCompositionPricesResource,
            // corrugatedMaterialCompositionPricesOperations,
            // ...corrugatedMaterialCompositionPricesFields,
            // corrugatedMaterialCompositionsResource,
            // corrugatedMaterialCompositionsOperations,
            // ...corrugatedMaterialCompositionsFields,
            // corrugatedMaterialsResource,
            // corrugatedMaterialsOperations,
            // ...corrugatedMaterialsFields,
            // corrugatedSuppliersResource,
            // corrugatedSuppliersOperations,
            // ...corrugatedSuppliersFields,
        ],
        credentials: [
            {
                name: "hipe",
                required: true,
            }
        ],
        requestDefaults: {
            baseURL: '={{ $credentials.url ?? "https://demo-store-hipe.packitoo.com" }}',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        },
        defaults: {
            name: "hipe",
            color: '#000000',
        },
        group: ['transform'],
        description: '',
        inputs: [NodeConnectionType.Main],
        outputs: [NodeConnectionType.Main],
    };

    async execute(this: import('n8n-workflow').IExecuteFunctions): Promise<import('n8n-workflow').INodeExecutionData[][]> {
        const resource = this.getNodeParameter('resource', 0) as string;
        const operation = this.getNodeParameter('operation', 0) as string;

        if (resource === 'corrugatedFlutes') {
            return [await handleCorrugatedFlutes(this, operation)];
        }
        // if (resource === 'corrugatedFormats') {
        //     return [await handleCorrugatedFormats(this, operation)];
        // }
        // if (resource === 'corrugatedLiners') {
        //     return [await handleCorrugatedLiners(this, operation)];
        // }
        // if (resource === 'corrugatedMaterialCompositionPrices') {
        //     return [await handleCorrugatedMaterialCompositionPrices(this, operation)];
        // }
        // if (resource === 'corrugatedMaterialCompositions') {
        //     return [await handleCorrugatedMaterialCompositions(this, operation)];
        // }
        // if (resource === 'corrugatedMaterials') {
        //     return [await handleCorrugatedMaterials(this, operation)];
        // }
        // if (resource === 'corrugatedSuppliers') {
        //     return [await handleCorrugatedSuppliers(this, operation)];
        // }
        // Placeholder for future resource handlers
        return [[]];
    }
}