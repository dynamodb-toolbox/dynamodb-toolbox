import type { A } from 'ts-toolbelt'
import { z } from 'zod'

import { string } from '~/schema/index.js'

import { schemaZodFormatter } from './schema.js'

const FOO = 'foo'
const BAR = 'bar'

describe('zodSchemer > formatter > string', () => {
  test('returns string zod schema', () => {
    const schema = string()
    const output = schemaZodFormatter(schema)
    const expected = z.string()

    const assert: A.Equals<typeof output, typeof expected> = 1
    assert

    expect(expected).toBeInstanceOf(z.ZodString)
    expect(output).toBeInstanceOf(z.ZodString)

    expect(expected.parse(FOO)).toBe(FOO)
    expect(output.parse(FOO)).toBe(FOO)

    expect(() => expected.parse(undefined)).toThrow()
    expect(() => output.parse(undefined)).toThrow()
  })

  describe('optionality', () => {
    test('returns optional zod schema', () => {
      const schema = string().optional()
      const output = schemaZodFormatter(schema)
      const expected = z.string().optional()

      const assert: A.Equals<typeof output, typeof expected> = 1
      assert

      expect(expected).toBeInstanceOf(z.ZodOptional)
      expect(output).toBeInstanceOf(z.ZodOptional)
      expect(expected.unwrap()).toBeInstanceOf(z.ZodType)
      expect(output.unwrap()).toBeInstanceOf(z.ZodType)

      expect(expected.parse(undefined)).toBe(undefined)
      expect(output.parse(undefined)).toBe(undefined)
    })

    test('returns non-optional zod schema if defined is true', () => {
      const schema = string().optional()
      const output = schemaZodFormatter(schema, { defined: true })
      const expected = z.string()

      const assert: A.Equals<typeof output, typeof expected> = 1
      assert

      expect(expected).toBeInstanceOf(z.ZodString)
      expect(output).toBeInstanceOf(z.ZodString)

      expect(() => expected.parse(undefined)).toThrow()
      expect(() => output.parse(undefined)).toThrow()
    })
  })

  describe('validation', () => {
    test('returns zod effect if validate is set', () => {
      const isNonEmpty = (input: string): boolean => input.length > 0
      const schema = string().validate(isNonEmpty)
      const output = schemaZodFormatter(schema)
      const expected = z.string().refine(isNonEmpty)

      const assert: A.Equals<typeof output, typeof expected> = 1
      assert

      expect(expected).toBeInstanceOf(z.ZodEffects)
      expect(expected.innerType()).toBeInstanceOf(z.ZodString)
      expect(output).toBeInstanceOf(z.ZodEffects)
      expect(output.innerType()).toBeInstanceOf(z.ZodString)

      expect(() => expected.parse(1)).toThrow()
      expect(() => output.parse(1)).toThrow()
    })
  })

  describe('encoding/decoding', () => {
    test('returns zod effect if transform is set', () => {
      const transformer = {
        encode: (content: string) => ({ content }),
        decode: ({ content }: { content: string }) => content
      }
      const schema = string().transform(transformer)
      const output = schemaZodFormatter(schema)
      const expectedSchema = z.string()
      const expectedEffect = z.preprocess(arg => transformer.decode(arg as any), expectedSchema)

      const assert: A.Equals<
        typeof output,
        // NOTE: I couldn't find a way to pass an input type to an effect so I have to re-define one here
        z.ZodEffects<typeof expectedSchema, z.output<typeof expectedSchema>, { content: string }>
      > = 1
      assert

      const CONTENT_STR = { content: FOO }

      expect(expectedEffect).toBeInstanceOf(z.ZodEffects)
      expect(expectedEffect.innerType()).toBeInstanceOf(z.ZodString)
      expect(output).toBeInstanceOf(z.ZodEffects)
      expect(output.innerType()).toBeInstanceOf(z.ZodString)

      expect(expectedEffect.parse(CONTENT_STR)).toBe(FOO)
      expect(output.parse(CONTENT_STR)).toBe(FOO)
    })

    test('returns untransformed zod schema if transform is set but transform is false', () => {
      const transformer = {
        encode: (content: string) => ({ content }),
        decode: ({ content }: { content: string }) => content
      }
      const schema = string().transform(transformer)
      const output = schemaZodFormatter(schema, { transform: false })
      const expected = z.string()

      const assert: A.Equals<typeof output, typeof expected> = 1
      assert

      expect(expected).toBeInstanceOf(z.ZodString)
      expect(output).toBeInstanceOf(z.ZodString)

      expect(expected.parse(FOO)).toBe(FOO)
      expect(output.parse(FOO)).toBe(FOO)
    })
  })

  describe('partiality', () => {
    test('returns optional zod schema if partial is true', () => {
      const schema = string()
      const output = schemaZodFormatter(schema, { partial: true })
      const expected = z.string().optional()

      const assert: A.Equals<typeof output, typeof expected> = 1
      assert

      expect(expected).toBeInstanceOf(z.ZodOptional)
      expect(output).toBeInstanceOf(z.ZodOptional)
      expect(expected.unwrap()).toBeInstanceOf(z.ZodType)
      expect(output.unwrap()).toBeInstanceOf(z.ZodType)

      expect(expected.parse(undefined)).toBe(undefined)
      expect(output.parse(undefined)).toBe(undefined)
    })

    test('returns non-optional zod schema if partial and defined are true', () => {
      const schema = string()
      const output = schemaZodFormatter(schema, { partial: true, defined: true })
      const expected = z.string()

      const assert: A.Equals<typeof output, typeof expected> = 1
      assert

      expect(expected).toBeInstanceOf(z.ZodString)
      expect(output).toBeInstanceOf(z.ZodString)

      expect(() => expected.parse(undefined)).toThrow()
      expect(() => output.parse(undefined)).toThrow()
    })
  })

  describe('enumeration', () => {
    test('returns literal zod schema if enum has one value', () => {
      const schema = string().const(FOO)
      const output = schemaZodFormatter(schema)
      const expected = z.literal(FOO)

      const assert: A.Equals<typeof output, typeof expected> = 1
      assert

      expect(expected).toBeInstanceOf(z.ZodLiteral)
      expect(output).toBeInstanceOf(z.ZodLiteral)

      expect(expected.value).toBe(FOO)
      expect(output.value).toBe(FOO)
    })

    test('returns enum zod schema if enum has more than one values', () => {
      const schema = string().enum(FOO, BAR)
      const output = schemaZodFormatter(schema)
      const expected = z.enum([FOO, BAR])

      const assert: A.Equals<typeof output, typeof expected> = 1
      assert

      expect(expected).toBeInstanceOf(z.ZodEnum)
      expect(output).toBeInstanceOf(z.ZodEnum)

      expect(expected.options).toStrictEqual([FOO, BAR])
      expect(output.options).toStrictEqual([FOO, BAR])
    })
  })
})
