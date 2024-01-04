import { DynamoDBToolboxError } from 'v1/errors'
import { freezePrimitiveAttribute, string } from 'v1/schema'
import { prefix } from 'v1/transformers'

import { parseSavedPrimitiveAttribute } from './primitive'

describe('parseSavedPrimitiveAttribute', () => {
  it('throws an error if saved value type does not match', () => {
    const str = freezePrimitiveAttribute(string(), 'path')

    const invalidCall = () => parseSavedPrimitiveAttribute(str, 42)

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(
      expect.objectContaining({ code: 'operations.formatSavedItem.invalidSavedAttribute' })
    )
  })

  it('uses formatter if transformer has been provided', () => {
    const str = freezePrimitiveAttribute(string().transform(prefix('TEST')), 'path')

    const parsedValue = parseSavedPrimitiveAttribute(str, 'TEST#bar')

    expect(parsedValue).toBe('bar')
  })

  it('throws if value is not part of enum', () => {
    const str = freezePrimitiveAttribute(
      string().enum('foo', 'bar').transform(prefix('TEST')),
      'path'
    )

    const parsedValue = parseSavedPrimitiveAttribute(str, 'TEST#bar')
    expect(parsedValue).toBe('bar')

    const invalidCall = () => parseSavedPrimitiveAttribute(str, 'TEST#baz')

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(
      expect.objectContaining({ code: 'operations.formatSavedItem.invalidSavedAttribute' })
    )
  })
})
