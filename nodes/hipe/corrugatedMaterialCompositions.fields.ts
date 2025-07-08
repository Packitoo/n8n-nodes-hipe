import { INodeProperties } from 'n8n-workflow';

export const corrugatedMaterialCompositionsFields: INodeProperties[] = [
    // Get All
    {
        displayName: 'Return All',
        name: 'returnAll',
        type: 'boolean',
        displayOptions: {
            show: {
                resource: ['corrugatedMaterialCompositions'],
                operation: ['getAllCorrugatedMaterialComposition'],
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
                resource: ['corrugatedMaterialCompositions'],
                operation: ['getAllCorrugatedMaterialComposition'],
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
        displayName: 'Composition ID',
        name: 'compositionId',
        type: 'string',
        required: true,
        displayOptions: {
            show: {
                resource: ['corrugatedMaterialCompositions'],
                operation: ['getByIdCorrugatedMaterialComposition', 'updateCorrugatedMaterialComposition'],
            },
        },
        default: '',
        description: 'The ID of the corrugated material composition.',
    },
    // Create
    {
        displayName: 'Name',
        name: 'name',
        type: 'string',
        required: true,
        displayOptions: {
            show: {
                resource: ['corrugatedMaterialCompositions'],
                operation: ['createCorrugatedMaterialComposition'],
            },
        },
        default: '',
        description: 'Name of the corrugated material composition.',
    },
    {
        displayName: 'Description',
        name: 'description',
        type: 'string',
        required: false,
        displayOptions: {
            show: {
                resource: ['corrugatedMaterialCompositions'],
                operation: ['createCorrugatedMaterialComposition', 'updateCorrugatedMaterialComposition'],
            },
        },
        default: '',
        description: 'Description of the corrugated material composition.',
    },
    // Update (fields can be reused from create)
];
