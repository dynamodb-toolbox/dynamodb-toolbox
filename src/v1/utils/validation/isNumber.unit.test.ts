import { isNumber } from './isNumber.js'

describe('isNumber', () => {
  test('returns true if input is a number', () => {
    expect(isNumber(1)).toBe(true)
  })

  test('returns false if input is not a number', () => {
    expect(isNumber('not a number')).toBe(false)
  })

  test('returns false if input is NaN', () => {
    expect(isNumber(NaN)).toBe(false)
  })
})
