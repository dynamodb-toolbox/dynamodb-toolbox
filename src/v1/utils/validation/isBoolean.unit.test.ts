import { isBoolean } from './isBoolean.js'

describe('isBoolean', () => {
  test('returns true if input is a boolean', () => {
    expect(isBoolean(true)).toBe(true)
  })

  test('returns false if input is not a boolean', () => {
    expect(isBoolean('not a boolean')).toBe(false)
  })
})
