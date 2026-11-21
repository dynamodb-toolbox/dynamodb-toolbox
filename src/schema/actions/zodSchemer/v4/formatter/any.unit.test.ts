import type { A } from 'ts-toolbelt'
import { z } from 'zod/v4'

import { any } from '~/schema/index.js'
import { jsonStringify } from '~/transformers/jsonStringify.js'

import { schemaZodFormatter } from './schema.js'

const VALUE = { foo: 'bar' }

describe('zodSchemer > formatter > any', () => {
  test('returns custom zod schema', () => {
    const schema = any()
    const output = schemaZodFormatter(schema)
    const expected = z.custom()

    const assert: A.Equals<typeof output, typeof expected> = 1
    assert

    expect(expected).toBeInstanceOf(z.ZodCustom)
    expect(output).toBeInstanceOf(z.ZodCustom)

    expect(expected.parse(VALUE)).toStrictEqual(VALUE)
    expect(output.parse(VALUE)).toStrictEqual(VALUE)
  })

  test('returns casted custom zod schema', () => {
    const schema = any().castAs<{ foo: 'bar' }>()
    const output = schemaZodFormatter(schema)
    const expected = z.custom<{ foo: 'bar' }>()

    const assert: A.Equals<typeof output, typeof expected> = 1
    assert

    expect(expected).toBeInstanceOf(z.ZodCustom)
    expect(output).toBeInstanceOf(z.ZodCustom)

    expect(expected.parse(VALUE)).toStrictEqual(VALUE)
    expect(output.parse(VALUE)).toStrictEqual(VALUE)
  })

  describe('optionality', () => {
    test('returns optional zod schema', () => {
      const schema = any().optional()
      const output = schemaZodFormatter(schema)
      const expected = z.custom().optional()

      const assert: A.Equals<typeof output, typeof expected> = 1
      assert

      expect(expected).toBeInstanceOf(z.ZodOptional)
      expect(expected.unwrap()).toBeInstanceOf(z.ZodCustom)
      expect(output).toBeInstanceOf(z.ZodOptional)
      expect(output.unwrap()).toBeInstanceOf(z.ZodCustom)

      expect(expected.parse(undefined)).toStrictEqual(undefined)
      expect(output.parse(undefined)).toStrictEqual(undefined)
    })

    test('returns non-optional zod schema if defined is true', () => {
      const schema = any().optional()
      const output = schemaZodFormatter(schema, { defined: true })
      const expected = z.custom()

      const assert: A.Equals<typeof output, typeof expected> = 1
      assert

      expect(expected).toBeInstanceOf(z.ZodCustom)
      expect(output).toBeInstanceOf(z.ZodCustom)
    })
  })

  describe('validation', () => {
    test('returns checked zod schema if validate is set', () => {
      const isString = (input: unknown): boolean => typeof input === 'string'
      const schema = any().validate(isString)
      const output = schemaZodFormatter(schema)
      const expected = z.custom().refine(isString)

      const assert: A.Equals<typeof output, typeof expected> = 1
      assert

      expect(expected).toBeInstanceOf(z.ZodCustom)
      expect(output).toBeInstanceOf(z.ZodCustom)

      expect(() => expected.parse(42)).toThrow()
      expect(() => output.parse(42)).toThrow()
    })
  })

  describe('encoding/decoding', () => {
    test('returns zod preprocess if transform is set', () => {
      const transformer = jsonStringify()
      const schema = any().transform(transformer)
      const output = schemaZodFormatter(schema)
      const expectedSchema = z.custom()
      const expectedEffect = z.preprocess(arg => transformer.decode(arg as any), expectedSchema)

      const assert: A.Equals<typeof output, z.ZodPreprocess<typeof expectedSchema, string>> = 1
      assert

      expect(expectedEffect).toBeInstanceOf(z.ZodPipe)
      expect(expectedEffect.out).toBeInstanceOf(z.ZodCustom)
      expect(output).toBeInstanceOf(z.ZodPipe)
      expect(output.out).toBeInstanceOf(z.ZodCustom)

      const JSON_VALUE = JSON.stringify(VALUE)

      expect(expectedEffect.parse(JSON_VALUE)).toStrictEqual(VALUE)
      expect(output.parse(JSON_VALUE)).toStrictEqual(VALUE)
    })

    test('returns untransformed zod schema if transform is set but transform is false', () => {
      const transformer = jsonStringify()
      const schema = any().transform(transformer)
      const output = schemaZodFormatter(schema, { transform: false })
      const expected = z.custom()

      const assert: A.Equals<typeof output, typeof expected> = 1
      assert

      expect(expected).toBeInstanceOf(z.ZodCustom)
      expect(output).toBeInstanceOf(z.ZodCustom)

      expect(expected.parse(VALUE)).toStrictEqual(VALUE)
      expect(output.parse(VALUE)).toStrictEqual(VALUE)
    })
  })

  describe('partiality', () => {
    test('returns optional zod schema if partial is true', () => {
      const schema = any()
      const output = schemaZodFormatter(schema, { partial: true })
      const expected = z.custom().optional()

      const assert: A.Equals<typeof output, typeof expected> = 1
      assert

      expect(expected).toBeInstanceOf(z.ZodOptional)
      expect(expected.unwrap()).toBeInstanceOf(z.ZodCustom)
      expect(output).toBeInstanceOf(z.ZodOptional)
      expect(output.unwrap()).toBeInstanceOf(z.ZodCustom)

      expect(expected.parse(undefined)).toStrictEqual(undefined)
      expect(output.parse(undefined)).toStrictEqual(undefined)
    })

    test('returns non-optional zod schema if partial and defined are true', () => {
      const schema = any()
      const output = schemaZodFormatter(schema, { partial: true, defined: true })
      const expected = z.custom()

      const assert: A.Equals<typeof output, typeof expected> = 1
      assert

      expect(expected).toBeInstanceOf(z.ZodCustom)
      expect(output).toBeInstanceOf(z.ZodCustom)
    })
  })

  test('applies meta.description', () => {
    const schema = any().meta({ description: 'Desc' })
    const output = schemaZodFormatter(schema)

    expect(output.description).toBe('Desc')
  })
})
