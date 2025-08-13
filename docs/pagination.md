# Pagination & Sorting Utilities

This repository provides a shared pagination module for HIPE nodes at `nodes/Hipe/Corrugated/shared/pagination.ts`.

There are two variants to support different API conventions:

- Bracketed query (Corrugated modules): `listWithPagination`
- Flat query (Companies/Projects and similar): `listWithPaginationFlat`

## Flat pagination (Companies, Projects, ...)

Use the flat builder when the API expects:
- `page` (number)
- `limit` (number)
- flat filter keys (e.g. `status`, `search`)
- `sort` as a single string in the format `"field,ASC|DESC"`

Example usage in an action execute:

```ts
import { listWithPaginationFlat } from '../../Corrugated/shared/pagination';

const response = await listWithPaginationFlat(this, '/api/companies/pagination', {
  returnAll,            // boolean
  limit,                // number | undefined
  page,                 // number
  filters,              // Record<string, any>
  sort: {               // optional
    sortBy: 'name',
    sortOrder: 'asc',   // 'asc' | 'desc' (will be uppercased for the API)
  },
});

items.push({ json: response });
```

Notes:
- When `returnAll` is true, the utility iterates pages until the API returns fewer than `limit` items or `pageCount` is reached (if present).
- When `returnAll` is false, only the specified `page` is requested with `limit`.
- `sortOrder` is normalized to uppercase in the outgoing `sort` string.

## Bracketed pagination (Corrugated modules)

Use `listWithPagination` and `buildQuery` when the API expects bracketed filter syntax (e.g. `filters[status]=active`) and more complex nested shapes. Existing Corrugated list actions (Flutes, Formats, Liners, Materials, MaterialCompositions, MaterialCompositionPrices, Suppliers) are already refactored to use this.

## Defaults

- `DEFAULT_SINGLE_PAGE_SIZE = 50` is used for single-page (non-returnAll) requests when no explicit limit is provided.
- `DEFAULT_ALL_PAGE_SIZE = 100` is used for `returnAll` iterative paging unless a limit is provided by the user.

## Testing pattern

- Mock `requestWithAuthentication.call` and assert:
  - correct endpoint URL (e.g. `/api/companies/pagination`)
  - `qs.page`, `qs.limit`, and flattened filters present
  - `qs.sort` equals `"field,ASC|DESC"` when sort is provided
- For `returnAll = true`, you can return an array or `{ data, pagination }` shape; the utility aggregates `data` arrays and returns `{ data: [...] }`.

## Migration checklist (for new List actions)

- Expose node params: `Return All`, `Limit`, `Page`, `Filters` (flat keys), `Sort` (`sortBy`, `sortOrder`).
- Call `listWithPaginationFlat` with these parameters.
- Ensure tests cover:
  - happy path
  - paginated response shape
  - error with `continueOnFail()`
  - query params (page/limit/filters/sort) mapping.
