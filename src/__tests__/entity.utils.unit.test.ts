import { shouldExecute, shouldParse } from '../classes/Entity'

describe('Entity - utils', () => {
  it('should execute', () => {
    expect(shouldExecute(true, true)).toBe(true)
    expect(shouldExecute(true, false)).toBe(true)
    expect(shouldExecute(undefined, true)).toBe(true)
  })
  it('should not execute', () => {
    expect(shouldExecute(false, false)).toBe(false)
    expect(shouldExecute(undefined, false)).toBe(false)
    expect(shouldExecute(false, true)).toBe(false)
  })
  it('should parse', () => {
    expect(shouldParse(true, true)).toBe(true)
    expect(shouldParse(true, false)).toBe(true)
    expect(shouldParse(undefined, true)).toBe(true)
  })
  it('should not parse', () => {
    expect(shouldParse(false, false)).toBe(false)
    expect(shouldParse(undefined, false)).toBe(false)
    expect(shouldParse(false, true)).toBe(false)
  })
})
