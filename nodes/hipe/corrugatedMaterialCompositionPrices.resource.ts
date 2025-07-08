import { INodeProperties } from 'n8n-workflow';

export const corrugatedMaterialCompositionPricesResource: INodeProperties = {
    displayName: 'Resource',
    name: 'resource',
    type: 'options',
    noDataExpression: true,
    options: [
        {
            name: 'Corrugated Material Composition Prices',
            value: 'corrugatedMaterialCompositionPrices',
            description: 'Manage corrugated material composition prices in HIPE',
        },
    ],
    default: 'corrugatedMaterialCompositionPrices',
    description: 'Resource to operate on.',
};

export const corrugatedMaterialCompositionPricesOperations: INodeProperties = {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    options: [
        {
            name: 'Get All',
            value: 'getAllCorrugatedMaterialCompositionPrice',
            description: 'Retrieve all corrugated material composition prices',
            action: 'Get all corrugated material composition prices',
        },
        {
            name: 'Get By ID',
            value: 'getByIdCorrugatedMaterialCompositionPrice',
            description: 'Retrieve a corrugated material composition price by ID',
            action: 'Get a corrugated material composition price by ID',
        },
        {
            name: 'Create',
            value: 'createCorrugatedMaterialCompositionPrice',
            description: 'Create a new corrugated material composition price',
            action: 'Create a corrugated material composition price',
        },
        {
            name: 'Update',
            value: 'updateCorrugatedMaterialCompositionPrice',
            description: 'Update an existing corrugated material composition price',
            action: 'Update a corrugated material composition price',
        },
    ],
    default: 'getAllCorrugatedMaterialCompositionPrice',
    description: 'Operation to perform.',
};
