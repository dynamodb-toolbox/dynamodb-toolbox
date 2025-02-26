import { map, string } from '~/attributes/index.js'
import { DynamoDBToolboxError } from '~/errors/index.js'

import * as attrParserModule from './attribute.js'
import { mapAttrParser } from './map.js'

// @ts-ignore
const attrParser = vi.spyOn(attrParserModule, 'attrParser')

const mapAttr = map({ foo: string(), bar: string() })

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
    const options = { valuePath: ['root'] }
    const parser = mapAttrParser(mapAttr, { foo: 'foo', bar: 'bar' }, options)

    const { value: defaultedValue } = parser.next()
    expect(defaultedValue).toStrictEqual({ foo: 'foo', bar: 'bar' })

    expect(attrParser).toHaveBeenCalledTimes(2)
    expect(attrParser).toHaveBeenCalledWith(mapAttr.attributes.foo, 'foo', {
      ...options,
      valuePath: ['root', 'foo'],
      defined: false
    })
    expect(attrParser).toHaveBeenCalledWith(mapAttr.attributes.bar, 'bar', {
      ...options,
      valuePath: ['root', 'bar'],
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
    const mapA = map({ str: string() }).validate(input => input.str === 'foo')

    const { value: parsedValue } = mapAttrParser(mapA, { str: 'foo' }, { fill: false }).next()
    expect(parsedValue).toStrictEqual({ str: 'foo' })

    const invalidCallA = () =>
      mapAttrParser(mapA, { str: 'bar' }, { fill: false, valuePath: ['root'] }).next()

    expect(invalidCallA).toThrow(DynamoDBToolboxError)
    expect(invalidCallA).toThrow(
      expect.objectContaining({
        code: 'parsing.customValidationFailed',
        message: "Custom validation for attribute 'root' failed."
      })
    )

    const mapB = map({ str: string() }).validate(input => (input.str === 'foo' ? true : 'Oh no...'))

    const invalidCallB = () =>
      mapAttrParser(mapB, { str: 'bar' }, { fill: false, valuePath: ['root'] }).next()

    expect(invalidCallB).toThrow(DynamoDBToolboxError)
    expect(invalidCallB).toThrow(
      expect.objectContaining({
        code: 'parsing.customValidationFailed',
        message: "Custom validation for attribute 'root' failed with message: Oh no...."
      })
    )
  })
})
