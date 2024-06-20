import { DynamoDBToolboxError } from 'v1/errors/index.js'
import { string } from 'v1/schema/attributes/index.js'
import { prefix } from 'v1/transformers/prefix.js'

import { formatPrimitiveAttrRawValue } from './primitive.js'

describe('parseSavedPrimitiveAttribute', () => {
  it('throws an error if saved value type does not match', () => {
    const str = string().freeze('path')

    const invalidCall = () => formatPrimitiveAttrRawValue(str, 42)

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(expect.objectContaining({ code: 'formatter.invalidAttribute' }))
  })

  it('uses formatter if transformer has been provided', () => {
    const str = string().transform(prefix('TEST')).freeze('path')

    const parsedValue = formatPrimitiveAttrRawValue(str, 'TEST#bar')

    expect(parsedValue).toBe('bar')
  })

  it('throws if value is not part of enum', () => {
    const str = string().enum('foo', 'bar').transform(prefix('TEST')).freeze('path')

    const parsedValue = formatPrimitiveAttrRawValue(str, 'TEST#bar')
    expect(parsedValue).toBe('bar')

    const invalidCall = () => formatPrimitiveAttrRawValue(str, 'TEST#baz')

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(expect.objectContaining({ code: 'formatter.invalidAttribute' }))
  })
})
