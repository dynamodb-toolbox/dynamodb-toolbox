import { isFunction } from './isFunction'

describe('isFunction', () => {
  it('returns true if input is a function', () => {
    expect(isFunction(() => {})).toBe(true)
  })

  it('returns false if input is not a function', () => {
    expect(isFunction('not a function')).toBe(false)
  })
})
