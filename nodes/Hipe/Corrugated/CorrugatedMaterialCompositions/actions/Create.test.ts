import { execute } from './Create';

describe('CorrugatedMaterialCompositions Create Action', () => {
	it('should create composition with minimumOrderQuantity (happy path)', async () => {
		const mockThis = {
			getCredentials: async () => ({ url: 'https://fake.api' }),
			helpers: {
				requestWithAuthentication: { call: jest.fn().mockResolvedValue({ created: true }) },
			},
			getNodeParameter: (name: string, i: number, defaultValue?: any) => {
				if (name === 'additionalFields') {
					return { minimumOrderQuantity: 1000 };
				}
				const params: { [key: string]: any } = {
					corrugatedMaterial: 'mat-1',
					flute: 'flute-1',
					liners: ['liner-1', 'liner-2'],
				};
				return params[name] !== undefined ? params[name] : defaultValue;
			},
			continueOnFail: () => false,
		} as any;
		const items = [{ json: {} }];
		const result = await execute.call(mockThis, items);
		expect(mockThis.helpers.requestWithAuthentication.call).toHaveBeenCalledWith(
			mockThis,
			'hipeApi',
			expect.objectContaining({
				method: 'POST',
				url: 'https://fake.api/api/corrugated-material-compositions',
				body: expect.objectContaining({
					corrugatedMaterial: 'mat-1',
					flute: 'flute-1',
					liners: ['liner-1', 'liner-2'],
					minimumOrderQuantity: 1000,
				}),
			}),
		);
		expect(result[0].json).toEqual({ created: true });
	});

	it('should create composition without minimumOrderQuantity', async () => {
		const mockThis = {
			getCredentials: async () => ({ url: 'https://fake.api' }),
			helpers: {
				requestWithAuthentication: { call: jest.fn().mockResolvedValue({ created: true }) },
			},
			getNodeParameter: (name: string, i: number, defaultValue?: any) => {
				if (name === 'additionalFields') return {};
				const params: { [key: string]: any } = {
					corrugatedMaterial: 'mat-1',
					flute: 'flute-1',
					liners: ['liner-1'],
				};
				return params[name] !== undefined ? params[name] : defaultValue;
			},
			continueOnFail: () => false,
		} as any;
		const items = [{ json: {} }];
		const result = await execute.call(mockThis, items);
		expect(mockThis.helpers.requestWithAuthentication.call).toHaveBeenCalledWith(
			mockThis,
			'hipeApi',
			expect.objectContaining({
				method: 'POST',
				url: 'https://fake.api/api/corrugated-material-compositions',
				body: {
					corrugatedMaterial: 'mat-1',
					flute: 'flute-1',
					liners: ['liner-1'],
				},
			}),
		);
		expect(result[0].json).toEqual({ created: true });
	});

	it('should handle errors when continueOnFail is true', async () => {
		const mockThis = {
			getCredentials: async () => ({ url: 'https://fake.api' }),
			helpers: {
				requestWithAuthentication: { call: jest.fn().mockRejectedValue(new Error('fail!')) },
			},
			getNodeParameter: (name: string, i: number, defaultValue?: any) => {
				if (name === 'additionalFields') return {};
				const params: { [key: string]: any } = {
					corrugatedMaterial: 'mat-1',
					flute: 'flute-1',
					liners: ['liner-1'],
				};
				return params[name] !== undefined ? params[name] : defaultValue;
			},
			continueOnFail: () => true,
		} as any;
		const items = [{ json: {} }];
		const result = await execute.call(mockThis, items);
		expect(result[0].json).toEqual({ error: 'fail!' });
	});
});
