import { INodeProperties } from 'n8n-workflow';

export const corrugatedLinersResource: INodeProperties = {
    displayName: 'Resource',
    name: 'resource',
    type: 'options',
    noDataExpression: true,
    options: [
        {
            name: 'Corrugated Liners',
            value: 'corrugatedLiners',
            description: 'Manage corrugated liners in HIPE',
        },
    ],
    default: 'corrugatedLiners',
    description: 'Resource to operate on.',
};

export const corrugatedLinersOperations: INodeProperties = {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    options: [
        {
            name: 'Get All',
            value: 'getAllCorrugatedLiner',
            description: 'Retrieve all corrugated liners',
            action: 'Get all corrugated liners',
        },
        {
            name: 'Get By ID',
            value: 'getByIdCorrugatedLiner',
            description: 'Retrieve a corrugated liner by ID',
            action: 'Get a corrugated liner by ID',
        },
        {
            name: 'Create',
            value: 'createCorrugatedLiner',
            description: 'Create a new corrugated liner',
            action: 'Create a corrugated liner',
        },
        {
            name: 'Update',
            value: 'updateCorrugatedLiner',
            description: 'Update an existing corrugated liner',
            action: 'Update a corrugated liner',
        },
    ],
    default: 'getAllCorrugatedLiner',
    description: 'Operation to perform.',
};
