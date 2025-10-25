import * as CreateBulk from './CreateBulk';

describe('CorrugatedMaterialCompositions CreateBulk Action', () => {
	it('should export properties array', () => {
		expect(Array.isArray(CreateBulk.properties)).toBe(true);
	});

	it('should export an execute function', () => {
		expect(typeof CreateBulk.execute).toBe('function');
	});
});
