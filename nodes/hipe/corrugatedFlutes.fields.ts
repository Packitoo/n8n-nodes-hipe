import { INodeProperties } from 'n8n-workflow';

export const corrugatedFlutesFields: INodeProperties[] = [
    // Get All
    {
        displayName: 'Return All',
        name: 'returnAll',
        type: 'boolean',
        displayOptions: {
            show: {
                resource: ['corrugatedFlutes'],
                operation: ['getAllCorrugatedFlute'],
            },
        },
        default: true,
        description: 'Whether to return all results or only up to a limit.',
    },
    {
        displayName: 'Limit',
        name: 'limit',
        type: 'number',
        displayOptions: {
            show: {
                resource: ['corrugatedFlutes'],
                operation: ['getAllCorrugatedFlute'],
                returnAll: [false],
            },
        },
        typeOptions: {
            minValue: 1,
            maxValue: 100,
        },
        default: 50,
        description: 'Max number of results to return.',
    },
    // Get By ID
    {
        displayName: 'Flute ID',
        name: 'fluteId',
        type: 'string',
        required: true,
        displayOptions: {
            show: {
                resource: ['corrugatedFlutes'],
                operation: ['getByIdCorrugatedFlute', 'updateCorrugatedFlute'],
            },
        },
        default: '',
        description: 'The ID of the corrugated flute.',
    },
    // Create
    {
        displayName: 'Name',
        name: 'name',
        type: 'string',
        required: true,
        displayOptions: {
            show: {
                resource: ['corrugatedFlutes'],
                operation: ['createCorrugatedFlute'],
            },
        },
        default: '',
        description: 'Name of the corrugated flute.',
    },
    {
        displayName: 'Description',
        name: 'description',
        type: 'string',
        required: false,
        displayOptions: {
            show: {
                resource: ['corrugatedFlutes'],
                operation: ['createCorrugatedFlute', 'updateCorrugatedFlute'],
            },
        },
        default: '',
        description: 'Description of the corrugated flute.',
    },
    // Update (fields can be reused from create)
];
