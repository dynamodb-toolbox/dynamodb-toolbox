import { toBool, hasValue, error, cloneDeep } from '../lib/utils';

describe('utility functions', () => {
  it('toBool', () => {
    expect(toBool('true')).toBe(true);
    expect(toBool(1)).toBe(true);
    expect(toBool(true)).toBe(true);
    expect(toBool('any')).toBe(true);
    expect(toBool(false)).toBe(false);
    expect(toBool('false')).toBe(false);
    expect(toBool(0)).toBe(false);
    expect(toBool('no')).toBe(false);
  });

  it('hasValue', () => {
    expect(hasValue('string')).toBe(true);
    expect(hasValue(1)).toBe(true);
    expect(hasValue(true)).toBe(true);
    expect(hasValue({})).toBe(true);
    expect(hasValue([])).toBe(true);
    expect(hasValue(false)).toBe(true);
    expect(hasValue(undefined)).toBe(false);
    expect(hasValue(null)).toBe(false);
  });

  it('error', () => {
    expect(() => {
      error('test error');
    }).toThrow('test error');
  });

  describe('cloneDeep', () => {
    it('should return a cloned object', () => {
      const original = {
        a: 1,
        b: {
          someNestedKey: 'someNestedValue',
        },
      };
      const clone = cloneDeep(original);

      expect(clone).toStrictEqual(original);
      expect(clone).not.toBe(original);

      clone.c = 3;

      expect(clone).toHaveProperty('c');
      expect(original).not.toHaveProperty('c');
    });
  });
});
