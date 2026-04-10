import * as create from './Create';
import * as get from './Get';
import * as list from './List';
import * as updateProgress from './UpdateProgress';
import * as appendLogs from './AppendLogs';
import * as complete from './Complete';
import * as fail from './Fail';
import * as cancel from './Cancel';
import { RESOURCES, OPERATIONS } from '../../constants';

export const RESOURCE = RESOURCES.JOB;

export const ACTIONS = {
	create: create,
	get: get,
	getMany: list,
	updateProgress: updateProgress,
	appendLogs: appendLogs,
	complete: complete,
	fail: fail,
	cancel: cancel,
};

export function buildProperties() {
	const properties = [
		{
			displayName: 'Operation',
			name: 'operation',
			type: 'options',
			default: OPERATIONS.CREATE,
			displayOptions: {
				show: { resource: [RESOURCE] },
			},
			options: [
				{
					name: 'Append Logs',
					value: OPERATIONS.APPEND_LOGS,
					description: 'Append log entries to a job',
					action: 'Append log entries to a job',
				},
				{
					name: 'Cancel',
					value: OPERATIONS.CANCEL,
					description: 'Cancel a job',
					action: 'Cancel a job',
				},
				{
					name: 'Complete',
					value: OPERATIONS.COMPLETE,
					description: 'Mark a job as succeeded',
					action: 'Mark a job as succeeded',
				},
				{
					name: 'Create',
					value: OPERATIONS.CREATE,
					description: 'Create a new job',
					action: 'Create a new job',
				},
				{
					name: 'Fail',
					value: OPERATIONS.FAIL,
					description: 'Mark a job as failed',
					action: 'Mark a job as failed',
				},
				{
					name: 'Get',
					value: OPERATIONS.GET,
					description: 'Get a specific job',
					action: 'Get a specific job',
				},
				{
					name: 'Get Many',
					value: OPERATIONS.GET_MANY,
					description: 'Get multiple jobs',
					action: 'Get multiple jobs',
				},
				{
					name: 'Update Progress',
					value: OPERATIONS.UPDATE_PROGRESS,
					description: 'Update job progress and optionally append a log',
					action: 'Update job progress',
				},
			],
			noDataExpression: true,
		},
		...create.properties,
		...get.properties,
		...list.properties,
		...updateProgress.properties,
		...appendLogs.properties,
		...complete.properties,
		...fail.properties,
		...cancel.properties,
	];
	return [RESOURCE, properties];
}
