import type { A } from 'ts-toolbelt'
import { z } from 'zod/v4'

import { DynamoDBToolboxError } from '~/errors/index.js'
import { NumberSchema_, SetSchema_, StringSchema_, number, set, string } from '~/schema/index.js'

import { fromZodSchema } from './fromZodSchema.js'

describe('fromZodSchema(v4) > zodSet', () => {
  test('returns string set schema', () => {
    const schema = z.set(z.string())
    const output = fromZodSchema(schema)
    const expected = set(string())

    const assert: A.Equals<typeof output, typeof expected> = 1
    assert

    expect(output).toBeInstanceOf(SetSchema_)
    expect(output.elements).toBeInstanceOf(StringSchema_)
  })

  test('returns number set schema', () => {
    const schema = z.set(z.number())
    const output = fromZodSchema(schema)
    const expected = set(number())

    const assert: A.Equals<typeof output, typeof expected> = 1
    assert

    expect(output).toBeInstanceOf(SetSchema_)
    expect(output.elements).toBeInstanceOf(NumberSchema_)
  })

  test('returns big number set schema', () => {
    const schema = z.set(z.bigint())
    const output = fromZodSchema(schema)
    const expected = set(number().big())

    const assert: A.Equals<typeof output, typeof expected> = 1
    assert

    expect(output).toBeInstanceOf(SetSchema_)
    expect(output.elements).toBeInstanceOf(NumberSchema_)
    expect(output.elements.props.big).toBe(true)
  })

  test('throws if values are neither strings nor numbers', () => {
    const invalidCall = () => fromZodSchema(z.set(z.boolean()))

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(
      expect.objectContaining({ code: 'fromZodSchema.unsupportedSetValueType' })
    )
  })

  test('throws if values are optional', () => {
    const invalidCall = () => fromZodSchema(z.set(z.string().optional()))

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(
      expect.objectContaining({ code: 'fromZodSchema.unsupportedSetValueType' })
    )
  })

  test('throws if values are defaulted', () => {
    const invalidCall = () => fromZodSchema(z.set(z.string().default('foo')))

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(
      expect.objectContaining({ code: 'fromZodSchema.unsupportedSetValueType' })
    )
  })

  test('maps a description to meta.description', () => {
    const output = fromZodSchema(z.set(z.string()).describe('Desc'))

    expect((output.props as { meta?: unknown }).meta).toStrictEqual({ description: 'Desc' })
  })
})
