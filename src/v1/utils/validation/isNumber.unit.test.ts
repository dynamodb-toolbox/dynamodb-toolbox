import { isNumber } from './isNumber.js'

describe('isNumber', () => {
  it('returns true if input is a number', () => {
    expect(isNumber(1)).toBe(true)
  })

  it('returns false if input is not a number', () => {
    expect(isNumber('not a number')).toBe(false)
  })

  it('returns false if input is NaN', () => {
    expect(isNumber(NaN)).toBe(false)
  })
})
