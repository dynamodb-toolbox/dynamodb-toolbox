import { isBoolean } from './isBoolean'

describe('isBoolean', () => {
  it('returns true if input is a boolean', () => {
    expect(isBoolean(true)).toBe(true)
  })

  it('returns false if input is not a boolean', () => {
    expect(isBoolean('not a boolean')).toBe(false)
  })
})
