import { INodeProperties } from 'n8n-workflow';

export const corrugatedSuppliersResource: INodeProperties = {
    displayName: 'Resource',
    name: 'resource',
    type: 'options',
    noDataExpression: true,
    options: [
        {
            name: 'Corrugated Suppliers',
            value: 'corrugatedSuppliers',
            description: 'Manage corrugated suppliers in HIPE',
        },
    ],
    default: 'corrugatedSuppliers',
    description: 'Resource to operate on.',
};

export const corrugatedSuppliersOperations: INodeProperties = {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    options: [
        {
            name: 'Get All',
            value: 'getAllCorrugatedSupplier',
            description: 'Retrieve all corrugated suppliers',
            action: 'Get all corrugated suppliers',
        },
        {
            name: 'Get By ID',
            value: 'getByIdCorrugatedSupplier',
            description: 'Retrieve a corrugated supplier by ID',
            action: 'Get a corrugated supplier by ID',
        },
        {
            name: 'Create',
            value: 'createCorrugatedSupplier',
            description: 'Create a new corrugated supplier',
            action: 'Create a corrugated supplier',
        },
        {
            name: 'Update',
            value: 'updateCorrugatedSupplier',
            description: 'Update an existing corrugated supplier',
            action: 'Update a corrugated supplier',
        },
    ],
    default: 'getAllCorrugatedSupplier',
    description: 'Operation to perform.',
};
