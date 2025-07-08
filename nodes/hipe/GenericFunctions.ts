import { IExecuteFunctions } from 'n8n-workflow';

/**
 * Make an authenticated API request to the HIPE API
 */
export async function hipeApiRequest(this: IExecuteFunctions, method: string, endpoint: string, body: any = {}, qs: any = {}, option: any = {}): Promise<any> {
    const credentials = await this.getCredentials("hipe");

    const options = {
        method,
        url: endpoint,
        body,
        qs,
        json: true,
        headers: {
            'X-ACCESS-TOKEN': credentials.accessToken,
        },
        ...option,
    };

    try {
        // @ts-ignore
        return await this.helpers.requestWithAuthentication.call(this, "hipe", options);
    } catch (error) {
        throw new Error(`HIPE API request failed: ${error.message}`);
    }
}
