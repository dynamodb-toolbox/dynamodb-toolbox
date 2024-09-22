import { isBigInt } from './isBigInt.js'

describe('isBigInt', () => {
  test('returns true if input is a BigInt', () => {
    expect(isBigInt(BigInt('1000000000'))).toBe(true)
  })

  test('returns false if input is not a BigInt', () => {
    expect(isBigInt('not a bigint')).toBe(false)
  })
})
