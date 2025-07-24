import * as Create from './Create';

describe('CorrugatedMaterials Create Action', () => {
  it('should export properties array', () => {
    expect(Array.isArray(Create.properties)).toBe(true);
  });

  it('should export an execute function', () => {
    expect(typeof Create.execute).toBe('function');
  });
});
