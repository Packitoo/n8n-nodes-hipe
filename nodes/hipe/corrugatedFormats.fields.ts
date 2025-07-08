import { INodeProperties } from 'n8n-workflow';

export const corrugatedFormatsFields: INodeProperties[] = [
    // Get All
    {
        displayName: 'Return All',
        name: 'returnAll',
        type: 'boolean',
        displayOptions: {
            show: {
                resource: ['corrugatedFormats'],
                operation: ['getAllCorrugatedFormat'],
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
                resource: ['corrugatedFormats'],
                operation: ['getAllCorrugatedFormat'],
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
        displayName: 'Format ID',
        name: 'formatId',
        type: 'string',
        required: true,
        displayOptions: {
            show: {
                resource: ['corrugatedFormats'],
                operation: ['getByIdCorrugatedFormat', 'updateCorrugatedFormat'],
            },
        },
        default: '',
        description: 'The ID of the corrugated format.',
    },
    // Create
    {
        displayName: 'Name',
        name: 'name',
        type: 'string',
        required: true,
        displayOptions: {
            show: {
                resource: ['corrugatedFormats'],
                operation: ['createCorrugatedFormat'],
            },
        },
        default: '',
        description: 'Name of the corrugated format.',
    },
    {
        displayName: 'Description',
        name: 'description',
        type: 'string',
        required: false,
        displayOptions: {
            show: {
                resource: ['corrugatedFormats'],
                operation: ['createCorrugatedFormat', 'updateCorrugatedFormat'],
            },
        },
        default: '',
        description: 'Description of the corrugated format.',
    },
    // Update (fields can be reused from create)
];
