import { IAuthenticateGeneric, ICredentialType, INodeProperties } from 'n8n-workflow';

export class HipeApi implements ICredentialType {
	name = 'hipeApi';
	displayName = 'Hipe API';
	// Uses the link to this tutorial as an example
	// Replace with your own docs links when building your own nodes
	documentationUrl = 'https://developers.packitoo.com/guides/create-access-token/';
	properties: INodeProperties[] = [
		{
			displayName: 'Access Token',
			name: 'accessToken',
			type: 'string',
			typeOptions: { password: true },
			default: '',
		},
		{
			displayName: 'Base URL',
			name: 'url',
			type: 'string',
			default: 'https://<NAME>-hipe.packitoo.com',
			description: 'Replace <NAME> with your name like https://packitoo-hipe.packitoo.com',
		},
	];
	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				'X-ACCESS-TOKEN': '={{$credentials.accessToken}}',
			},
		},
	};

	// Enable "Test Credentials" button in n8n credential UI
	test = {
		request: {
			baseURL: '={{$credentials?.url}}',
			url: '/api/users/me',
			method: 'GET' as const,
		},
	};
}

