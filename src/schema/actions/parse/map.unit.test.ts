import { DynamoDBToolboxError } from '~/errors/index.js'
import { map, string } from '~/schema/index.js'

import * as schemaParserModule from './schema.js'
import { mapSchemaParser } from './map.js'

// @ts-ignore
const schemaParser = vi.spyOn(schemaParserModule, 'schemaParser')

const mapSchema = map({ foo: string(), bar: string() })

describe('mapSchemaParser', () => {
  beforeEach(() => {
    schemaParser.mockClear()
  })

  test('throws an error if input is not a map', () => {
    const invalidCall = () => mapSchemaParser(mapSchema, ['foo', 'bar'], { fill: false }).next()

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(expect.objectContaining({ code: 'parsing.invalidAttributeInput' }))
  })

  test('silently drops additional keys on a non-strict map', () => {
    const schema = map({ foo: string() })
    const parser = mapSchemaParser(schema, { foo: 'foo', extra: 'extra' })

    const { value: defaultedValue } = parser.next()
    expect(defaultedValue).toStrictEqual({ foo: 'foo', extra: 'extra' })

    const { value: linkedValue } = parser.next()
    expect(linkedValue).toStrictEqual({ foo: 'foo', extra: 'extra' })

    const { value: parsedValue } = parser.next()
    expect(parsedValue).toStrictEqual({ foo: 'foo' })

    const { value: transformedValue } = parser.next()
    expect(transformedValue).toStrictEqual({ foo: 'foo' })
  })

  test('throws on a strict map (put mode) naming the offending path', () => {
    const schema = map({ foo: string() }).strict()
    const invalidCall = () =>
      mapSchemaParser(schema, { foo: 'foo', extra: 'extra' }, { fill: false }).next()

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(expect.objectContaining({ code: 'parsing.additionalProperty' }))
  })

  describe('all modes', () => {
    test('throws in update mode on an undeclared key', () => {
      const schema = map({ foo: string() }).strict()
      const invalidCall = () =>
        mapSchemaParser(
          schema,
          { foo: 'foo', extra: 'extra' },
          { mode: 'update', fill: false }
        ).next()

      expect(invalidCall).toThrow(DynamoDBToolboxError)
      expect(invalidCall).toThrow(
        expect.objectContaining({ code: 'parsing.additionalProperty', path: 'extra' })
      )
    })

    test('throws in key mode on an undeclared key', () => {
      const schema = map({ foo: string().key(), bar: string() }).strict()
      const invalidCall = () =>
        mapSchemaParser(schema, { foo: 'foo', extra: 'extra' }, { mode: 'key', fill: false }).next()

      expect(invalidCall).toThrow(
        expect.objectContaining({ code: 'parsing.additionalProperty', path: 'extra' })
      )
    })

    test('does not throw in key mode on a declared-but-non-key attribute', () => {
      const schema = map({ foo: string().key(), bar: string() }).strict()
      const validCall = () =>
        mapSchemaParser(schema, { foo: 'foo', bar: 'bar' }, { mode: 'key', fill: false }).next()

      expect(validCall).not.toThrow()
    })
  })

  test('applies schemaParser on input properties otherwise (and pass options)', () => {
    const options = { valuePath: ['root'] }
    const parser = mapSchemaParser(mapSchema, { foo: 'foo', bar: 'bar' }, options)

    const { value: defaultedValue } = parser.next()
    expect(defaultedValue).toStrictEqual({ foo: 'foo', bar: 'bar' })

    expect(schemaParser).toHaveBeenCalledTimes(2)
    expect(schemaParser).toHaveBeenCalledWith(mapSchema.attributes.foo, 'foo', {
      ...options,
      valuePath: ['root', 'foo'],
      defined: false
    })
    expect(schemaParser).toHaveBeenCalledWith(mapSchema.attributes.bar, 'bar', {
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

    const { value: parsedValue } = mapSchemaParser(mapA, { str: 'foo' }, { fill: false }).next()
    expect(parsedValue).toStrictEqual({ str: 'foo' })

    const invalidCallA = () =>
      mapSchemaParser(mapA, { str: 'bar' }, { fill: false, valuePath: ['root'] }).next()

    expect(invalidCallA).toThrow(DynamoDBToolboxError)
    expect(invalidCallA).toThrow(
      expect.objectContaining({
        code: 'parsing.customValidationFailed',
        message: "Custom validation for attribute 'root' failed."
      })
    )

    const mapB = map({ str: string() }).validate(input => (input.str === 'foo' ? true : 'Oh no...'))

    const invalidCallB = () =>
      mapSchemaParser(mapB, { str: 'bar' }, { fill: false, valuePath: ['root'] }).next()

    expect(invalidCallB).toThrow(DynamoDBToolboxError)
    expect(invalidCallB).toThrow(
      expect.objectContaining({
        code: 'parsing.customValidationFailed',
        message: "Custom validation for attribute 'root' failed with message: Oh no...."
      })
    )
  })
})
