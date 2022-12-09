import { isObject } from './isObject'

describe('isObject', () => {
  it('returns true if input is an object', () => {
    expect(isObject({ a: 1, b: 2 })).toBe(true)
  })

  it('returns false if input is not an object', () => {
    expect(isObject('not an object')).toBe(false)
  })
})
