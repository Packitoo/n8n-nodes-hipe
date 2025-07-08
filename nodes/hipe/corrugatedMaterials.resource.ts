import { INodeProperties } from 'n8n-workflow';

export const corrugatedMaterialsResource: INodeProperties = {
    displayName: 'Resource',
    name: 'resource',
    type: 'options',
    noDataExpression: true,
    options: [
        {
            name: 'Corrugated Materials',
            value: 'corrugatedMaterials',
            description: 'Manage corrugated materials in HIPE',
        },
    ],
    default: 'corrugatedMaterials',
    description: 'Resource to operate on.',
};

export const corrugatedMaterialsOperations: INodeProperties = {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    options: [
        {
            name: 'Get All',
            value: 'getAllCorrugatedMaterial',
            description: 'Retrieve all corrugated materials',
            action: 'Get all corrugated materials',
        },
        {
            name: 'Get By ID',
            value: 'getByIdCorrugatedMaterial',
            description: 'Retrieve a corrugated material by ID',
            action: 'Get a corrugated material by ID',
        },
        {
            name: 'Create',
            value: 'createCorrugatedMaterial',
            description: 'Create a new corrugated material',
            action: 'Create a corrugated material',
        },
        {
            name: 'Update',
            value: 'updateCorrugatedMaterial',
            description: 'Update an existing corrugated material',
            action: 'Update a corrugated material',
        },
    ],
    default: 'getAllCorrugatedMaterial',
    description: 'Operation to perform.',
};
