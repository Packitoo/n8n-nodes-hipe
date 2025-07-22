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
        displayName: 'Collaborator Ids',
        name: 'collaboraterIds',
        type: 'fixedCollection',
        placeholder: 'Add Collaborator Id',
        default: {},
        typeOptions: {
          multipleValues: true,
        },
        options: [
          {
            name: 'collaboratorIdFields',
            displayName: 'Collaborator Id',
            values: [
              {
                displayName: 'Id',
                name: 'id',
                type: 'string',
                default: '',
                description: 'Collaborator Id',
              },
            ],
          },
        ],
        description: 'Add one or more Collaborator Ids',
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
			const additionalFields = this.getNodeParameter('additionalFields', i, {}) as ICompany;
      additionalFields.name = this.getNodeParameter('name', i) as string;
      additionalFields.managedById = this.getNodeParameter('managedById', i, '') as string;
      additionalFields.externalId = this.getNodeParameter('externalId', i, '') as string;


      let collab: string[] = [];
      // Transform collaboratorIds from fixedCollection to flat array
      const collaboratorIdsGroup: any = this.getNodeParameter('additionalFields', i, {}).collaboraterIds;
      console.debug('collaboratorIdsGroup', collaboratorIdsGroup);
      if (collaboratorIdsGroup && Array.isArray(collaboratorIdsGroup.collaboratorIdFields)) {
        console.debug('collaboratorIdsGroup', collaboratorIdsGroup.collaboratorIdFields);
        collab = collaboratorIdsGroup.collaboratorIdFields
          .map((entry: { id: string }) => entry.id)
          .filter((id: string) => !!id);
        console.debug('collab', collaboratorIdsGroup.collaboratorIdFields);
      }

      console.debug('collab', collab);
      delete (additionalFields as any).collaboraterIds;

      // Prepare request data
      const requestData: ICompany = {
        ...additionalFields,
        collaboratorIds: collab,
      };
      // Make API call to create the corrugated format
      const response = await this.helpers.requestWithAuthentication.call(this, 'hipe',
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
