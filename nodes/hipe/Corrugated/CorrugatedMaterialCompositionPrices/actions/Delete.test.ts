import * as Delete from './Delete';

describe('CorrugatedMaterialCompositionPrices Delete Action', () => {
  it('should export properties array', () => {
    expect(Array.isArray(Delete.properties)).toBe(true);
  });

  it('should export an execute function', () => {
    expect(typeof Delete.execute).toBe('function');
  });
});
