import { DynamoDBToolboxError } from '~/errors/index.js'
import { anyOf, number, string } from '~/schema/index.js'

import { anyOfSchemaParser } from './anyOf.js'

describe('anyOfSchemaParser', () => {
  test('applies validation if any', () => {
    const anyOfA = anyOf(string(), number()).validate(input => typeof input === 'string')

    const { value: parsed } = anyOfSchemaParser(anyOfA, 'foo', { fill: false }).next()
    expect(parsed).toStrictEqual('foo')

    const invalidCallA = () =>
      anyOfSchemaParser(anyOfA, 42, { fill: false, valuePath: ['root'] }).next()

    expect(invalidCallA).toThrow(DynamoDBToolboxError)
    expect(invalidCallA).toThrow(
      expect.objectContaining({
        code: 'parsing.customValidationFailed',
        message: "Custom validation for attribute 'root' failed."
      })
    )

    const anyOfB = anyOf(string(), number()).validate(input =>
      typeof input === 'string' ? true : 'Oh no...'
    )

    const invalidCallB = () =>
      anyOfSchemaParser(anyOfB, 42, { fill: false, valuePath: ['root'] }).next()

    expect(invalidCallB).toThrow(DynamoDBToolboxError)
    expect(invalidCallB).toThrow(
      expect.objectContaining({
        code: 'parsing.customValidationFailed',
        message: "Custom validation for attribute 'root' failed with message: Oh no...."
      })
    )
  })
})
