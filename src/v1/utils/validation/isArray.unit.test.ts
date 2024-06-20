import { isArray } from './isArray.js'

describe('isArray', () => {
  test('returns true if input is an array', () => {
    expect(isArray([1, 2, 3])).toBe(true)
  })

  test('returns false if input is not an array', () => {
    expect(isArray('not an array')).toBe(false)
  })
})
