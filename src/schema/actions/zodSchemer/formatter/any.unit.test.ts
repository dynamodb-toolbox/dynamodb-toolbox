import type { A } from 'ts-toolbelt'
import { z } from 'zod'

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

    expect(expected).toBeInstanceOf(z.ZodType)
    expect(output).toBeInstanceOf(z.ZodType)

    expect(expected.parse(VALUE)).toStrictEqual(VALUE)
    expect(output.parse(VALUE)).toStrictEqual(VALUE)
  })

  test('returns casted custom zod schema', () => {
    const schema = any().castAs<{ foo: 'bar' }>()
    const output = schemaZodFormatter(schema)
    const expected = z.custom<{ foo: 'bar' }>()

    const assert: A.Equals<typeof output, typeof expected> = 1
    assert

    expect(expected).toBeInstanceOf(z.ZodType)
    expect(output).toBeInstanceOf(z.ZodType)
  })

  describe('optionality', () => {
    test('returns optional zod schema', () => {
      const schema = any().optional()
      const output = schemaZodFormatter(schema)
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

    test('returns non-optional zod schema defined is true', () => {
      const schema = any().optional()
      const output = schemaZodFormatter(schema, { defined: true })
      const expected = z.custom()

      const assert: A.Equals<typeof output, typeof expected> = 1
      assert

      expect(expected).toBeInstanceOf(z.ZodType)
      expect(output).toBeInstanceOf(z.ZodType)
    })
  })

  describe('encoding/decoding', () => {
    test('returns zod effect if transform is set', () => {
      const transformer = jsonStringify()
      const schema = any().transform(transformer)
      const output = schemaZodFormatter(schema)
      const expectedSchema = z.custom()
      const expectedEffect = z.preprocess(arg => transformer.decode(arg as any), expectedSchema)

      const assert: A.Equals<
        typeof output,
        // NOTE: I couldn't find a way to pass an input type to an effect so I have to re-define one here
        z.ZodEffects<typeof expectedSchema, z.output<typeof expectedSchema>, string>
      > = 1
      assert

      expect(expectedEffect).toBeInstanceOf(z.ZodEffects)
      expect(expectedEffect.innerType()).toBeInstanceOf(z.ZodType)
      expect(output).toBeInstanceOf(z.ZodEffects)
      expect(output.innerType()).toBeInstanceOf(z.ZodType)

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

      expect(expected).toBeInstanceOf(z.ZodType)
      expect(output).toBeInstanceOf(z.ZodType)

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
      expect(expected.unwrap()).toBeInstanceOf(z.ZodType)
      expect(output).toBeInstanceOf(z.ZodOptional)
      expect(output.unwrap()).toBeInstanceOf(z.ZodType)

      expect(expected.parse(undefined)).toStrictEqual(undefined)
      expect(output.parse(undefined)).toStrictEqual(undefined)
    })

    test('returns non-optional zod schema if partial and defined are true', () => {
      const schema = any()
      const output = schemaZodFormatter(schema, { partial: true, defined: true })
      const expected = z.custom()

      const assert: A.Equals<typeof output, typeof expected> = 1
      assert

      expect(expected).toBeInstanceOf(z.ZodType)
      expect(output).toBeInstanceOf(z.ZodType)
    })
  })
})
