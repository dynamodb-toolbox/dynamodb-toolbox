import { string } from '~/attributes/index.js'
import { DynamoDBToolboxError } from '~/errors/index.js'
import { prefix } from '~/transformers/prefix.js'

import { primitiveAttrFormatter } from './primitive.js'

describe('primitiveAttrFormatter', () => {
  test('throws an error if saved value type does not match', () => {
    const str = string().freeze('path')

    const invalidCall = () => primitiveAttrFormatter(str, 42).next()

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(expect.objectContaining({ code: 'formatter.invalidAttribute' }))
  })

  test('uses formatter if transformer has been provided', () => {
    const str = string().transform(prefix('TEST')).freeze('path')

    const formatter = primitiveAttrFormatter(str, 'TEST#bar')

    const transformedValue = formatter.next().value
    expect(transformedValue).toBe('bar')

    const { done, value: formattedValue } = formatter.next()
    expect(formattedValue).toBe('bar')
    expect(done).toBe(true)
  })

  test('throws if value is not part of enum', () => {
    const str = string().enum('foo', 'bar').transform(prefix('TEST')).freeze('path')

    const formatter = primitiveAttrFormatter(str, 'TEST#bar')

    const { value: transformedValue } = formatter.next()
    expect(transformedValue).toBe('bar')

    const { done, value: formattedValue } = formatter.next()
    expect(formattedValue).toBe('bar')
    expect(done).toBe(true)

    const invalidCall = () => primitiveAttrFormatter(str, 'TEST#baz').next()

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(expect.objectContaining({ code: 'formatter.invalidAttribute' }))
  })

  test('does not transform if transform is set to false', () => {
    const str = string().enum('foo', 'bar').transform(prefix('TEST')).freeze('path')

    const invalidCall = () => primitiveAttrFormatter(str, 'TEST#bar', { transform: false }).next()

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(expect.objectContaining({ code: 'formatter.invalidAttribute' }))

    const formatter = primitiveAttrFormatter(str, 'bar', { transform: false })

    const { done, value: formattedValue } = formatter.next()
    expect(formattedValue).toBe('bar')
    expect(done).toBe(true)
  })
})
