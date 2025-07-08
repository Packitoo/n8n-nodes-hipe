import { INodeProperties } from 'n8n-workflow';

export const corrugatedFlutesResource: INodeProperties = {
    displayName: 'Resource',
    name: 'resource',
    type: 'options',
    noDataExpression: true,
    options: [
        {
            name: 'Corrugated Flutes',
            value: 'corrugatedFlutes',
            description: 'Manage corrugated flutes in HIPE',
        },
    ],
    default: 'corrugatedFlutes',
    description: 'Resource to operate on.',
};

export const corrugatedFlutesOperations: INodeProperties = {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    options: [
        {
            name: 'Get All',
            value: 'getAllCorrugatedFlute',
            description: 'Retrieve all corrugated flutes',
            action: 'Get all corrugated flutes',
        },
        {
            name: 'Get By ID',
            value: 'getByIdCorrugatedFlute',
            description: 'Retrieve a corrugated flute by ID',
            action: 'Get a corrugated flute by ID',
        },
        {
            name: 'Create',
            value: 'createCorrugatedFlute',
            description: 'Create a new corrugated flute',
            action: 'Create a corrugated flute',
        },
        {
            name: 'Update',
            value: 'updateCorrugatedFlute',
            description: 'Update an existing corrugated flute',
            action: 'Update a corrugated flute',
        },
    ],
    default: 'getAllCorrugatedFlute',
    description: 'Operation to perform.',
};
