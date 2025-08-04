import { IExecuteFunctions } from 'n8n-workflow';
import { INodeExecutionData, INodeProperties } from 'n8n-workflow';

// Properties for the Get operation
export const properties: INodeProperties[] = [
  {
    displayName: 'Project ID',
    name: 'projectId',
    type: 'string',
    required: true,
    default: '',
    description: 'ID of the project to retrieve files',
    displayOptions: {
      show: {
        resource: ['project'],
        operation: ['getFiles'],
      },
    },
  },
  {
    displayName: 'Options',
    name: 'options',
    type: 'collection',
    placeholder: 'Add Option',
    default: {},
    displayOptions: {
      show: {
        resource: ['project'],
        operation: ['getFiles'],
      },
    },
    options: [
      // Add any additional options for retrieving projects
    ],
  },
];

// Execute function for the Get operation
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
      const projectId = this.getNodeParameter('projectId', i) as string;
      // const options = this.getNodeParameter('options', i, {}) as { includeDetails?: boolean };

      const response = await this.helpers.requestWithAuthentication.call(this, "hipeApi", {
        method: 'GET',
        url: `${baseUrl}/api/projects/${projectId}/files`,
        json: true,
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
