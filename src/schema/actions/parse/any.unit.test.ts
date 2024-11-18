import { any } from '~/attributes/any/index.js'
import { DynamoDBToolboxError } from '~/errors/index.js'

import { anyAttrParser } from './any.js'

describe('anyAttrParser', () => {
  test('accepts any value', () => {
    const _any = any().freeze('root')
    const { value } = anyAttrParser(_any, 42, { fill: false }).next()
    expect(value).toStrictEqual(42)
  })

  test('applies validation if any', () => {
    const anyA = any()
      .validate(input => input === 'foo')
      .freeze()

    const invalidCallA = () =>
      anyAttrParser(anyA, 'bar', { fill: false, valuePath: ['root'] }).next()

    expect(invalidCallA).toThrow(DynamoDBToolboxError)
    expect(invalidCallA).toThrow(
      expect.objectContaining({
        code: 'parsing.customValidationFailed',
        message: "Custom validation for attribute 'root' failed."
      })
    )

    const anyB = any()
      .validate(input => (input === 'foo' ? true : 'Oh no...'))
      .freeze('root')

    const invalidCallB = () =>
      anyAttrParser(anyB, 'bar', { fill: false, valuePath: ['root'] }).next()

    expect(invalidCallB).toThrow(DynamoDBToolboxError)
    expect(invalidCallB).toThrow(
      expect.objectContaining({
        code: 'parsing.customValidationFailed',
        message: "Custom validation for attribute 'root' failed with message: Oh no...."
      })
    )
  })
})
