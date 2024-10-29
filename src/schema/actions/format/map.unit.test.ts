import { map, string } from '~/attributes/index.js'
import { DynamoDBToolboxError } from '~/errors/index.js'

import * as attrFormatterModule from './attribute.js'
import { mapAttrFormatter } from './map.js'

// @ts-ignore
const attrFormatter = vi.spyOn(attrFormatterModule, 'attrFormatter')

const mapAttr = map({
  foo: string().savedAs('_f'),
  bar: string().hidden()
}).freeze('path')

describe('mapAttrFormatter', () => {
  beforeEach(() => {
    attrFormatter.mockClear()
  })

  test('throws an error if input is not a map', () => {
    const invalidCall = () => mapAttrFormatter(mapAttr, ['foo', 'bar']).next()

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(expect.objectContaining({ code: 'formatter.invalidAttribute' }))
  })

  test('applies attrFormatter on input properties otherwise (and pass options)', () => {
    const options = { some: 'options' }
    const formatter = mapAttrFormatter(
      mapAttr,
      { _f: 'foo', bar: 'bar' },
      // @ts-expect-error we don't really care about the type here
      options
    )

    const { value: transformedValue } = formatter.next()
    expect(transformedValue).toStrictEqual({ foo: 'foo', bar: 'bar' })

    expect(attrFormatter).toHaveBeenCalledTimes(2)
    expect(attrFormatter).toHaveBeenCalledWith(mapAttr.attributes.foo, 'foo', options)
    expect(attrFormatter).toHaveBeenCalledWith(mapAttr.attributes.bar, 'bar', options)

    const { done, value: formattedValue } = formatter.next()
    expect(done).toBe(true)
    expect(formattedValue).toStrictEqual({ foo: 'foo' })
  })

  test('filters attributes if provided', () => {
    const options = { attributes: ['.foo'] }
    const formatter = mapAttrFormatter(mapAttr, { _f: 'foo', bar: 'bar' }, options)

    const { value: transformedValue } = formatter.next()
    expect(transformedValue).toStrictEqual({ foo: 'foo' })

    expect(attrFormatter).toHaveBeenCalledTimes(1)
    expect(attrFormatter).toHaveBeenCalledWith(mapAttr.attributes.foo, 'foo', {
      ...options,
      attributes: undefined
    })

    const { done, value: formattedValue } = formatter.next()
    expect(done).toBe(true)
    expect(formattedValue).toStrictEqual({ foo: 'foo' })
  })

  test('allows incomplete item if partial is true', () => {
    const options = { partial: true }
    const formatter = mapAttrFormatter(mapAttr, { _f: 'foo' }, options)

    const { value: transformedValue } = formatter.next()
    expect(transformedValue).toStrictEqual({ foo: 'foo' })

    expect(attrFormatter).toHaveBeenCalledTimes(2)
    expect(attrFormatter).toHaveBeenCalledWith(mapAttr.attributes.foo, 'foo', options)
    expect(attrFormatter).toHaveBeenCalledWith(mapAttr.attributes.bar, undefined, options)

    const { done, value: formattedValue } = formatter.next()
    expect(done).toBe(true)
    expect(formattedValue).toStrictEqual({ foo: 'foo' })
  })

  test('does not transform item if transformed is false', () => {
    const options = { transform: false }
    const formatter = mapAttrFormatter(mapAttr, { foo: 'foo', bar: 'bar' }, options)

    const { done, value: formattedValue } = formatter.next()
    expect(done).toBe(true)
    expect(formattedValue).toStrictEqual({ foo: 'foo' })

    expect(attrFormatter).toHaveBeenCalledTimes(2)
    expect(attrFormatter).toHaveBeenCalledWith(mapAttr.attributes.foo, 'foo', options)
    expect(attrFormatter).toHaveBeenCalledWith(mapAttr.attributes.bar, 'bar', options)
  })

  // TODO: Apply validation
})
