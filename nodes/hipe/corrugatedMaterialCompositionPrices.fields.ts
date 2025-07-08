import { INodeProperties } from 'n8n-workflow';

export const corrugatedMaterialCompositionPricesFields: INodeProperties[] = [
    // Get All
    {
        displayName: 'Return All',
        name: 'returnAll',
        type: 'boolean',
        displayOptions: {
            show: {
                resource: ['corrugatedMaterialCompositionPrices'],
                operation: ['getAllCorrugatedMaterialCompositionPrice'],
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
                resource: ['corrugatedMaterialCompositionPrices'],
                operation: ['getAllCorrugatedMaterialCompositionPrice'],
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
        displayName: 'Price ID',
        name: 'priceId',
        type: 'string',
        required: true,
        displayOptions: {
            show: {
                resource: ['corrugatedMaterialCompositionPrices'],
                operation: ['getByIdCorrugatedMaterialCompositionPrice', 'updateCorrugatedMaterialCompositionPrice'],
            },
        },
        default: '',
        description: 'The ID of the corrugated material composition price.',
    },
    // Create
    {
        displayName: 'Name',
        name: 'name',
        type: 'string',
        required: true,
        displayOptions: {
            show: {
                resource: ['corrugatedMaterialCompositionPrices'],
                operation: ['createCorrugatedMaterialCompositionPrice'],
            },
        },
        default: '',
        description: 'Name of the corrugated material composition price.',
    },
    {
        displayName: 'Description',
        name: 'description',
        type: 'string',
        required: false,
        displayOptions: {
            show: {
                resource: ['corrugatedMaterialCompositionPrices'],
                operation: ['createCorrugatedMaterialCompositionPrice', 'updateCorrugatedMaterialCompositionPrice'],
            },
        },
        default: '',
        description: 'Description of the corrugated material composition price.',
    },
    // Update (fields can be reused from create)
];
