import { toBool, hasValue, error, typeOf, hasSameTypes } from '../lib/utils'

describe('utility functions',()=>{

  test('toBool', ()=>{
    expect(toBool('true')).toBe(true)
    expect(toBool(1)).toBe(true)
    expect(toBool(true)).toBe(true)
    expect(toBool('any')).toBe(true)
    expect(toBool(false)).toBe(false)
    expect(toBool('false')).toBe(false)
    expect(toBool(0)).toBe(false)
    expect(toBool('no')).toBe(false)
  })

  test('hasValue', ()=>{
    expect(hasValue('string')).toBe(true)
    expect(hasValue(1)).toBe(true)
    expect(hasValue(true)).toBe(true)
    expect(hasValue({})).toBe(true)
    expect(hasValue([])).toBe(true)
    expect(hasValue(false)).toBe(true)
    expect(hasValue(undefined)).toBe(false)
    expect(hasValue(null)).toBe(false)
  })

  test('error', () => {
    expect(() => { error('test error') }).toThrow('test error')
  })

  describe('typeOf', () => {
    it('detects null type', () => {
      expect(typeOf(null)).toBe('null')
    })

    it('detects binary type', () => {
      expect(typeOf(new Int32Array())).toBe('Binary')
    })

    it('detects string type', () => {
      expect(typeOf('str')).toBe('String')
    })

    it('detects object type', () => {
      expect(typeOf(Object.create(null))).toBe('Object')
    })

    it('detects undefined type', () => {
      expect(typeOf()).toBe('undefined')
    })
  })

  describe('hasSameType', () => {
    it('should have same types for empty array', () => {
      expect(hasSameTypes([])).toBeTruthy()
    })

    it('should have same types for one element array', () => {
      expect(hasSameTypes([''])).toBeTruthy()
    })

    it('should have same types for all numbers array', () => {
      expect(hasSameTypes([1, 2])).toBeTruthy()
    })

    it('should have different types for string/numbers array', () => {
      expect(hasSameTypes([1, '2'])).toBeFalsy()
    })
  })
})
