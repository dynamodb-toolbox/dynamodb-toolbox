import { item, string } from '~/attributes/index.js'
import { DynamoDBToolboxError } from '~/errors/index.js'

import * as attrFormatterModule from './attribute.js'
import { schemaFormatter } from './schema.js'

// @ts-ignore
const attrFormatter = vi.spyOn(attrFormatterModule, 'attrFormatter')

const schema = item({
  foo: string().savedAs('_f'),
  bar: string().hidden()
})

describe('schemaFormatter', () => {
  beforeEach(() => {
    attrFormatter.mockClear()
  })

  test('throws an error if input is not a map', () => {
    const invalidCall = () => schemaFormatter(schema, ['foo', 'bar']).next()

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(expect.objectContaining({ code: 'formatter.invalidItem' }))
  })

  test('applies attrFormatter on input properties otherwise (and pass options)', () => {
    const options = { some: 'options' }
    const formatter = schemaFormatter(
      schema,
      { _f: 'foo', bar: 'bar' },
      // @ts-expect-error we don't really care about the type here
      options
    )

    const { value: transformedValue } = formatter.next()
    expect(transformedValue).toStrictEqual({ foo: 'foo', bar: 'bar' })

    expect(attrFormatter).toHaveBeenCalledTimes(2)
    expect(attrFormatter).toHaveBeenCalledWith(schema.attributes.foo, 'foo', {
      ...options,
      valuePath: ['_f']
    })
    expect(attrFormatter).toHaveBeenCalledWith(schema.attributes.bar, 'bar', {
      ...options,
      valuePath: ['bar']
    })

    const { done, value: formattedValue } = formatter.next()
    expect(done).toBe(true)
    expect(formattedValue).toStrictEqual({ foo: 'foo' })
  })

  test('filters attributes if provided', () => {
    const options = { attributes: ['foo'] }
    const formatter = schemaFormatter(schema, { _f: 'foo', bar: 'bar' }, options)

    const { value: transformedValue } = formatter.next()
    expect(transformedValue).toStrictEqual({ foo: 'foo' })

    expect(attrFormatter).toHaveBeenCalledTimes(1)
    expect(attrFormatter).toHaveBeenCalledWith(schema.attributes.foo, 'foo', {
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
    const formatter = schemaFormatter(schema, { _f: 'foo' }, options)

    const { value: transformedValue } = formatter.next()
    expect(transformedValue).toStrictEqual({ foo: 'foo' })

    expect(attrFormatter).toHaveBeenCalledTimes(2)
    expect(attrFormatter).toHaveBeenCalledWith(schema.attributes.foo, 'foo', {
      ...options,
      valuePath: ['_f']
    })
    expect(attrFormatter).toHaveBeenCalledWith(schema.attributes.bar, undefined, {
      ...options,
      valuePath: ['bar']
    })

    const { done, value: formattedValue } = formatter.next()
    expect(done).toBe(true)
    expect(formattedValue).toStrictEqual({ foo: 'foo' })
  })

  test('does not transform item if transformed is false', () => {
    const options = { transform: false }
    const formatter = schemaFormatter(schema, { foo: 'foo', bar: 'bar' }, options)

    const { done, value: formattedValue } = formatter.next()
    expect(done).toBe(true)
    expect(formattedValue).toStrictEqual({ foo: 'foo' })

    expect(attrFormatter).toHaveBeenCalledTimes(2)
    expect(attrFormatter).toHaveBeenCalledWith(schema.attributes.foo, 'foo', {
      ...options,
      valuePath: ['foo']
    })
    expect(attrFormatter).toHaveBeenCalledWith(schema.attributes.bar, 'bar', {
      ...options,
      valuePath: ['bar']
    })
  })

  // TODO: Apply validation
})
