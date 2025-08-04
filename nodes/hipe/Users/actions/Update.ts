import { IExecuteFunctions } from 'n8n-workflow';
import { INodeExecutionData, INodeProperties } from 'n8n-workflow';
import { IUser } from '../../interfaces';

// Properties for the Update operation
export const properties: INodeProperties[] = [
  {
    displayName: 'User ID',
    name: 'id',
    type: 'string',
    required: true,
    default: '',
    description: 'ID of the user to update',
    displayOptions: {
      show: {
        resource: ['user'],
        operation: ['update'],
      },
    },
  },
  {
    displayName: 'Update Fields',
    name: 'updateFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: {
      show: {
        resource: ['user'],
        operation: ['update'],
      },
    },
    options: [
      {
        displayName: 'First Name',
        name: 'firstName',
        type: 'string',
        default: '',
        description: 'First name of the user',
      },
      {
        displayName: 'Last Name',
        name: 'lastName',
        type: 'string',
        default: '',
        description: 'Last name of the user',
      },
      {
        displayName: 'Email',
        name: 'email',
        type: 'string',
								placeholder: 'name@email.com',
        default: '',
        description: 'Email of the user',
      },
      {
        displayName: 'External ID',
        name: 'externalId',
        type: 'string',
        default: '',
        description: 'External ID of the user',
      },
      {
        displayName: 'Role',
        name: 'role',
        type: 'options',
        options: [
          {
            name: 'Super Admin',
            value: 'superadmin',
          },
          {
            name: 'Admin',
            value: 'admin',
          },
          {
            name: 'Sales',
            value: 'sales',
          },
          {
            name: 'External Sales',
            value: 'external_sales',
          },
          {
            name: 'Contact',
            value: 'contact',
          },
          {
            name: 'Guest',
            value: 'guest',
          }
        ],
        default: 'guest',
        description: 'Role of the user',
      },
      {
        displayName: 'Phone',
        name: 'phoneNumber',
        type: 'string',
        default: '',
        description: 'Phone number of the user',
      },
      {
        displayName: 'Mobile',
        name: 'mobilePhone',
        type: 'string',
        default: '',
        description: 'Mobile phone number of the user',
      },
      {
        displayName: 'Custom Fields',
        name: 'customFields',
        type: 'json',
        default: {},
        description: 'Custom fields of the user',
      },
      // Add any additional fields specific to updating projects
    ],
  },
];

// Execute function for the Update operation
export async function execute(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];

  // Get credentials
  const credentials = await this.getCredentials('hipeApi');
  let baseUrl = credentials.url;
  if (typeof baseUrl !== 'string') {
    throw new Error('HIPE base URL is not a string');
  }
  baseUrl = baseUrl.replace(/\/$/, '');
  
  // Process each item
  for (let i = 0; i < items.length; i++) {
    try {
      // Get input data
      const userId = this.getNodeParameter('id', i) as string;
      const updateFields = this.getNodeParameter('updateFields', i, {}) as IUser;
      
      // Make API call to update the user
      const response = await this.helpers.request!({
        method: 'PATCH',
        url: `${baseUrl}/api/users/${encodeURIComponent(userId)}`,
        json: true,
        body: updateFields,
      });
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
