import { INodeProperties } from 'n8n-workflow';

export const corrugatedMaterialsFields: INodeProperties[] = [
    // Get All
    {
        displayName: 'Return All',
        name: 'returnAll',
        type: 'boolean',
        displayOptions: {
            show: {
                resource: ['corrugatedMaterials'],
                operation: ['getAllCorrugatedMaterial'],
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
                resource: ['corrugatedMaterials'],
                operation: ['getAllCorrugatedMaterial'],
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
        displayName: 'Material ID',
        name: 'materialId',
        type: 'string',
        required: true,
        displayOptions: {
            show: {
                resource: ['corrugatedMaterials'],
                operation: ['getByIdCorrugatedMaterial', 'updateCorrugatedMaterial'],
            },
        },
        default: '',
        description: 'The ID of the corrugated material.',
    },
    // Create
    {
        displayName: 'Name',
        name: 'name',
        type: 'string',
        required: true,
        displayOptions: {
            show: {
                resource: ['corrugatedMaterials'],
                operation: ['createCorrugatedMaterial'],
            },
        },
        default: '',
        description: 'Name of the corrugated material.',
    },
    {
        displayName: 'Description',
        name: 'description',
        type: 'string',
        required: false,
        displayOptions: {
            show: {
                resource: ['corrugatedMaterials'],
                operation: ['createCorrugatedMaterial', 'updateCorrugatedMaterial'],
            },
        },
        default: '',
        description: 'Description of the corrugated material.',
    },
    // Update (fields can be reused from create)
];
