import { properties as propertiesCreateAddress } from '../../Addresses/actions/create';
import { IExecuteFunctions, INodeExecutionData, INodeProperties } from 'n8n-workflow';

export const properties: INodeProperties[] = [
    ...propertiesCreateAddress,
];

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
        const companyId = this.getNodeParameter('companyId', i) as string;
        const address = this.getNodeParameter('address', i) as string;
        const city = this.getNodeParameter('city', i) as string;
        const country = this.getNodeParameter('country', i) as string;
        const firstComplementaryAddress = this.getNodeParameter('firstComplementaryAddress', i) as string;
        const name = this.getNodeParameter('name', i) as string;
        const position = this.getNodeParameter('position', i) as number;
        const secondComplementaryAddress = this.getNodeParameter('secondComplementaryAddress', i) as string;
        const state = this.getNodeParameter('state', i) as string;
        const zipCode = this.getNodeParameter('zipCode', i) as string;
        try {
            // Get input data
            // const options = this.getNodeParameter('options', i, {}) as { includeDetails?: boolean };

            // Make API call to get the corrugated format
            const response = await this.helpers.requestWithAuthentication.call(this, 'hipeApi', {
                method: 'POST',
                url: `${baseUrl}/api/addresses`,
                json: true,
                body: {
                    companyId,
                    address,
                    city,
                    country,
                    firstComplementaryAddress,
                    name,
                    position,
                    secondComplementaryAddress,
                    state,
                    zipCode,
                }
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