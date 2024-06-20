import { isArray } from './isArray.js'

describe('isArray', () => {
  it('returns true if input is an array', () => {
    expect(isArray([1, 2, 3])).toBe(true)
  })

  it('returns false if input is not an array', () => {
    expect(isArray('not an array')).toBe(false)
  })
})
