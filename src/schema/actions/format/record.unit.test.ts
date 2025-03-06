import { DynamoDBToolboxError } from '~/errors/index.js'
import { record, string } from '~/schema/index.js'
import { prefix } from '~/transformers/prefix.js'

import * as attrFormatterModule from './attribute.js'
import { recordSchemaFormatter } from './record.js'

// @ts-ignore
const attrFormatter = vi.spyOn(attrFormatterModule, 'attrFormatter')

const schema = record(
  string().transform(prefix('_', { delimiter: '' })),
  string().transform(prefix('_', { delimiter: '' }))
)
const enumSchema = record(string().enum('foo', 'bar'), string())

describe('recordSchemaFormatter', () => {
  beforeEach(() => {
    attrFormatter.mockClear()
  })

  test('throws an error if input is not a map', () => {
    const invalidCall = () => recordSchemaFormatter(schema, ['foo', 'bar']).next()

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(expect.objectContaining({ code: 'formatter.invalidAttribute' }))
  })

  test('throws an error if keys are an enum and record is incomplete', () => {
    const invalidCall = () => recordSchemaFormatter(enumSchema, { foo: 'bar' }).next()

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(expect.objectContaining({ code: 'formatter.missingAttribute' }))
  })

  test('accepts incomplete record if keys are an enum and record is partial', () => {
    const formatter = recordSchemaFormatter(enumSchema.partial(), { foo: 'bar' })

    const { value: transformedValue } = formatter.next()
    expect(transformedValue).toStrictEqual({ foo: 'bar' })
  })

  test('accepts incomplete record if keys are an enum and partial is true', () => {
    const formatter = recordSchemaFormatter(enumSchema, { foo: 'bar' }, { partial: true })

    const { value: transformedValue } = formatter.next()
    expect(transformedValue).toStrictEqual({ foo: 'bar' })
  })

  test('accepts incomplete record if keys are an enum and key is not projected', () => {
    const formatter = recordSchemaFormatter(enumSchema, { foo: 'bar' }, { attributes: ['.foo'] })

    const { value: transformedValue } = formatter.next()
    expect(transformedValue).toStrictEqual({ foo: 'bar' })
  })

  test('applies attrFormatter on input properties otherwise (and pass options)', () => {
    const options = { valuePath: ['root'] }
    const formatter = recordSchemaFormatter(schema, { _f: '_foo', _b: '_bar' }, options)

    const { value: transformedValue } = formatter.next()
    expect(transformedValue).toStrictEqual({ f: 'foo', b: 'bar' })

    expect(attrFormatter).toHaveBeenCalledTimes(4)
    expect(attrFormatter).toHaveBeenCalledWith(schema.keys, '_f', {
      transform: true,
      valuePath: ['root', '_f']
    })
    expect(attrFormatter).toHaveBeenCalledWith(schema.elements, '_foo', {
      ...options,
      valuePath: ['root', '_f']
    })
    expect(attrFormatter).toHaveBeenCalledWith(schema.keys, '_b', {
      transform: true,
      valuePath: ['root', '_b']
    })
    expect(attrFormatter).toHaveBeenCalledWith(schema.elements, '_bar', {
      ...options,
      valuePath: ['root', '_b']
    })

    const { done, value: formattedValue } = formatter.next()
    expect(done).toBe(true)
    expect(formattedValue).toStrictEqual({ f: 'foo', b: 'bar' })
  })

  test('filters attributes if provided', () => {
    const options = { attributes: ['.f'] }
    const formatter = recordSchemaFormatter(schema, { _f: '_foo', _b: '_bar' }, options)

    const { value: transformedValue } = formatter.next()
    expect(transformedValue).toStrictEqual({ f: 'foo' })

    expect(attrFormatter).toHaveBeenCalledTimes(3)
    expect(attrFormatter).toHaveBeenCalledWith(schema.keys, '_f', {
      transform: true,
      valuePath: ['_f']
    })
    expect(attrFormatter).toHaveBeenCalledWith(schema.elements, '_foo', {
      ...options,
      valuePath: ['_f'],
      attributes: undefined
    })
    expect(attrFormatter).toHaveBeenCalledWith(schema.keys, '_b', {
      transform: true,
      valuePath: ['_b']
    })

    const { done, value: formattedValue } = formatter.next()
    expect(done).toBe(true)
    expect(formattedValue).toStrictEqual({ f: 'foo' })
  })

  test('does not transform item if transformed is false', () => {
    const options = { transform: false }
    const formatter = recordSchemaFormatter(schema, { f: 'foo', b: 'bar' }, options)

    const { done, value: formattedValue } = formatter.next()
    expect(done).toBe(true)
    expect(formattedValue).toStrictEqual({ f: 'foo', b: 'bar' })

    expect(attrFormatter).toHaveBeenCalledTimes(4)
    expect(attrFormatter).toHaveBeenCalledWith(schema.keys, 'f', { ...options, valuePath: ['f'] })
    expect(attrFormatter).toHaveBeenCalledWith(schema.elements, 'foo', {
      ...options,
      valuePath: ['f']
    })
    expect(attrFormatter).toHaveBeenCalledWith(schema.keys, 'b', { ...options, valuePath: ['b'] })
    expect(attrFormatter).toHaveBeenCalledWith(schema.elements, 'bar', {
      ...options,
      valuePath: ['b']
    })
  })

  // TODO: Apply validation
})
