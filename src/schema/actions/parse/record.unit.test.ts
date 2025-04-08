import { DynamoDBToolboxError } from '~/errors/index.js'
import { record, string } from '~/schema/index.js'

import * as schemaParserModule from './schema.js'
import { recordSchemaParser } from './record.js'

// @ts-ignore
const schemaParser = vi.spyOn(schemaParserModule, 'schemaParser')

const schema = record(string(), string())
const enumSchema = record(string().enum('foo', 'bar'), string())

describe('recordSchemaParser', () => {
  beforeEach(() => {
    schemaParser.mockClear()
  })

  test('throws an error if input is not a record', () => {
    const invalidCall = () => recordSchemaParser(schema, ['foo', 'bar'], { fill: false }).next()

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(expect.objectContaining({ code: 'parsing.invalidAttributeInput' }))
  })

  test('throws an error if keys are an enum and record is incomplete', () => {
    const invalidCall = () => recordSchemaParser(enumSchema, { foo: 'bar' }, { fill: false }).next()

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(expect.objectContaining({ code: 'parsing.attributeRequired' }))
  })

  test('accepts incomplete record if keys are an enum and record is partial', () => {
    const parser = recordSchemaParser(enumSchema.partial(), { foo: 'bar' }, { fill: false })

    const { value: parsedValue } = parser.next()
    expect(parsedValue).toStrictEqual({ foo: 'bar' })
  })

  test('accepts incomplete record if keys are an enum and mode is update', () => {
    const parser = recordSchemaParser(enumSchema, { foo: 'bar' }, { fill: false, mode: 'update' })

    const { value: parsedValue } = parser.next()
    expect(parsedValue).toStrictEqual({ foo: 'bar' })
  })

  test('applies schemaParser on input properties otherwise (and pass options)', () => {
    const options = { valuePath: ['root'] }
    const parser = recordSchemaParser(schema, { foo: 'foo1', bar: 'bar1' }, options)

    const { value: defaultedValue } = parser.next()
    expect(defaultedValue).toStrictEqual({ foo: 'foo1', bar: 'bar1' })

    expect(schemaParser).toHaveBeenCalledTimes(4)
    expect(schemaParser).toHaveBeenCalledWith(schema.keys, 'foo', {
      ...options,
      valuePath: ['root', 'foo']
    })
    expect(schemaParser).toHaveBeenCalledWith(schema.keys, 'bar', {
      ...options,
      valuePath: ['root', 'bar']
    })
    expect(schemaParser).toHaveBeenCalledWith(schema.elements, 'foo1', {
      ...options,
      valuePath: ['root', 'foo'],
      defined: false
    })
    expect(schemaParser).toHaveBeenCalledWith(schema.elements, 'bar1', {
      ...options,
      valuePath: ['root', 'bar'],
      defined: false
    })

    const { value: linkedValue } = parser.next()
    expect(linkedValue).toStrictEqual({ foo: 'foo1', bar: 'bar1' })

    const { value: parsedValue } = parser.next()
    expect(parsedValue).toStrictEqual({ foo: 'foo1', bar: 'bar1' })

    const { done, value: transformedValue } = parser.next()
    expect(done).toBe(true)
    expect(transformedValue).toStrictEqual({ foo: 'foo1', bar: 'bar1' })
  })

  test('ignores undefined values', () => {
    const recordA = record(string(), string())

    const { value: parsedValue } = recordSchemaParser(
      recordA,
      { foo: 'bar', baz: undefined },
      { fill: false }
    ).next()
    expect(parsedValue).toStrictEqual({ foo: 'bar' })
  })

  test('applies validation if any', () => {
    const recordA = record(string(), string()).validate(input => 'foo' in input)

    const { value: parsedValue } = recordSchemaParser(
      recordA,
      { foo: 'bar' },
      { fill: false }
    ).next()
    expect(parsedValue).toStrictEqual({ foo: 'bar' })

    const invalidCallA = () =>
      recordSchemaParser(recordA, { bar: 'foo' }, { fill: false, valuePath: ['root'] }).next()

    expect(invalidCallA).toThrow(DynamoDBToolboxError)
    expect(invalidCallA).toThrow(
      expect.objectContaining({
        code: 'parsing.customValidationFailed',
        message: "Custom validation for attribute 'root' failed."
      })
    )

    const recordB = record(string(), string()).validate(input =>
      'foo' in input ? true : 'Oh no...'
    )

    const invalidCallB = () =>
      recordSchemaParser(recordB, { bar: 'foo' }, { fill: false, valuePath: ['root'] }).next()

    expect(invalidCallB).toThrow(DynamoDBToolboxError)
    expect(invalidCallB).toThrow(
      expect.objectContaining({
        code: 'parsing.customValidationFailed',
        message: "Custom validation for attribute 'root' failed with message: Oh no...."
      })
    )
  })
})
