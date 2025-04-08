import { DynamoDBToolboxError } from '~/errors/index.js'
import { item, string } from '~/schema/index.js'

import * as schemaFormatterModule from './schema.js'
import { itemFormatter } from './item.js'

// @ts-ignore
const schemaFormatter = vi.spyOn(schemaFormatterModule, 'schemaFormatter')

const schema = item({
  foo: string().savedAs('_f'),
  bar: string().hidden()
})

describe('itemFormatter', () => {
  beforeEach(() => {
    schemaFormatter.mockClear()
  })

  test('throws an error if input is not a map', () => {
    const invalidCall = () => itemFormatter(schema, ['foo', 'bar']).next()

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(expect.objectContaining({ code: 'formatter.invalidItem' }))
  })

  test('applies schemaFormatter on input properties otherwise (and pass options)', () => {
    const options = { some: 'options' }
    const formatter = itemFormatter(
      schema,
      { _f: 'foo', bar: 'bar' },
      // @ts-expect-error we don't really care about the type here
      options
    )

    const { value: transformedValue } = formatter.next()
    expect(transformedValue).toStrictEqual({ foo: 'foo', bar: 'bar' })

    expect(schemaFormatter).toHaveBeenCalledTimes(2)
    expect(schemaFormatter).toHaveBeenCalledWith(schema.attributes.foo, 'foo', {
      ...options,
      valuePath: ['_f']
    })
    expect(schemaFormatter).toHaveBeenCalledWith(schema.attributes.bar, 'bar', {
      ...options,
      valuePath: ['bar']
    })

    const { done, value: formattedValue } = formatter.next()
    expect(done).toBe(true)
    expect(formattedValue).toStrictEqual({ foo: 'foo' })
  })

  test('filters attributes if provided', () => {
    const options = { attributes: ['foo'] }
    const formatter = itemFormatter(schema, { _f: 'foo', bar: 'bar' }, options)

    const { value: transformedValue } = formatter.next()
    expect(transformedValue).toStrictEqual({ foo: 'foo' })

    expect(schemaFormatter).toHaveBeenCalledTimes(1)
    expect(schemaFormatter).toHaveBeenCalledWith(schema.attributes.foo, 'foo', {
      ...options,
      valuePath: ['_f'],
      attributes: undefined
    })

    const { done, value: formattedValue } = formatter.next()
    expect(done).toBe(true)
    expect(formattedValue).toStrictEqual({ foo: 'foo' })
  })

  test('allows incomplete item if partial is true', () => {
    const options = { partial: true }
    const formatter = itemFormatter(schema, { _f: 'foo' }, options)

    const { value: transformedValue } = formatter.next()
    expect(transformedValue).toStrictEqual({ foo: 'foo' })

    expect(schemaFormatter).toHaveBeenCalledTimes(2)
    expect(schemaFormatter).toHaveBeenCalledWith(schema.attributes.foo, 'foo', {
      ...options,
      valuePath: ['_f']
    })
    expect(schemaFormatter).toHaveBeenCalledWith(schema.attributes.bar, undefined, {
      ...options,
      valuePath: ['bar']
    })

    const { done, value: formattedValue } = formatter.next()
    expect(done).toBe(true)
    expect(formattedValue).toStrictEqual({ foo: 'foo' })
  })

  test('does not transform item if transformed is false', () => {
    const options = { transform: false }
    const formatter = itemFormatter(schema, { foo: 'foo', bar: 'bar' }, options)

    const { done, value: formattedValue } = formatter.next()
    expect(done).toBe(true)
    expect(formattedValue).toStrictEqual({ foo: 'foo' })

    expect(schemaFormatter).toHaveBeenCalledTimes(2)
    expect(schemaFormatter).toHaveBeenCalledWith(schema.attributes.foo, 'foo', {
      ...options,
      valuePath: ['foo']
    })
    expect(schemaFormatter).toHaveBeenCalledWith(schema.attributes.bar, 'bar', {
      ...options,
      valuePath: ['bar']
    })
  })

  // TODO: Apply validation
})
