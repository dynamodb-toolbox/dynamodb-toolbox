import { isInteger } from './isInteger.js'

describe('isInteger', () => {
  test('returns true if input is a number', () => {
    expect(isInteger(1)).toBe(true)
  })

  test('returns false if input is not a number', () => {
    expect(isInteger('not a number')).toBe(false)
  })

  test('returns false if input is NaN', () => {
    expect(isInteger(NaN)).toBe(false)
  })

  test('returns false if input is not an integer', () => {
    expect(isInteger(1.5)).toBe(false)
  })
})
