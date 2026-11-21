import type { A } from 'ts-toolbelt'
import { z } from 'zod/v4'

import { nul } from '~/schema/index.js'

import { schemaZodFormatter } from './schema.js'

const NULL = null

describe('zodSchemer > formatter > nul', () => {
  test('returns nul zod schema', () => {
    const schema = nul()
    const output = schemaZodFormatter(schema)
    const expected = z.null()

    const assert: A.Equals<typeof output, typeof expected> = 1
    assert

    expect(expected).toBeInstanceOf(z.ZodNull)
    expect(output).toBeInstanceOf(z.ZodNull)

    expect(expected.parse(NULL)).toBe(NULL)
    expect(output.parse(NULL)).toBe(NULL)

    expect(() => expected.parse(undefined)).toThrow()
    expect(() => output.parse(undefined)).toThrow()
  })

  describe('optionality', () => {
    test('returns optional zod schema', () => {
      const schema = nul().optional()
      const output = schemaZodFormatter(schema)
      const expected = z.null().optional()

      const assert: A.Equals<typeof output, typeof expected> = 1
      assert

      expect(expected).toBeInstanceOf(z.ZodOptional)
      expect(output).toBeInstanceOf(z.ZodOptional)
      expect(expected.unwrap()).toBeInstanceOf(z.ZodNull)
      expect(output.unwrap()).toBeInstanceOf(z.ZodNull)

      expect(expected.parse(undefined)).toBe(undefined)
      expect(output.parse(undefined)).toBe(undefined)
    })

    test('returns non-optional zod schema if defined is true', () => {
      const schema = nul().optional()
      const output = schemaZodFormatter(schema, { defined: true })
      const expected = z.null()

      const assert: A.Equals<typeof output, typeof expected> = 1
      assert

      expect(expected).toBeInstanceOf(z.ZodNull)
      expect(output).toBeInstanceOf(z.ZodNull)

      expect(() => expected.parse(undefined)).toThrow()
      expect(() => output.parse(undefined)).toThrow()
    })
  })

  describe('validation', () => {
    test('returns checked zod schema if validate is set', () => {
      const isNull = (input: null): boolean => input === null
      const schema = nul().validate(isNull)
      const output = schemaZodFormatter(schema)
      const expected = z.null().refine(isNull)

      const assert: A.Equals<typeof output, typeof expected> = 1
      assert

      expect(expected).toBeInstanceOf(z.ZodNull)
      expect(output).toBeInstanceOf(z.ZodNull)
    })
  })

  describe('encoding/decoding', () => {
    test('returns zod preprocess if transform is set', () => {
      const transformer = {
        encode: (value: null) => ({ value }),
        decode: ({ value }: { value: null }) => value
      }
      const schema = nul().transform(transformer)
      const output = schemaZodFormatter(schema)
      const expectedSchema = z.null()
      const expectedEffect = z.preprocess(arg => transformer.decode(arg as any), expectedSchema)

      const assert: A.Equals<
        typeof output,
        z.ZodPreprocess<typeof expectedSchema, { value: null }>
      > = 1
      assert

      const VALUE_NULL = { value: NULL }

      expect(expectedEffect).toBeInstanceOf(z.ZodPipe)
      expect(expectedEffect.out).toBeInstanceOf(z.ZodNull)
      expect(output).toBeInstanceOf(z.ZodPipe)
      expect(output.out).toBeInstanceOf(z.ZodNull)

      expect(expectedEffect.parse(VALUE_NULL)).toBe(NULL)
      expect(output.parse(VALUE_NULL)).toBe(NULL)
    })

    test('returns untransformed zod schema if transform is set but transform is false', () => {
      const transformer = {
        encode: (value: null) => ({ value }),
        decode: ({ value }: { value: null }) => value
      }
      const schema = nul().transform(transformer)
      const output = schemaZodFormatter(schema, { transform: false })
      const expected = z.null()

      const assert: A.Equals<typeof output, typeof expected> = 1
      assert

      expect(expected).toBeInstanceOf(z.ZodNull)
      expect(output).toBeInstanceOf(z.ZodNull)

      expect(expected.parse(NULL)).toBe(NULL)
      expect(output.parse(NULL)).toBe(NULL)
    })
  })

  describe('partiality', () => {
    test('returns optional zod schema if partial is true', () => {
      const schema = nul()
      const output = schemaZodFormatter(schema, { partial: true })
      const expected = z.null().optional()

      const assert: A.Equals<typeof output, typeof expected> = 1
      assert

      expect(expected).toBeInstanceOf(z.ZodOptional)
      expect(output).toBeInstanceOf(z.ZodOptional)
      expect(expected.unwrap()).toBeInstanceOf(z.ZodNull)
      expect(output.unwrap()).toBeInstanceOf(z.ZodNull)

      expect(expected.parse(undefined)).toBe(undefined)
      expect(output.parse(undefined)).toBe(undefined)
    })

    test('returns non-optional zod schema if partial and defined are true', () => {
      const schema = nul()
      const output = schemaZodFormatter(schema, { partial: true, defined: true })
      const expected = z.null()

      const assert: A.Equals<typeof output, typeof expected> = 1
      assert

      expect(expected).toBeInstanceOf(z.ZodNull)
      expect(output).toBeInstanceOf(z.ZodNull)

      expect(() => expected.parse(undefined)).toThrow()
      expect(() => output.parse(undefined)).toThrow()
    })
  })

  test('applies meta.description', () => {
    const schema = nul().meta({ description: 'Desc' })
    const output = schemaZodFormatter(schema)

    expect(output.description).toBe('Desc')
  })
})
