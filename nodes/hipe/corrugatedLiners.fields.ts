import { INodeProperties } from 'n8n-workflow';

export const corrugatedLinersFields: INodeProperties[] = [
    // Get All
    {
        displayName: 'Return All',
        name: 'returnAll',
        type: 'boolean',
        displayOptions: {
            show: {
                resource: ['corrugatedLiners'],
                operation: ['getAllCorrugatedLiner'],
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
                resource: ['corrugatedLiners'],
                operation: ['getAllCorrugatedLiner'],
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
        displayName: 'Liner ID',
        name: 'linerId',
        type: 'string',
        required: true,
        displayOptions: {
            show: {
                resource: ['corrugatedLiners'],
                operation: ['getByIdCorrugatedLiner', 'updateCorrugatedLiner'],
            },
        },
        default: '',
        description: 'The ID of the corrugated liner.',
    },
    // Create
    {
        displayName: 'Name',
        name: 'name',
        type: 'string',
        required: true,
        displayOptions: {
            show: {
                resource: ['corrugatedLiners'],
                operation: ['createCorrugatedLiner'],
            },
        },
        default: '',
        description: 'Name of the corrugated liner.',
    },
    {
        displayName: 'Description',
        name: 'description',
        type: 'string',
        required: false,
        displayOptions: {
            show: {
                resource: ['corrugatedLiners'],
                operation: ['createCorrugatedLiner', 'updateCorrugatedLiner'],
            },
        },
        default: '',
        description: 'Description of the corrugated liner.',
    },
    // Update (fields can be reused from create)
];
