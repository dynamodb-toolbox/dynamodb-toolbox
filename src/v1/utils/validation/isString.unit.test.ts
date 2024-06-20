import { isString } from './isString.js'

describe('isString', () => {
  test('returns true if input is a string', () => {
    expect(isString('string')).toBe(true)
  })

  test('returns false if input is not a string', () => {
    expect(isString(1)).toBe(false)
  })
})
