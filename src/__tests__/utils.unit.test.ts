import * as utils from '../lib/utils';

describe('utility functions',()=>{

  test('toBool', ()=>{
    expect(utils.toBool('true')).toBe(true)
    expect(utils.toBool(1)).toBe(true)
    expect(utils.toBool(true)).toBe(true)
    expect(utils.toBool('any')).toBe(true)
    expect(utils.toBool(false)).toBe(false)
    expect(utils.toBool('false')).toBe(false)
    expect(utils.toBool(0)).toBe(false)
    expect(utils.toBool('no')).toBe(false)
  })

  test('hasValue', ()=>{
    expect(utils.hasValue('string')).toBe(true)
    expect(utils.hasValue(1)).toBe(true)
    expect(utils.hasValue(true)).toBe(true)
    expect(utils.hasValue({})).toBe(true)
    expect(utils.hasValue([])).toBe(true)
    expect(utils.hasValue(false)).toBe(true)
    expect(utils.hasValue(undefined)).toBe(false)
    expect(utils.hasValue(null)).toBe(false)
  })

  test('error', () => {
    expect(() => { utils.error('test error') }).toThrow('test error')
  })
})
