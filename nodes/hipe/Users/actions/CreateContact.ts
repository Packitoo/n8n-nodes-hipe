import { IExecuteFunctions } from 'n8n-workflow';
import { INodeExecutionData, INodeProperties } from 'n8n-workflow';
import { IUser } from '../../interfaces';

// Properties for the Create Contact
export const properties: INodeProperties[] = [
  {
    displayName: 'First Name',
    name: 'firstName',
    type: 'string',
    required: true,
    default: '',
    description: 'First name of the contact',
    displayOptions: {
      show: {
        resource: ['user'],
        operation: ['createContact']
      }
    },
  },
  {
    displayName: 'Last Name',
    name: 'lastName',
    type: 'string',
    default: '',
    description: 'Last name of the contact',
    displayOptions: {
      show: {
        resource: ['user'],
        operation: ['createContact']
      }
    },
  },
  {
    displayName: 'Email',
    name: 'email',
    type: 'string',
				placeholder: 'name@email.com',
    default: '',
    description: 'Email of the contact',
    displayOptions: {
      show: {
        resource: ['user'],
        operation: ['createContact']
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
        resource: ['user'],
        operation: ['createContact']
      }
    },
  },
  {
    displayName: 'Phone',
    name: 'phoneNumber',
    type: 'string',
    default: '',
    description: 'Phone number of the contact',
    displayOptions: {
      show: {
        resource: ['user'],
        operation: ['createContact']
      }
    },
  },
  {
    displayName: 'Mobile',
    name: 'mobilePhone',
    type: 'string',
    default: '',
    description: 'Mobile phone number of the contact',
    displayOptions: {
      show: {
        resource: ['user'],
        operation: ['createContact']
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
        resource: ['user'],
        operation: ['createContact']
      }
    },
    options: [
      {
        displayName: 'Job Title',
        name: 'job',
        type: 'string',
        default: '',
        description: 'Job title of the contact',
      },
      {
        displayName: 'Custom Fields',
        name: 'customFields',
        type: 'json',
        default: {},
        description: 'Custom fields of the contact',
      },
      // Add any additional fields specific to creating projects
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
      const firstName = this.getNodeParameter('firstName', i) as string;
      const lastName = this.getNodeParameter('lastName', i, '') as string;
      const email = this.getNodeParameter('email', i, '') as string;
      const externalId = this.getNodeParameter('externalId', i, '') as string;
      const phoneNumber = this.getNodeParameter('phoneNumber', i, '') as string;
      const mobilePhone = this.getNodeParameter('mobilePhone', i, '') as string;
      const job = this.getNodeParameter('job', i, '') as string;
      const customFields = this.getNodeParameter('customFields', i, {}) as object;
      
      // Prepare request data
      const requestData: IUser = {
        firstName,
        lastName,
        email,
        externalId,
        phoneNumber,
        mobilePhone,
        job,
        customFields,
      };
      // Make API call to create the corrugated format
      const response = await this.helpers.request!(
        {
          method: 'POST',
          url: `${baseUrl}/api/users/contacts`,
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
