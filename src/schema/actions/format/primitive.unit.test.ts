import { DynamoDBToolboxError } from '~/errors/index.js'
import { string } from '~/schema/index.js'
import { prefix } from '~/transformers/prefix.js'

import { primitiveSchemaFormatter } from './primitive.js'

describe('primitiveSchemaFormatter', () => {
  test('throws an error if saved value type does not match', () => {
    const str = string()

    const invalidCall = () => primitiveSchemaFormatter(str, 42).next()

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(expect.objectContaining({ code: 'formatter.invalidAttribute' }))
  })

  test('uses formatter if transformer has been provided', () => {
    const str = string().transform(prefix('TEST'))

    const formatter = primitiveSchemaFormatter(str, 'TEST#bar')

    const transformedValue = formatter.next().value
    expect(transformedValue).toBe('bar')

    const { done, value: formattedValue } = formatter.next()
    expect(formattedValue).toBe('bar')
    expect(done).toBe(true)
  })

  test('throws if value is not part of enum', () => {
    const str = string().enum('foo', 'bar').transform(prefix('TEST'))

    const formatter = primitiveSchemaFormatter(str, 'TEST#bar')

    const { value: transformedValue } = formatter.next()
    expect(transformedValue).toBe('bar')

    const { done, value: formattedValue } = formatter.next()
    expect(formattedValue).toBe('bar')
    expect(done).toBe(true)

    const invalidCall = () => primitiveSchemaFormatter(str, 'TEST#baz').next()

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(expect.objectContaining({ code: 'formatter.invalidAttribute' }))
  })

  test('does not transform if transform is set to false', () => {
    const str = string().enum('foo', 'bar').transform(prefix('TEST'))

    const invalidCall = () => primitiveSchemaFormatter(str, 'TEST#bar', { transform: false }).next()

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(expect.objectContaining({ code: 'formatter.invalidAttribute' }))

    const formatter = primitiveSchemaFormatter(str, 'bar', { transform: false })

    const { done, value: formattedValue } = formatter.next()
    expect(formattedValue).toBe('bar')
    expect(done).toBe(true)
  })
})
