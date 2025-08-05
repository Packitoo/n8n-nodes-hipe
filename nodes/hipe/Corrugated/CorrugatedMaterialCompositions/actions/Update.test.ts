import * as Update from './Update';

describe('CorrugatedMaterialCompositions Update Action', () => {
	it('should export properties array', () => {
		expect(Array.isArray(Update.properties)).toBe(true);
	});

	it('should export an execute function', () => {
		expect(typeof Update.execute).toBe('function');
	});
});
