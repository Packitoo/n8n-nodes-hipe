import { INodeProperties } from 'n8n-workflow';

// Reusable property for async mode in CUD operations
export const asyncModeProperty: INodeProperties = {
	displayName: 'Async Mode',
	name: 'asyncMode',
	type: 'boolean',
	default: false,
	description: 'Whether to use asynchronous processing (returns a job ID instead of waiting for completion)',
	displayOptions: {
		show: {
			// This will be overridden by each resource/operation
		},
	},
};

// Helper function to add Prefer header for async mode
export function getAsyncHeaders(asyncMode: boolean): Record<string, string> {
	if (asyncMode) {
		return {
			'Prefer': 'respond-async',
		};
	}
	return {};
}
