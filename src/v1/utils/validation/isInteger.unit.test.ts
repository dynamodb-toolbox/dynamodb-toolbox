import { isInteger } from './isInteger.js'

describe('isInteger', () => {
  it('returns true if input is a number', () => {
    expect(isInteger(1)).toBe(true)
  })

  it('returns false if input is not a number', () => {
    expect(isInteger('not a number')).toBe(false)
  })

  it('returns false if input is NaN', () => {
    expect(isInteger(NaN)).toBe(false)
  })

  it('returns false if input is not an integer', () => {
    expect(isInteger(1.5)).toBe(false)
  })
})
