import { DynamoDBToolboxError } from '~/errors/index.js'
import { anyOf, number, string } from '~/schema/index.js'

import { anyOfSchemaFormatter } from './anyOf.js'

describe('anyOfSchemaFormatter', () => {
  test('throws if value is invalid', () => {
    const schema = anyOf(number(), string())

    const invalidCall = () => anyOfSchemaFormatter(schema, true).next()

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(expect.objectContaining({ code: 'formatter.invalidAttribute' }))
  })

  test('returns value if it is valid', () => {
    const anyOfA = anyOf(number(), string())

    const formatter = anyOfSchemaFormatter(anyOfA, 'foo')

    const { value: transformedValue } = formatter.next()
    expect(transformedValue).toBe('foo')

    const { done, value: formattedValue } = formatter.next()
    expect(formattedValue).toBe('foo')
    expect(done).toBe(true)
  })

  test('does not transform is transform is false', () => {
    const anyOfA = anyOf(string(), number())

    const formatter = anyOfSchemaFormatter(anyOfA, 'foo', { transform: false })

    const { done, value: formattedValue } = formatter.next()
    expect(formattedValue).toBe('foo')
    expect(done).toBe(true)
  })

  // TODO: Apply validation
})
