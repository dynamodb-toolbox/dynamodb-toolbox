import { isBinary } from './isBinary.js'

describe('isBinary', () => {
  it('returns true if input is a binary', () => {
    expect(isBinary(Buffer.from('binary'))).toBe(true)
  })

  it('returns false if input is not a binary', () => {
    expect(isBinary('not a binary')).toBe(false)
  })
})
