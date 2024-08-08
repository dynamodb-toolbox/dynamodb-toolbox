import { anyOf, number, string } from '~/attributes/index.js'
import { DynamoDBToolboxError } from '~/errors/index.js'

import { anyOfAttributeParser } from './anyOf.js'

describe('anyOfAttributeParser', () => {
  test('applies validation if any', () => {
    const anyOfA = anyOf(string(), number())
      .validate(input => typeof input === 'string')
      .freeze('root')

    const { value: parsed } = anyOfAttributeParser(anyOfA, 'foo', { fill: false }).next()
    expect(parsed).toStrictEqual('foo')

    const invalidCallA = () => anyOfAttributeParser(anyOfA, 42, { fill: false }).next()

    expect(invalidCallA).toThrow(DynamoDBToolboxError)
    expect(invalidCallA).toThrow(
      expect.objectContaining({
        code: 'parsing.customValidationFailed',
        message: "Custom validation for attribute 'root' failed."
      })
    )

    const anyOfB = anyOf(string(), number())
      .validate(input => (typeof input === 'string' ? true : 'Oh no...'))
      .freeze('root')

    const invalidCallB = () => anyOfAttributeParser(anyOfB, 42, { fill: false }).next()

    expect(invalidCallB).toThrow(DynamoDBToolboxError)
    expect(invalidCallB).toThrow(
      expect.objectContaining({
        code: 'parsing.customValidationFailed',
        message: "Custom validation for attribute 'root' failed with message: Oh no...."
      })
    )
  })
})
