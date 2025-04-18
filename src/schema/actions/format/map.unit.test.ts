import { DynamoDBToolboxError } from '~/errors/index.js'
import { map, string } from '~/schema/index.js'

import * as schemaFormatterModule from './schema.js'
import { mapSchemaFormatter } from './map.js'

// @ts-ignore
const schemaFormatter = vi.spyOn(schemaFormatterModule, 'schemaFormatter')

const mapSchema = map({
  foo: string().savedAs('_f'),
  bar: string().hidden()
})

describe('mapSchemaFormatter', () => {
  beforeEach(() => {
    schemaFormatter.mockClear()
  })

  test('throws an error if input is not a map', () => {
    const invalidCall = () => mapSchemaFormatter(mapSchema, ['foo', 'bar']).next()

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(expect.objectContaining({ code: 'formatter.invalidAttribute' }))
  })

  test('applies schemaFormatter on input properties otherwise (and pass options)', () => {
    const options = { valuePath: ['root'] }
    const formatter = mapSchemaFormatter(mapSchema, { _f: 'foo', bar: 'bar' }, options)

    const { value: transformedValue } = formatter.next()
    expect(transformedValue).toStrictEqual({ foo: 'foo', bar: 'bar' })

    expect(schemaFormatter).toHaveBeenCalledTimes(2)
    expect(schemaFormatter).toHaveBeenCalledWith(mapSchema.attributes.foo, 'foo', {
      ...options,
      valuePath: ['root', '_f']
    })
    expect(schemaFormatter).toHaveBeenCalledWith(mapSchema.attributes.bar, 'bar', {
      ...options,
      valuePath: ['root', 'bar']
    })

    const { done, value: formattedValue } = formatter.next()
    expect(done).toBe(true)
    expect(formattedValue).toStrictEqual({ foo: 'foo' })
  })

  test('filters attributes if provided', () => {
    const options = { attributes: ['.foo'] }
    const formatter = mapSchemaFormatter(mapSchema, { _f: 'foo', bar: 'bar' }, options)

    const { value: transformedValue } = formatter.next()
    expect(transformedValue).toStrictEqual({ foo: 'foo' })

    expect(schemaFormatter).toHaveBeenCalledTimes(1)
    expect(schemaFormatter).toHaveBeenCalledWith(mapSchema.attributes.foo, 'foo', {
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
    const formatter = mapSchemaFormatter(mapSchema, { _f: 'foo' }, options)

    const { value: transformedValue } = formatter.next()
    expect(transformedValue).toStrictEqual({ foo: 'foo' })

    expect(schemaFormatter).toHaveBeenCalledTimes(2)
    expect(schemaFormatter).toHaveBeenCalledWith(mapSchema.attributes.foo, 'foo', {
      ...options,
      valuePath: ['_f']
    })
    expect(schemaFormatter).toHaveBeenCalledWith(mapSchema.attributes.bar, undefined, {
      ...options,
      valuePath: ['bar']
    })

    const { done, value: formattedValue } = formatter.next()
    expect(done).toBe(true)
    expect(formattedValue).toStrictEqual({ foo: 'foo' })
  })

  test('does not transform item if transformed is false', () => {
    const options = { transform: false }
    const formatter = mapSchemaFormatter(mapSchema, { foo: 'foo', bar: 'bar' }, options)

    const { done, value: formattedValue } = formatter.next()
    expect(done).toBe(true)
    expect(formattedValue).toStrictEqual({ foo: 'foo' })

    expect(schemaFormatter).toHaveBeenCalledTimes(2)
    expect(schemaFormatter).toHaveBeenCalledWith(mapSchema.attributes.foo, 'foo', {
      ...options,
      valuePath: ['foo']
    })
    expect(schemaFormatter).toHaveBeenCalledWith(mapSchema.attributes.bar, 'bar', {
      ...options,
      valuePath: ['bar']
    })
  })

  // TODO: Apply validation
})
