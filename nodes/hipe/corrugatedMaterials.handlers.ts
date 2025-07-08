import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';

export async function handleCorrugatedMaterials(
    context: IExecuteFunctions,
    operation: string
): Promise<INodeExecutionData[]> {
    const returnData: any[] = [];

    if (operation === 'getAllCorrugatedMaterial') {
        const returnAll = context.getNodeParameter('returnAll', 0) as boolean;
        const qs: Record<string, any> = {};
        let endpoint = '/api/corrugated-materials';
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
    } else if (operation === 'getByIdCorrugatedMaterial') {
        const materialId = context.getNodeParameter('materialId', 0) as string;
        const endpoint = `/api/corrugated-materials/${materialId}`;
        const response = await context.helpers.requestWithAuthentication.call(context, "hipe", {
            method: 'GET',
            url: endpoint,
            json: true,
        });
        returnData.push(response.data || response);
    } else if (operation === 'createCorrugatedMaterial') {
        const name = context.getNodeParameter('name', 0) as string;
        const description = context.getNodeParameter('description', 0) as string;
        const endpoint = '/api/corrugated-materials';
        const body: Record<string, any> = { name };
        if (description) body.description = description;
        const response = await context.helpers.requestWithAuthentication.call(context, "hipe", {
            method: 'POST',
            url: endpoint,
            body,
            json: true,
        });
        returnData.push(response.data || response);
    } else if (operation === 'updateCorrugatedMaterial') {
        const materialId = context.getNodeParameter('materialId', 0) as string;
        const name = context.getNodeParameter('name', 0, '') as string;
        const description = context.getNodeParameter('description', 0, '') as string;
        const endpoint = `/api/corrugated-materials/${materialId}`;
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
