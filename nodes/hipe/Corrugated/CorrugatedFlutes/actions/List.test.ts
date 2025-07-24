import * as List from './List';

describe('CorrugatedFlutes List Action', () => {
  it('should export properties array', () => {
    expect(Array.isArray(List.properties)).toBe(true);
  });

  it('should export an execute function', () => {
    expect(typeof List.execute).toBe('function');
  });
});
