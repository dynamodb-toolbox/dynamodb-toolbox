import { isPrimitive } from './isPrimitive.js'

describe('isPrimitive', () => {
  it('returns true if input is a boolean', () => {
    expect(isPrimitive(true)).toBe(true)
  })

  it('returns true if input is a number', () => {
    expect(isPrimitive(1)).toBe(true)
  })

  it('returns false if input is NaN', () => {
    expect(isPrimitive(NaN)).toBe(false)
  })

  it('returns true if input is a string', () => {
    expect(isPrimitive('string')).toBe(true)
  })

  it('returns true if input is a binary', () => {
    expect(isPrimitive(Buffer.from('binary'))).toBe(true)
  })

  it('returns false if input is not a primitive', () => {
    expect(isPrimitive({ foo: 'bar' })).toBe(false)
  })
})
