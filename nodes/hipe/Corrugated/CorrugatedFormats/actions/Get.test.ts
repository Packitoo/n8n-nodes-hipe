import * as Get from './Get';

describe('CorrugatedFormats Get Action', () => {
	it('should export properties array', () => {
		expect(Array.isArray(Get.properties)).toBe(true);
	});

	it('should export an execute function', () => {
		expect(typeof Get.execute).toBe('function');
	});
});
