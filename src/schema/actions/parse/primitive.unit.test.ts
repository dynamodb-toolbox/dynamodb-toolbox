import { string } from '~/attributes/string/index.js'
import { DynamoDBToolboxError } from '~/errors/index.js'
import { prefix } from '~/transformers/prefix.js'

import { primitiveSchemaParser } from './primitive.js'

describe('primitiveSchemaParser', () => {
  test('throws an error if input is not a string', () => {
    const str = string()
    const invalidCall = () => primitiveSchemaParser(str, 42, { fill: false }).next()

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(expect.objectContaining({ code: 'parsing.invalidAttributeInput' }))
  })

  test('uses parser if transformer has been provided', () => {
    const str = string().transform(prefix('TEST'))

    const parser = primitiveSchemaParser(str, 'bar', { fill: false })

    const { value: parsed } = parser.next()
    expect(parsed).toBe('bar')

    const { value: transformed, done } = parser.next()
    expect(transformed).toBe('TEST#bar')
    expect(done).toBe(true)
  })

  test('applies validation if any', () => {
    const strA = string().validate(input => input === 'foo')

    const { value: parsed } = primitiveSchemaParser(strA, 'foo', { fill: false }).next()
    expect(parsed).toBe('foo')

    const invalidCallA = () =>
      primitiveSchemaParser(strA, 'bar', { fill: false, valuePath: ['root'] }).next()

    expect(invalidCallA).toThrow(DynamoDBToolboxError)
    expect(invalidCallA).toThrow(
      expect.objectContaining({
        code: 'parsing.customValidationFailed',
        message: "Custom validation for attribute 'root' failed."
      })
    )

    const strB = string().validate(input => (input === 'foo' ? true : 'Oh no...'))

    const invalidCallB = () =>
      primitiveSchemaParser(strB, 'bar', { fill: false, valuePath: ['root'] }).next()

    expect(invalidCallB).toThrow(DynamoDBToolboxError)
    expect(invalidCallB).toThrow(
      expect.objectContaining({
        code: 'parsing.customValidationFailed',
        message: "Custom validation for attribute 'root' failed with message: Oh no...."
      })
    )
  })
})
