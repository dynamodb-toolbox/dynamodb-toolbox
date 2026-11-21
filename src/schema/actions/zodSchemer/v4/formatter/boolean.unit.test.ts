import type { A } from 'ts-toolbelt'
import { z } from 'zod/v4'

import { boolean } from '~/schema/index.js'

import { schemaZodFormatter } from './schema.js'

const TRUE = true
const FALSE = false

describe('zodSchemer > formatter > boolean', () => {
  test('returns boolean zod schema', () => {
    const schema = boolean()
    const output = schemaZodFormatter(schema)
    const expected = z.boolean()

    const assert: A.Equals<typeof output, typeof expected> = 1
    assert

    expect(expected).toBeInstanceOf(z.ZodBoolean)
    expect(output).toBeInstanceOf(z.ZodBoolean)

    expect(expected.parse(TRUE)).toBe(TRUE)
    expect(output.parse(TRUE)).toBe(TRUE)

    expect(() => expected.parse(undefined)).toThrow()
    expect(() => output.parse(undefined)).toThrow()
  })

  describe('optionality', () => {
    test('returns optional zod schema', () => {
      const schema = boolean().optional()
      const output = schemaZodFormatter(schema)
      const expected = z.boolean().optional()

      const assert: A.Equals<typeof output, typeof expected> = 1
      assert

      expect(expected).toBeInstanceOf(z.ZodOptional)
      expect(output).toBeInstanceOf(z.ZodOptional)
      expect(expected.unwrap()).toBeInstanceOf(z.ZodBoolean)
      expect(output.unwrap()).toBeInstanceOf(z.ZodBoolean)

      expect(expected.parse(undefined)).toBe(undefined)
      expect(output.parse(undefined)).toBe(undefined)
    })

    test('returns non-optional zod schema if defined is true', () => {
      const schema = boolean().optional()
      const output = schemaZodFormatter(schema, { defined: true })
      const expected = z.boolean()

      const assert: A.Equals<typeof output, typeof expected> = 1
      assert

      expect(expected).toBeInstanceOf(z.ZodBoolean)
      expect(output).toBeInstanceOf(z.ZodBoolean)

      expect(() => expected.parse(undefined)).toThrow()
      expect(() => output.parse(undefined)).toThrow()
    })
  })

  describe('validation', () => {
    test('returns checked zod schema if validate is set', () => {
      const isTrue = (input: boolean): boolean => input === true
      const schema = boolean().validate(isTrue)
      const output = schemaZodFormatter(schema)
      const expected = z.boolean().refine(isTrue)

      const assert: A.Equals<typeof output, typeof expected> = 1
      assert

      expect(expected).toBeInstanceOf(z.ZodBoolean)
      expect(output).toBeInstanceOf(z.ZodBoolean)

      expect(() => expected.parse(false)).toThrow()
      expect(() => output.parse(false)).toThrow()
    })
  })

  describe('encoding/decoding', () => {
    test('returns zod preprocess if transform is set', () => {
      const transformer = {
        encode: (decoded: boolean) => String(decoded),
        decode: (encoded: string) => encoded === 'true'
      }
      const schema = boolean().transform(transformer)
      const output = schemaZodFormatter(schema)
      const expectedSchema = z.boolean()
      const expectedEffect = z.preprocess(arg => transformer.decode(arg as any), expectedSchema)

      const assert: A.Equals<typeof output, z.ZodPreprocess<typeof expectedSchema, string>> = 1
      assert

      const STR_TRUE = 'true'

      expect(expectedEffect).toBeInstanceOf(z.ZodPipe)
      expect(expectedEffect.out).toBeInstanceOf(z.ZodBoolean)
      expect(output).toBeInstanceOf(z.ZodPipe)
      expect(output.out).toBeInstanceOf(z.ZodBoolean)

      expect(expectedEffect.parse(STR_TRUE)).toBe(TRUE)
      expect(output.parse(STR_TRUE)).toBe(TRUE)
    })

    test('returns untransformed zod schema if transform is set but transform is false', () => {
      const transformer = {
        encode: (decoded: boolean) => String(decoded),
        decode: (encoded: string) => encoded === 'true'
      }
      const schema = boolean().transform(transformer)
      const output = schemaZodFormatter(schema, { transform: false })
      const expected = z.boolean()

      const assert: A.Equals<typeof output, typeof expected> = 1
      assert

      expect(expected).toBeInstanceOf(z.ZodBoolean)
      expect(output).toBeInstanceOf(z.ZodBoolean)

      expect(expected.parse(TRUE)).toBe(TRUE)
      expect(output.parse(TRUE)).toBe(TRUE)
    })
  })

  describe('partiality', () => {
    test('returns optional zod schema if partial is true', () => {
      const schema = boolean()
      const output = schemaZodFormatter(schema, { partial: true })
      const expected = z.boolean().optional()

      const assert: A.Equals<typeof output, typeof expected> = 1
      assert

      expect(expected).toBeInstanceOf(z.ZodOptional)
      expect(output).toBeInstanceOf(z.ZodOptional)
      expect(expected.unwrap()).toBeInstanceOf(z.ZodBoolean)
      expect(output.unwrap()).toBeInstanceOf(z.ZodBoolean)

      expect(expected.parse(undefined)).toBe(undefined)
      expect(output.parse(undefined)).toBe(undefined)
    })

    test('returns non-optional zod schema if partial and defined are true', () => {
      const schema = boolean()
      const output = schemaZodFormatter(schema, { partial: true, defined: true })
      const expected = z.boolean()

      const assert: A.Equals<typeof output, typeof expected> = 1
      assert

      expect(expected).toBeInstanceOf(z.ZodBoolean)
      expect(output).toBeInstanceOf(z.ZodBoolean)

      expect(() => expected.parse(undefined)).toThrow()
      expect(() => output.parse(undefined)).toThrow()
    })
  })

  describe('enumeration', () => {
    test('returns base zod schema if enum is empty', () => {
      const schema = boolean().enum()
      const output = schemaZodFormatter(schema)
      const expected = z.boolean()

      const assert: A.Equals<typeof output, typeof expected> = 1
      assert

      expect(expected).toBeInstanceOf(z.ZodBoolean)
      expect(output).toBeInstanceOf(z.ZodBoolean)
    })

    test('returns literal zod schema if enum has one value', () => {
      const schema = boolean().const(TRUE)
      const output = schemaZodFormatter(schema)
      const expected = z.literal(TRUE)

      const assert: A.Equals<typeof output, typeof expected> = 1
      assert

      expect(expected).toBeInstanceOf(z.ZodLiteral)
      expect(output).toBeInstanceOf(z.ZodLiteral)

      expect(expected.value).toBe(TRUE)
      expect(output.value).toBe(TRUE)
    })

    test('returns multi-value literal zod schema if enum has more than one values', () => {
      const schema = boolean().enum(TRUE, FALSE)
      const output = schemaZodFormatter(schema)
      const expected = z.literal([TRUE, FALSE])

      const assert: A.Equals<typeof output, typeof expected> = 1
      assert

      expect(expected).toBeInstanceOf(z.ZodLiteral)
      expect(output).toBeInstanceOf(z.ZodLiteral)

      expect(expected.values).toStrictEqual(new Set([TRUE, FALSE]))
      expect(output.values).toStrictEqual(new Set([TRUE, FALSE]))
    })
  })

  test('applies meta.description', () => {
    const schema = boolean().meta({ description: 'Desc' })
    const output = schemaZodFormatter(schema)

    expect(output.description).toBe('Desc')
  })
})
