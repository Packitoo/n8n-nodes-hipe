import { INodeProperties } from 'n8n-workflow';

export const corrugatedSuppliersFields: INodeProperties[] = [
    // Get All
    {
        displayName: 'Return All',
        name: 'returnAll',
        type: 'boolean',
        displayOptions: {
            show: {
                resource: ['corrugatedSuppliers'],
                operation: ['getAllCorrugatedSupplier'],
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
                resource: ['corrugatedSuppliers'],
                operation: ['getAllCorrugatedSupplier'],
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
        displayName: 'Supplier ID',
        name: 'supplierId',
        type: 'string',
        required: true,
        displayOptions: {
            show: {
                resource: ['corrugatedSuppliers'],
                operation: ['getByIdCorrugatedSupplier', 'updateCorrugatedSupplier'],
            },
        },
        default: '',
        description: 'The ID of the corrugated supplier.',
    },
    // Create
    {
        displayName: 'Name',
        name: 'name',
        type: 'string',
        required: true,
        displayOptions: {
            show: {
                resource: ['corrugatedSuppliers'],
                operation: ['createCorrugatedSupplier'],
            },
        },
        default: '',
        description: 'Name of the corrugated supplier.',
    },
    {
        displayName: 'Description',
        name: 'description',
        type: 'string',
        required: false,
        displayOptions: {
            show: {
                resource: ['corrugatedSuppliers'],
                operation: ['createCorrugatedSupplier', 'updateCorrugatedSupplier'],
            },
        },
        default: '',
        description: 'Description of the corrugated supplier.',
    },
    // Update (fields can be reused from create)
];
