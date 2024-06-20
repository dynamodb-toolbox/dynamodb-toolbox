import { isSet } from './isSet.js'

describe('isSet', () => {
  test('returns true if input is a set', () => {
    expect(isSet(new Set())).toBe(true)
  })

  test('returns false if input is not a set', () => {
    expect(isSet('not an set')).toBe(false)
  })
})
