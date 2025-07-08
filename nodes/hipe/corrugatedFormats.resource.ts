import { INodeProperties } from 'n8n-workflow';

export const corrugatedFormatsResource: INodeProperties = {
    displayName: 'Resource',
    name: 'resource',
    type: 'options',
    noDataExpression: true,
    options: [
        {
            name: 'Corrugated Formats',
            value: 'corrugatedFormats',
            description: 'Manage corrugated formats in HIPE',
        },
    ],
    default: 'corrugatedFormats',
    description: 'Resource to operate on.',
};

export const corrugatedFormatsOperations: INodeProperties = {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    options: [
        {
            name: 'Get All',
            value: 'getAllCorrugatedFormat',
            description: 'Retrieve all corrugated formats',
            action: 'Get all corrugated formats',
        },
        {
            name: 'Get By ID',
            value: 'getByIdCorrugatedFormat',
            description: 'Retrieve a corrugated format by ID',
            action: 'Get a corrugated format by ID',
        },
        {
            name: 'Create',
            value: 'createCorrugatedFormat',
            description: 'Create a new corrugated format',
            action: 'Create a corrugated format',
        },
        {
            name: 'Update',
            value: 'updateCorrugatedFormat',
            description: 'Update an existing corrugated format',
            action: 'Update a corrugated format',
        },
    ],
    default: 'getAllCorrugatedFormat',
    description: 'Operation to perform.',
};
