/**
 * Shared constants for resource and operation names used across all Hipe modules.
 * These are referenced in displayOptions throughout the node definitions.
 */

// ─── Resource Names ──────────────────────────────────────────────────────────
export const RESOURCES = {
	ADDRESS: 'address',
	ARTICLE: 'article',
	BRIEF_ELEMENT: 'briefElement',
	COMPANY: 'company',
	CORRUGATED_FLUTE: 'corrugatedFlute',
	CORRUGATED_FORMAT: 'corrugatedFormat',
	CORRUGATED_LINER: 'corrugatedLiner',
	CORRUGATED_MATERIAL: 'corrugatedMaterial',
	CORRUGATED_MATERIAL_COMPOSITION: 'corrugatedMaterialComposition',
	CORRUGATED_MATERIAL_COMPOSITION_PRICE: 'corrugatedMaterialCompositionPrice',
	CORRUGATED_SUPPLIER: 'corrugatedSupplier',
	CURRENCY: 'currency',
	EXPORT: 'export',
	IMPORT: 'import',
	ORDER: 'order',
	ORDER_ITEM: 'orderItem',
	PIPELINES: 'pipelines',
	PROJECT: 'project',
	JOB: 'job',
	STATUSES: 'statuses',
	USER: 'user',
} as const;

// ─── Operation Names ─────────────────────────────────────────────────────────
export const OPERATIONS = {
	ADD_BRIEF_ELEMENT: 'addBriefElement',
	ADD_EXISTING_CONTACT: 'addExistingContact',
	ADD_ITEMS: 'addItems',
	ARCHIVE: 'archive',
	CREATE: 'create',
	CREATE_BULK: 'createBulk',
	CREATE_CONTACT: 'createContact',
	DELETE: 'delete',
	DELETE_FILE: 'deleteFile',
	DOWNLOAD: 'download',
	GET: 'get',
	GET_ADDRESSES: 'getAddresses',
	GET_FILES: 'getFiles',
	GET_MANY: 'getMany',
	GET_ME: 'getMe',
	HARD_DELETE: 'hardDelete',
	LINK_CONTACT: 'linkContact',
	LIST: 'list',
	REMOVE_ITEM: 'removeItem',
	SEARCH: 'search',
	SET_PREVIEW: 'setPreview',
	UNARCHIVE: 'unarchive',
	UNLINK_CONTACT: 'unlinkContact',
	UPDATE: 'update',
	UPDATE_PROGRESS: 'updateProgress',
	APPEND_LOGS: 'appendLogs',
	COMPLETE: 'complete',
	FAIL: 'fail',
	CANCEL: 'cancel',
	UPLOAD_FILE: 'uploadFile',
} as const;

export type ResourceName = (typeof RESOURCES)[keyof typeof RESOURCES];
export type OperationName = (typeof OPERATIONS)[keyof typeof OPERATIONS];

// ─── Field Constants ─────────────────────────────────────────────────────────
export const CUSTOM_FIELDS = {
	name: 'customFields',
	displayName: 'Custom Fields',
} as const;

export const CREATED_AT = {
	name: 'createdAt',
	displayName: 'Created At',
} as const;
