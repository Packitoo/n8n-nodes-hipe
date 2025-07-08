import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';

export async function handleCorrugatedFlutes(
    context: IExecuteFunctions,
    operation: string
): Promise<INodeExecutionData[]> {
    const returnData: any[] = [];
    const credentials = await context.getCredentials("hipe");
    if (!credentials) {
        throw new Error('No credentials found');
    }
    const baseURL = credentials?.url as string;

    if (operation === 'getAllCorrugatedFlute') {
        const returnAll = context.getNodeParameter('returnAll', 0) as boolean;
        const qs: Record<string, any> = {};
        let endpoint = '/api/corrugated-flutes';
        if (!returnAll) {
            qs.limit = context.getNodeParameter('limit', 0);
        }
        const response = await context.helpers.requestWithAuthentication.call(context, "hipe", {
            method: 'GET',
            url: baseURL + endpoint,
            qs,
            json: true,
        });
        returnData.push(...(response.data || response));
    } else if (operation === 'getByIdCorrugatedFlute') {
        const fluteId = context.getNodeParameter('fluteId', 0) as string;
        const endpoint = `/api/corrugated-flutes/${fluteId}`;
        const response = await context.helpers.requestWithAuthentication.call(context, "hipe", {
            method: 'GET',
            url: baseURL + endpoint,
            json: true,
        });
        returnData.push(response.data || response);
    } else if (operation === 'createCorrugatedFlute') {
        const name = context.getNodeParameter('name', 0) as string;
        const description = context.getNodeParameter('description', 0) as string;
        const endpoint = '/api/corrugated-flutes';
        const body: Record<string, any> = { name };
        if (description) body.description = description;
        const response = await context.helpers.requestWithAuthentication.call(context, "hipe", {
            method: 'POST',
            url: baseURL + endpoint,
            body,
            json: true,
        });
        returnData.push(response.data || response);
    } else if (operation === 'updateCorrugatedFlute') {
        const fluteId = context.getNodeParameter('fluteId', 0) as string;
        const name = context.getNodeParameter('name', 0, '') as string;
        const description = context.getNodeParameter('description', 0, '') as string;
        const endpoint = `/api/corrugated-flutes/${fluteId}`;
        const body: Record<string, any> = {};
        if (name) body.name = name;
        if (description) body.description = description;
        const response = await context.helpers.requestWithAuthentication.call(context, "hipe", {
            method: 'PATCH',
            url: baseURL + endpoint,
            body,
            json: true,
        });
        returnData.push(response.data || response);
    }
    return returnData.map(d => ({ json: d }));
}
