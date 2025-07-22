import { IExecuteFunctions } from 'n8n-workflow';
import { INodeExecutionData, INodeProperties } from 'n8n-workflow';
import { ICompany } from '../../interfaces';

// Properties for the Create Company
export const properties: INodeProperties[] = [
  {
    displayName: 'Name',
    name: 'name',
    type: 'string',
    required: true,
    default: '',
    description: 'Name of the company',
    displayOptions: {
      show: {
        resource: ['company'],
        operation: ['create']
      }
    },
  },
  {
    displayName: 'ManagedByID',
    name: 'managedById',
    type: 'string',
    default: '',
    description: 'ManagedById of the company',
    displayOptions: {
      show: {
        resource: ['company'],
        operation: ['create']
      }
    },
  },
  {
    displayName: 'External ID',
    name: 'externalId',
    type: 'string',
    default: '',
    description: 'External ID of the contact',
    displayOptions: {
      show: {
        resource: ['company'],
        operation: ['create']
      }
    },
  },
  {
    displayName: 'Additional Fields',
    name: 'additionalFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: {
      show: {
        resource: ['company'],
        operation: ['create']
      }
    },
    options: [
      {
        displayName: 'Collaborater Ids',
        name: 'collaboraterIds',
        type: 'collection',
        placeholder: 'Add Collaborater Id',
        default: [],
        description: 'Collaborater Ids of the contacts',
      },
      {
        displayName: 'Parent Id',
        name: 'parentId',
        type: 'string',
        default: '',
        description: 'Parent Id of the company',
      },
      {
        displayName: 'Email',
        name: 'email',
        type: 'string',
        default: '',
        description: 'Email of the company',
      },
      {
        displayName: 'Website',
        name: 'website',
        type: 'string',
        default: '',
        description: 'Website of the company',
      },
      {
        displayName: 'Phone',
        name: 'phone',
        type: 'string',
        default: '',
        description: 'Phone of the company',
      },
      {
        displayName: 'Vat',
        name: 'vat',
        type: 'string',
        default: '',
        description: 'Vat of the company',
      },
      {
        displayName: 'Custom fields',
        name: 'customFields',
        type: 'json',
        default: {},
        description: 'Custom fields of the company',
      },
    ],
  },
];

// Execute function for the Create operation
export async function execute(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];

  // Get credentials
  const credentials = await this.getCredentials('hipe');
  let baseUrl = credentials.url;
  if (typeof baseUrl !== 'string') {
    throw new Error('HIPE base URL is not a string');
  }
  baseUrl = baseUrl.replace(/\/$/, '');
  
  // Process each item
  for (let i = 0; i < items.length; i++) {
    try {
      const name = this.getNodeParameter('name', i) as string;
      const managedById = this.getNodeParameter('managedById', i, '') as string;
      const externalId = this.getNodeParameter('externalId', i, '') as string;
      const collaboraterIds = this.getNodeParameter('collaboraterIds', i, []) as string[];
      const parentId = this.getNodeParameter('parentId', i, '') as string;
      const email = this.getNodeParameter('email', i, '') as string;
      const website = this.getNodeParameter('website', i, '') as string;
      const phone = this.getNodeParameter('phone', i, '') as string;
      const vat = this.getNodeParameter('vat', i, '') as string;
      const customFields = this.getNodeParameter('customFields', i, {}) as object;
      
      // Prepare request data
      const requestData: ICompany = {
        name,
        externalId,
        managedById,
        collaboraterIds,
        parentId,
        email,
        website,
        phone,
        vat,
        customFields,
      };
      // Make API call to create the corrugated format
      const response = await this.helpers.request!(
        {
          method: 'POST',
          url: `${baseUrl}/api/companies`,
          body: requestData,
          json: true,
        }
      );

      returnData.push({ json: response });
    } catch (error) {
      if (this.continueOnFail()) {
        returnData.push({ json: { error: error.message } });
        continue;
      }
      throw error;
    }
  }
  
  return returnData;
}
