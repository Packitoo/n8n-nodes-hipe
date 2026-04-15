import { execute } from './Update';

describe('CorrugatedMaterialCompositions Update Action', () => {
	it('should update composition with minimumOrderQuantity (happy path)', async () => {
		const mockThis = {
			getCredentials: async () => ({ url: 'https://fake.api' }),
			helpers: {
				requestWithAuthentication: { call: jest.fn().mockResolvedValue({ updated: true }) },
			},
			getNodeParameter: (name: string, i: number, defaultValue?: any) => {
				if (name === 'compositionId') return 'comp-1';
				if (name === 'updateFields') {
					return {
						corrugatedMaterial: 'mat-2',
						minimumOrderQuantity: 2000,
					};
				}
				return defaultValue;
			},
			continueOnFail: () => false,
		} as any;
		const items = [{ json: {} }];
		const result = await execute.call(mockThis, items);
		expect(mockThis.helpers.requestWithAuthentication.call).toHaveBeenCalledWith(
			mockThis,
			'hipeApi',
			expect.objectContaining({
				method: 'PATCH',
				url: 'https://fake.api/api/corrugated-material-compositions/comp-1',
				body: expect.objectContaining({
					corrugatedMaterial: 'mat-2',
					minimumOrderQuantity: 2000,
				}),
			}),
		);
		expect(result[0].json).toEqual({ updated: true });
	});

	it('should update composition without minimumOrderQuantity', async () => {
		const mockThis = {
			getCredentials: async () => ({ url: 'https://fake.api' }),
			helpers: {
				requestWithAuthentication: { call: jest.fn().mockResolvedValue({ updated: true }) },
			},
			getNodeParameter: (name: string, i: number, defaultValue?: any) => {
				if (name === 'compositionId') return 'comp-1';
				if (name === 'updateFields') {
					return { flute: 'flute-2' };
				}
				return defaultValue;
			},
			continueOnFail: () => false,
		} as any;
		const items = [{ json: {} }];
		const result = await execute.call(mockThis, items);
		expect(mockThis.helpers.requestWithAuthentication.call).toHaveBeenCalledWith(
			mockThis,
			'hipeApi',
			expect.objectContaining({
				method: 'PATCH',
				url: 'https://fake.api/api/corrugated-material-compositions/comp-1',
				body: { flute: 'flute-2' },
			}),
		);
		expect(result[0].json).toEqual({ updated: true });
	});

	it('should handle errors when continueOnFail is true', async () => {
		const mockThis = {
			getCredentials: async () => ({ url: 'https://fake.api' }),
			helpers: {
				requestWithAuthentication: { call: jest.fn().mockRejectedValue(new Error('fail!')) },
			},
			getNodeParameter: (name: string, i: number, defaultValue?: any) => {
				if (name === 'compositionId') return 'comp-1';
				if (name === 'updateFields') return {};
				return defaultValue;
			},
			continueOnFail: () => true,
		} as any;
		const items = [{ json: {} }];
		const result = await execute.call(mockThis, items);
		expect(result[0].json).toEqual({ error: 'fail!' });
	});
});
