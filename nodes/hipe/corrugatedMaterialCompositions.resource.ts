import { INodeProperties } from 'n8n-workflow';

export const corrugatedMaterialCompositionsResource: INodeProperties = {
    displayName: 'Resource',
    name: 'resource',
    type: 'options',
    noDataExpression: true,
    options: [
        {
            name: 'Corrugated Material Compositions',
            value: 'corrugatedMaterialCompositions',
            description: 'Manage corrugated material compositions in HIPE',
        },
    ],
    default: 'corrugatedMaterialCompositions',
    description: 'Resource to operate on.',
};

export const corrugatedMaterialCompositionsOperations: INodeProperties = {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    options: [
        {
            name: 'Get All',
            value: 'getAllCorrugatedMaterialComposition',
            description: 'Retrieve all corrugated material compositions',
            action: 'Get all corrugated material compositions',
        },
        {
            name: 'Get By ID',
            value: 'getByIdCorrugatedMaterialComposition',
            description: 'Retrieve a corrugated material composition by ID',
            action: 'Get a corrugated material composition by ID',
        },
        {
            name: 'Create',
            value: 'createCorrugatedMaterialComposition',
            description: 'Create a new corrugated material composition',
            action: 'Create a corrugated material composition',
        },
        {
            name: 'Update',
            value: 'updateCorrugatedMaterialComposition',
            description: 'Update an existing corrugated material composition',
            action: 'Update a corrugated material composition',
        },
    ],
    default: 'getAllCorrugatedMaterialComposition',
    description: 'Operation to perform.',
};
