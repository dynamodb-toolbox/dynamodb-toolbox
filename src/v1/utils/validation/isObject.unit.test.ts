import { isObject } from './isObject.js'

describe('isObject', () => {
  test('returns true if input is an object', () => {
    expect(isObject({ a: 1, b: 2 })).toBe(true)
  })

  test('returns false if input is not an object', () => {
    expect(isObject('not an object')).toBe(false)
  })
})
