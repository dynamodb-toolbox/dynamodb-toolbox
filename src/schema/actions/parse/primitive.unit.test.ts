import { string } from '~/attributes/string/index.js'
import { DynamoDBToolboxError } from '~/errors/index.js'

import { primitiveAttrParser } from './primitive.js'

describe('primitiveAttrParser', () => {
  test('throws an error if input is not a string', () => {
    const str = string().freeze('root')
    const invalidCall = () => primitiveAttrParser(str, 42, { fill: false }).next()

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(expect.objectContaining({ code: 'parsing.invalidAttributeInput' }))
  })

  test('applies validation if any', () => {
    const strA = string()
      .validate(input => input === 'foo')
      .freeze('root')

    const invalidCallA = () => primitiveAttrParser(strA, 'bar', { fill: false }).next()

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

    const invalidCallB = () => primitiveAttrParser(strB, 'bar', { fill: false }).next()

    expect(invalidCallB).toThrow(DynamoDBToolboxError)
    expect(invalidCallB).toThrow(
      expect.objectContaining({
        code: 'parsing.customValidationFailed',
        message: "Custom validation for attribute 'root' failed with message: Oh no...."
      })
    )
  })
})
