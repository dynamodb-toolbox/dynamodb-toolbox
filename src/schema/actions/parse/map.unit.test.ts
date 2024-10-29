import { map, string } from '~/attributes/index.js'
import { DynamoDBToolboxError } from '~/errors/index.js'

import * as attrParserModule from './attribute.js'
import { mapAttrParser } from './map.js'

// @ts-ignore
const attrParser = vi.spyOn(attrParserModule, 'attrParser')

const mapAttr = map({ foo: string(), bar: string() }).freeze('path')

describe('mapAttributeParser', () => {
  beforeEach(() => {
    attrParser.mockClear()
  })

  test('throws an error if input is not a map', () => {
    const invalidCall = () => mapAttrParser(mapAttr, ['foo', 'bar'], { fill: false }).next()

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(expect.objectContaining({ code: 'parsing.invalidAttributeInput' }))
  })

  test('applies attrParser on input properties otherwise (and pass options)', () => {
    const options = { some: 'options' }
    const parser = mapAttrParser(
      mapAttr,
      { foo: 'foo', bar: 'bar' },
      // @ts-expect-error we don't really care about the type here
      options
    )

    const { value: defaultedValue } = parser.next()
    expect(defaultedValue).toStrictEqual({ foo: 'foo', bar: 'bar' })

    expect(attrParser).toHaveBeenCalledTimes(2)
    expect(attrParser).toHaveBeenCalledWith(mapAttr.attributes.foo, 'foo', {
      ...options,
      defined: false
    })
    expect(attrParser).toHaveBeenCalledWith(mapAttr.attributes.bar, 'bar', {
      ...options,
      defined: false
    })

    const { value: linkedValue } = parser.next()
    expect(linkedValue).toStrictEqual({ foo: 'foo', bar: 'bar' })

    const { value: parsedValue } = parser.next()
    expect(parsedValue).toStrictEqual({ foo: 'foo', bar: 'bar' })

    const { done, value: transformedValue } = parser.next()
    expect(done).toBe(true)
    expect(transformedValue).toStrictEqual({ foo: 'foo', bar: 'bar' })
  })

  test('applies validation if any', () => {
    const mapA = map({ str: string() })
      .validate(input => input.str === 'foo')
      .freeze('root')

    const { value: parsedValue } = mapAttrParser(mapA, { str: 'foo' }, { fill: false }).next()
    expect(parsedValue).toStrictEqual({ str: 'foo' })

    const invalidCallA = () => mapAttrParser(mapA, { str: 'bar' }, { fill: false }).next()

    expect(invalidCallA).toThrow(DynamoDBToolboxError)
    expect(invalidCallA).toThrow(
      expect.objectContaining({
        code: 'parsing.customValidationFailed',
        message: "Custom validation for attribute 'root' failed."
      })
    )

    const mapB = map({ str: string() })
      .validate(input => (input.str === 'foo' ? true : 'Oh no...'))
      .freeze('root')

    const invalidCallB = () => mapAttrParser(mapB, { str: 'bar' }, { fill: false }).next()

    expect(invalidCallB).toThrow(DynamoDBToolboxError)
    expect(invalidCallB).toThrow(
      expect.objectContaining({
        code: 'parsing.customValidationFailed',
        message: "Custom validation for attribute 'root' failed with message: Oh no...."
      })
    )
  })
})
