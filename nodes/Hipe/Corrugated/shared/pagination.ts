import { IExecuteFunctions } from 'n8n-workflow';

export type SortOption = {
	// set to be used for Corrugated modules
	sortBy?: string;
	sortOrder?: 'asc' | 'desc';
};

export type ListPaginationOptions = {
	returnAll: boolean;
	limit?: number;
	page?: number;
	filters?: Record<string, any>;
	sort?: SortOption;
	defaultSinglePageSize?: number; // default 50
	defaultAllPageSize?: number; // default 100
};

// Shared defaults (exported as constants for reuse)
export const DEFAULT_SINGLE_PAGE_SIZE = 50;
export const DEFAULT_ALL_PAGE_SIZE = 100;

export async function getBaseUrl(execute: IExecuteFunctions): Promise<string> {
	const credentials = await execute.getCredentials('hipeApi');
	let baseUrl = (credentials as any).url;
	if (typeof baseUrl !== 'string') {
		throw new Error('HIPE base URL is not a string');
	}
	return baseUrl.replace(/\/$/, '');
}

export function buildQuery(
	page: number,
	pageSize: number,
	filters?: Record<string, any>,
	sort?: SortOption,
): Record<string, any> {
	// Bracketed query builder (Corrugated modules)
	const qs: Record<string, any> = { page, itemsPerPage: pageSize };
	if (filters) {
		for (const [key, value] of Object.entries(filters)) {
			if (value !== undefined && value !== '') {
				qs[`filters[${key}]`] = value as any;
			}
		}
	}
	if (sort?.sortBy) {
		qs[`order[${sort.sortBy}]`] = sort.sortOrder || 'asc';
	}
	return qs;
}

// Flat query builder (OpenAPI for Companies/Projects): page/limit and sort="field,ASC|DESC"
export function buildFlatQuery(
	page: number,
	pageSize: number,
	filters?: Record<string, any>,
	sort?: SortOption,
): Record<string, any> {
	const qs: Record<string, any> = { page, limit: pageSize };
	if (filters) {
		for (const [key, value] of Object.entries(filters)) {
			if (value !== undefined && value !== '') {
				qs[key] = value as any;
			}
		}
	}
	if (sort?.sortBy) {
		const dir = (sort.sortOrder || 'asc').toUpperCase();
		qs['sort'] = `${sort.sortBy},${dir}`;
	}
	return qs;
}

async function requestPage(
	execute: IExecuteFunctions,
	baseUrl: string,
	endpoint: string,
	qs: Record<string, any>,
): Promise<any> {
	return await (execute.helpers as any).requestWithAuthentication.call(execute, 'hipeApi', {
		method: 'GET',
		url: `${baseUrl}${endpoint}`,
		qs,
		json: true,
	});
}

export async function listWithPagination(
	execute: IExecuteFunctions,
	endpoint: string,
	options: ListPaginationOptions,
): Promise<any> {
	const baseUrl = await getBaseUrl(execute);
	const {
		returnAll,
		limit,
		page = 1,
		filters,
		sort,
		defaultSinglePageSize = 50,
		defaultAllPageSize = 100,
	} = options;

	if (returnAll) {
		const pageSize = limit ?? defaultAllPageSize;
		let current = 1;
		const aggregated: any[] = [];
		for (;;) {
			const response = await requestPage(
				execute,
				baseUrl,
				endpoint,
				buildQuery(current, pageSize, filters, sort),
			);
			const pageItems = Array.isArray(response)
				? response
				: Array.isArray(response?.data)
					? response.data
					: ([] as any[]);
			aggregated.push(...pageItems);
			const pageCount =
				(response && (response.pageCount || response.pagination?.pageCount)) || undefined;
			if (pageItems.length < pageSize || (pageCount && current >= pageCount)) break;
			current += 1;
		}
		return { data: aggregated };
	} else {
		const response = await requestPage(
			execute,
			baseUrl,
			endpoint,
			buildQuery(page, (limit ?? defaultSinglePageSize) as number, filters, sort),
		);
		if (Array.isArray(response)) {
			return { data: response };
		} else if (response?.data) {
			return response;
		} else {
			return { data: response };
		}
	}
}

// Flat variant for OpenAPI-compliant endpoints (Companies/Projects)
export async function listWithPaginationFlat(
	execute: IExecuteFunctions,
	endpoint: string,
	options: ListPaginationOptions,
): Promise<any> {
	const baseUrl = await getBaseUrl(execute);
	const {
		returnAll,
		limit,
		page = 1,
		filters,
		sort,
		defaultSinglePageSize = DEFAULT_SINGLE_PAGE_SIZE,
		defaultAllPageSize = DEFAULT_ALL_PAGE_SIZE,
	} = options;

	if (returnAll) {
		const pageSize = limit ?? defaultAllPageSize;
		let current = 1;
		const aggregated: any[] = [];
		for (;;) {
			const response = await requestPage(
				execute,
				baseUrl,
				endpoint,
				buildFlatQuery(current, pageSize, filters, sort),
			);
			const pageItems = Array.isArray(response)
				? response
				: Array.isArray(response?.data)
					? response.data
					: ([] as any[]);
			aggregated.push(...pageItems);
			const pageCount =
				(response && (response.pageCount || response.pagination?.pageCount)) || undefined;
			if (pageItems.length < pageSize || (pageCount && current >= pageCount)) break;
			current += 1;
		}
		return { data: aggregated };
	} else {
		const response = await requestPage(
			execute,
			baseUrl,
			endpoint,
			buildFlatQuery(page, (limit ?? defaultSinglePageSize) as number, filters, sort),
		);
		if (Array.isArray(response)) {
			return { data: response };
		} else if (response?.data) {
			return response;
		} else {
			return { data: response };
		}
	}
}
