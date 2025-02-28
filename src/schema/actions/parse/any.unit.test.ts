import { DynamoDBToolboxError } from '~/errors/index.js'
import { any } from '~/schema/any/index.js'
import { jsonStringify } from '~/transformers/jsonStringify.js'

import { anySchemaParser } from './any.js'

describe('anySchemaParser', () => {
  test('accepts any value', () => {
    const _any = any()
    const { value } = anySchemaParser(_any, 42, { fill: false }).next()
    expect(value).toStrictEqual(42)
  })

  test('uses parser if transformer has been provided', () => {
    const _any = any().transform(jsonStringify())

    const input = { foo: 'bar' }
    const parser = anySchemaParser(_any, input, { fill: false })

    const { value: parsed } = parser.next()
    expect(parsed).toStrictEqual(input)

    const { value: transformed, done } = parser.next()
    expect(transformed).toBe(JSON.stringify(input))
    expect(done).toBe(true)
  })

  test('applies validation if any', () => {
    const anyA = any().validate(input => input === 'foo')

    const invalidCallA = () =>
      anySchemaParser(anyA, 'bar', { fill: false, valuePath: ['root'] }).next()

    expect(invalidCallA).toThrow(DynamoDBToolboxError)
    expect(invalidCallA).toThrow(
      expect.objectContaining({
        code: 'parsing.customValidationFailed',
        message: "Custom validation for attribute 'root' failed."
      })
    )

    const anyB = any().validate(input => (input === 'foo' ? true : 'Oh no...'))

    const invalidCallB = () =>
      anySchemaParser(anyB, 'bar', { fill: false, valuePath: ['root'] }).next()

    expect(invalidCallB).toThrow(DynamoDBToolboxError)
    expect(invalidCallB).toThrow(
      expect.objectContaining({
        code: 'parsing.customValidationFailed',
        message: "Custom validation for attribute 'root' failed with message: Oh no...."
      })
    )
  })
})
