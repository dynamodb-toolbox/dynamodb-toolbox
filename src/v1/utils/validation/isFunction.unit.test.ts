import { isFunction } from './isFunction.js'

describe('isFunction', () => {
  test('returns true if input is a function', () => {
    expect(isFunction(() => null)).toBe(true)
  })

  test('returns false if input is not a function', () => {
    expect(isFunction('not a function')).toBe(false)
  })
})
