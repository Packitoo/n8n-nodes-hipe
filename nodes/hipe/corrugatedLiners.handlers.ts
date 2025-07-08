import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';

export async function handleCorrugatedLiners(
    context: IExecuteFunctions,
    operation: string
): Promise<INodeExecutionData[]> {
    const returnData: any[] = [];

    if (operation === 'getAllCorrugatedLiner') {
        const returnAll = context.getNodeParameter('returnAll', 0) as boolean;
        const qs: Record<string, any> = {};
        let endpoint = '/api/corrugated-liners';
        if (!returnAll) {
            qs.limit = context.getNodeParameter('limit', 0);
        }
        const response = await context.helpers.requestWithAuthentication.call(context, "hipe", {
            method: 'GET',
            url: endpoint,
            qs,
            json: true,
        });
        returnData.push(...(response.data || response));
    } else if (operation === 'getByIdCorrugatedLiner') {
        const linerId = context.getNodeParameter('linerId', 0) as string;
        const endpoint = `/api/corrugated-liners/${linerId}`;
        const response = await context.helpers.requestWithAuthentication.call(context, "hipe", {
            method: 'GET',
            url: endpoint,
            json: true,
        });
        returnData.push(response.data || response);
    } else if (operation === 'createCorrugatedLiner') {
        const name = context.getNodeParameter('name', 0) as string;
        const description = context.getNodeParameter('description', 0) as string;
        const endpoint = '/api/corrugated-liners';
        const body: Record<string, any> = { name };
        if (description) body.description = description;
        const response = await context.helpers.requestWithAuthentication.call(context, "hipe", {
            method: 'POST',
            url: endpoint,
            body,
            json: true,
        });
        returnData.push(response.data || response);
    } else if (operation === 'updateCorrugatedLiner') {
        const linerId = context.getNodeParameter('linerId', 0) as string;
        const name = context.getNodeParameter('name', 0, '') as string;
        const description = context.getNodeParameter('description', 0, '') as string;
        const endpoint = `/api/corrugated-liners/${linerId}`;
        const body: Record<string, any> = {};
        if (name) body.name = name;
        if (description) body.description = description;
        const response = await context.helpers.requestWithAuthentication.call(context, "hipe", {
            method: 'PATCH',
            url: endpoint,
            body,
            json: true,
        });
        returnData.push(response.data || response);
    }
    return returnData.map(d => ({ json: d }));
}
