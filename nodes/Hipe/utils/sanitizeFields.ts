import { IDataObject } from 'n8n-workflow';
import { CUSTOM_FIELDS } from '../constants';

/**
 * Sanitizes additional/update fields from n8n node parameters:
 * - Removes null values
 * - Parses `customFields` from JSON string to object if needed
 */
export function sanitizeFields(raw: IDataObject): IDataObject {
	const result: IDataObject = {};
	for (const [key, value] of Object.entries(raw)) {
		if (value !== null) {
			result[key] = key === CUSTOM_FIELDS.name && typeof value === 'string' ? JSON.parse(value) : value;
		}
	}
	return result;
}
