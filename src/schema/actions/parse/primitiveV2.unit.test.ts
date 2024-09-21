import { string } from '~/attributes/string/index.js'
import { DynamoDBToolboxError } from '~/errors/index.js'

import { primitiveAttrV2Parser } from './primitiveV2.js'

describe('primitiveAttrParser', () => {
  test('throws an error if input is not a string', () => {
    const str = string().freeze('root')
    const invalidCall = () => primitiveAttrV2Parser(str, 42, { fill: false }).next()

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(expect.objectContaining({ code: 'parsing.invalidAttributeInput' }))
  })

  test('applies validation if any', () => {
    const strA = string()
      .validate(input => input === 'foo')
      .freeze('root')

    const { value: parsed } = primitiveAttrV2Parser(strA, 'foo', { fill: false }).next()
    expect(parsed).toBe('foo')

    const invalidCallA = () => primitiveAttrV2Parser(strA, 'bar', { fill: false }).next()

    expect(invalidCallA).toThrow(DynamoDBToolboxError)
    expect(invalidCallA).toThrow(
      expect.objectContaining({
        code: 'parsing.customValidationFailed',
        message: "Custom validation for attribute 'root' failed."
      })
    )

    const strB = string()
      .validate(input => (input === 'foo' ? true : 'Oh no...'))
      .freeze('root')

    const invalidCallB = () => primitiveAttrV2Parser(strB, 'bar', { fill: false }).next()

    expect(invalidCallB).toThrow(DynamoDBToolboxError)
    expect(invalidCallB).toThrow(
      expect.objectContaining({
        code: 'parsing.customValidationFailed',
        message: "Custom validation for attribute 'root' failed with message: Oh no...."
      })
    )
  })
})
