import { anyOf, number, string } from '~/attributes/index.js'
import { DynamoDBToolboxError } from '~/errors/index.js'

import { anyOfAttrFormatter } from './anyOf.js'

describe('anyOfAttrFormatter', () => {
  test('throws if value is invalid', () => {
    const anyOfA = anyOf(number(), string()).freeze('root')

    const invalidCall = () => anyOfAttrFormatter(anyOfA, true).next()

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(expect.objectContaining({ code: 'formatter.invalidAttribute' }))
  })

  test('returns value if it is valid', () => {
    const anyOfA = anyOf(number(), string()).freeze()

    const formatter = anyOfAttrFormatter(anyOfA, 'foo')

    const { value: transformedValue } = formatter.next()
    expect(transformedValue).toBe('foo')

    const { done, value: formattedValue } = formatter.next()
    expect(formattedValue).toBe('foo')
    expect(done).toBe(true)
  })

  test('does not transform is transform is false', () => {
    const anyOfA = anyOf(string(), number()).freeze()

    const formatter = anyOfAttrFormatter(anyOfA, 'foo', { transform: false })

    const { done, value: formattedValue } = formatter.next()
    expect(formattedValue).toBe('foo')
    expect(done).toBe(true)
  })

  // TODO: Apply validation
})
