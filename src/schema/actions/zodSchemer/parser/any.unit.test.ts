import type { A } from 'ts-toolbelt'
import { z } from 'zod'

import { any } from '~/schema/index.js'
import { jsonStringify } from '~/transformers/jsonStringify.js'

import { schemaZodParser } from './schema.js'

const VALUE = { foo: 'bar' }

describe('zodSchemer > parser > any', () => {
  test('returns custom zod schema', () => {
    const schema = any()
    const output = schemaZodParser(schema)
    const expected = z.custom()

    const assert: A.Equals<typeof output, typeof expected> = 1
    assert

    expect(expected).toBeInstanceOf(z.ZodType)
    expect(output).toBeInstanceOf(z.ZodType)

    expect(expected.parse(VALUE)).toStrictEqual(VALUE)
    expect(output.parse(VALUE)).toStrictEqual(VALUE)
  })

  test('returns casted custom zod schema', () => {
    const schema = any().castAs<{ foo: 'bar' }>()
    const output = schemaZodParser(schema)
    const expected = z.custom<{ foo: 'bar' }>()

    const assert: A.Equals<typeof output, typeof expected> = 1
    assert

    expect(expected).toBeInstanceOf(z.ZodType)
    expect(output).toBeInstanceOf(z.ZodType)

    expect(expected.parse(VALUE)).toStrictEqual(VALUE)
    expect(output.parse(VALUE)).toStrictEqual(VALUE)
  })

  describe('optionality', () => {
    test('returns optional zod schema', () => {
      const schema = any().optional()
      const output = schemaZodParser(schema)
      const expected = z.custom().optional()

      const assert: A.Equals<typeof output, typeof expected> = 1
      assert

      expect(expected).toBeInstanceOf(z.ZodOptional)
      expect(expected.unwrap()).toBeInstanceOf(z.ZodType)
      expect(output).toBeInstanceOf(z.ZodOptional)
      expect(output.unwrap()).toBeInstanceOf(z.ZodType)

      expect(expected.parse(undefined)).toStrictEqual(undefined)
      expect(output.parse(undefined)).toStrictEqual(undefined)
    })

    test('returns non-optional zod schema if defined is true', () => {
      const schema = any().optional()
      const output = schemaZodParser(schema, { defined: true })
      const expected = z.custom()

      const assert: A.Equals<typeof output, typeof expected> = 1
      assert

      expect(expected).toBeInstanceOf(z.ZodType)
      expect(output).toBeInstanceOf(z.ZodType)
    })
  })

  describe('defaults', () => {
    test('returns defaulted zod schema', () => {
      const schema = any().default(VALUE)
      const output = schemaZodParser(schema)
      const expected = z.custom().default(VALUE)

      const assert: A.Equals<typeof output, typeof expected> = 1
      assert

      expect(expected).toBeInstanceOf(z.ZodDefault)
      expect(expected.removeDefault()).toBeInstanceOf(z.ZodType)
      expect(output).toBeInstanceOf(z.ZodDefault)
      expect(output.removeDefault()).toBeInstanceOf(z.ZodType)

      expect(expected.parse(undefined)).toStrictEqual(VALUE)
      expect(output.parse(undefined)).toStrictEqual(VALUE)
    })

    test('returns defaulted zod schema (key)', () => {
      const schema = any().key().default(VALUE)
      const output = schemaZodParser(schema)
      const expected = z.custom().default(VALUE)

      const assert: A.Equals<typeof output, typeof expected> = 1
      assert

      expect(expected).toBeInstanceOf(z.ZodDefault)
      expect(expected.removeDefault()).toBeInstanceOf(z.ZodType)
      expect(output).toBeInstanceOf(z.ZodDefault)
      expect(output.removeDefault()).toBeInstanceOf(z.ZodType)

      expect(expected.parse(undefined)).toStrictEqual(VALUE)
      expect(output.parse(undefined)).toStrictEqual(VALUE)
    })

    test('returns non-defaulted zod schema if fill is false', () => {
      const schema = any().default(VALUE)
      const output = schemaZodParser(schema, { fill: false })
      const expected = z.custom()

      const assert: A.Equals<typeof output, typeof expected> = 1
      assert

      expect(expected).toBeInstanceOf(z.ZodType)
      expect(output).toBeInstanceOf(z.ZodType)

      expect(expected.parse(undefined)).toStrictEqual(undefined)
      expect(output.parse(undefined)).toStrictEqual(undefined)
    })
  })

  describe('validation', () => {
    test('returns zod effect if validate is set', () => {
      const isString = (input: unknown): boolean => typeof input === 'string'
      const schema = any().validate(isString)
      const output = schemaZodParser(schema)
      const expected = z.custom().refine(isString)

      const assert: A.Equals<typeof output, typeof expected> = 1
      assert

      expect(expected).toBeInstanceOf(z.ZodEffects)
      expect(expected.innerType()).toBeInstanceOf(z.ZodType)
      expect(output).toBeInstanceOf(z.ZodEffects)
      expect(output.innerType()).toBeInstanceOf(z.ZodType)

      expect(() => expected.parse(42)).toThrow()
      expect(() => output.parse(42)).toThrow()
    })
  })

  describe('encoding/decoding', () => {
    test('returns zod effect if transform is set', () => {
      const transformer = jsonStringify()
      const schema = any().transform(transformer)
      const output = schemaZodParser(schema)
      const expectedSchema = z.custom()
      const expectedEffect = expectedSchema.transform(arg => transformer.encode(arg))

      const assert: A.Equals<
        typeof output,
        // NOTE: I couldn't find a way to pass an input type to an effect so I have to re-define one here
        z.ZodEffects<typeof expectedSchema, string, z.input<typeof expectedSchema>>
      > = 1
      assert

      expect(expectedEffect).toBeInstanceOf(z.ZodEffects)
      expect(expectedEffect.innerType()).toBeInstanceOf(z.ZodType)
      expect(output).toBeInstanceOf(z.ZodEffects)
      expect(output.innerType()).toBeInstanceOf(z.ZodType)

      const JSON_VALUE = JSON.stringify(VALUE)

      expect(expectedEffect.parse(VALUE)).toStrictEqual(JSON_VALUE)
      expect(output.parse(VALUE)).toStrictEqual(JSON_VALUE)
    })

    test('returns untransformed zod schema if transform is set but transform is false', () => {
      const transformer = jsonStringify()
      const schema = any().transform(transformer)
      const output = schemaZodParser(schema, { transform: false })
      const expected = z.custom()

      const assert: A.Equals<typeof output, typeof expected> = 1
      assert

      expect(expected).toBeInstanceOf(z.ZodType)
      expect(output).toBeInstanceOf(z.ZodType)

      expect(expected.parse(VALUE)).toStrictEqual(VALUE)
      expect(output.parse(VALUE)).toStrictEqual(VALUE)
    })
  })
})
