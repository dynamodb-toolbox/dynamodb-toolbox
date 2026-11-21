import type { A } from 'ts-toolbelt'
import { z } from 'zod/v4'

import { string } from '~/schema/index.js'

import { schemaZodParser } from './schema.js'

const FOO = 'foo'
const BAR = 'bar'

describe('zodSchemer > parser > string', () => {
  test('returns string zod schema', () => {
    const schema = string()
    const output = schemaZodParser(schema)
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
      const output = schemaZodParser(schema)
      const expected = z.string().optional()

      const assert: A.Equals<typeof output, typeof expected> = 1
      assert

      expect(expected).toBeInstanceOf(z.ZodOptional)
      expect(output).toBeInstanceOf(z.ZodOptional)
      expect(expected.unwrap()).toBeInstanceOf(z.ZodType)
      expect(output.unwrap()).toBeInstanceOf(z.ZodType)

      expect(expected.parse(FOO)).toBe(FOO)
      expect(output.parse(FOO)).toBe(FOO)

      expect(expected.parse(undefined)).toBe(undefined)
      expect(output.parse(undefined)).toBe(undefined)
    })

    test('returns non-optional zod schema if defined is true', () => {
      const schema = string().optional()
      const output = schemaZodParser(schema, { defined: true })
      const expected = z.string()

      const assert: A.Equals<typeof output, typeof expected> = 1
      assert

      expect(expected).toBeInstanceOf(z.ZodString)
      expect(output).toBeInstanceOf(z.ZodString)

      expect(() => expected.parse(undefined)).toThrow()
      expect(() => output.parse(undefined)).toThrow()
    })
  })

  describe('defaults', () => {
    test('returns defaulted zod schema', () => {
      const schema = string().default(FOO)
      const output = schemaZodParser(schema)
      const expected = z.string().default(FOO)

      const assert: A.Equals<typeof output, typeof expected> = 1
      assert

      expect(expected).toBeInstanceOf(z.ZodDefault)
      expect(expected.unwrap()).toBeInstanceOf(z.ZodType)
      expect(output).toBeInstanceOf(z.ZodDefault)
      expect(output.unwrap()).toBeInstanceOf(z.ZodType)

      expect(expected.parse(undefined)).toStrictEqual(FOO)
      expect(output.parse(undefined)).toStrictEqual(FOO)
    })

    test('returns defaulted zod schema (key)', () => {
      const schema = string().key().default(FOO)
      const output = schemaZodParser(schema)
      const expected = z.string().default(FOO)

      const assert: A.Equals<typeof output, typeof expected> = 1
      assert

      expect(expected).toBeInstanceOf(z.ZodDefault)
      expect(expected.unwrap()).toBeInstanceOf(z.ZodType)
      expect(output).toBeInstanceOf(z.ZodDefault)
      expect(output.unwrap()).toBeInstanceOf(z.ZodType)

      expect(expected.parse(undefined)).toStrictEqual(FOO)
      expect(output.parse(undefined)).toStrictEqual(FOO)
    })

    test('returns non-defaulted zod schema if fill is false', () => {
      const schema = string().default(FOO)
      const output = schemaZodParser(schema, { fill: false })
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
    test('returns checked zod schema if validate is set', () => {
      const isNonEmpty = (input: string): boolean => input.length > 0
      const schema = string().validate(isNonEmpty)
      const output = schemaZodParser(schema)
      const expected = z.string().refine(isNonEmpty)

      const assert: A.Equals<typeof output, typeof expected> = 1
      assert

      expect(expected).toBeInstanceOf(z.ZodString)
      expect(output).toBeInstanceOf(z.ZodString)

      expect(() => expected.parse('')).toThrow()
      expect(() => output.parse('')).toThrow()
    })

    test('reports the validator message', () => {
      const schema = string().validate(input => (input.length > 0 ? true : 'Please fill me'))
      const output = schemaZodParser(schema)

      const { error } = output.safeParse('')

      expect(error?.issues[0]?.message).toBe(
        'Custom validation failed with message: Please fill me.'
      )
    })

    test('applies the key validator on a key schema', () => {
      const schema = string()
        .key()
        .validate(input => (input.length > 0 ? true : 'Please fill me'))
      const output = schemaZodParser(schema)

      const { error } = output.safeParse('')

      expect(error?.issues[0]?.message).toBe(
        'Custom validation failed with message: Please fill me.'
      )
    })

    test('reports a message-less rejection', () => {
      const schema = string().validate(() => false)
      const output = schemaZodParser(schema)

      const { error } = output.safeParse('')

      expect(error?.issues[0]?.message).toBe('Custom validation failed.')
    })
  })

  describe('encoding/decoding', () => {
    test('returns zod pipe if transform is set', () => {
      const transformer = {
        encode: (content: string) => ({ content }),
        decode: ({ content }: { content: string }) => content
      }
      const schema = string().transform(transformer)
      const output = schemaZodParser(schema)
      const expectedSchema = z.string()
      const expectedEffect = expectedSchema.transform(arg => transformer.encode(arg))

      const assert: A.Equals<
        typeof output,
        z.ZodPipe<
          typeof expectedSchema,
          z.ZodTransform<{ content: string }, z.output<typeof expectedSchema>>
        >
      > = 1
      assert

      const CONTENT_STR = { content: FOO }

      expect(expectedEffect).toBeInstanceOf(z.ZodPipe)
      expect(expectedEffect.in).toBeInstanceOf(z.ZodString)
      expect(output).toBeInstanceOf(z.ZodPipe)
      expect(output.in).toBeInstanceOf(z.ZodString)

      expect(expectedEffect.parse(FOO)).toStrictEqual(CONTENT_STR)
      expect(output.parse(FOO)).toStrictEqual(CONTENT_STR)
    })

    test('returns untransformed zod schema if transform is set but transform is false', () => {
      const transformer = {
        encode: (content: string) => ({ content }),
        decode: ({ content }: { content: string }) => content
      }
      const schema = string().transform(transformer)
      const output = schemaZodParser(schema, { transform: false })
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
      const schema = string().enum(FOO)
      const output = schemaZodParser(schema)
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
      const output = schemaZodParser(schema)
      const expected = z.enum([FOO, BAR])

      const assert: A.Equals<typeof output, typeof expected> = 1
      assert

      expect(expected).toBeInstanceOf(z.ZodEnum)
      expect(output).toBeInstanceOf(z.ZodEnum)

      expect(expected.options).toStrictEqual([FOO, BAR])
      expect(output.options).toStrictEqual([FOO, BAR])
    })
  })

  test('applies meta.description', () => {
    const schema = string().meta({ description: 'Desc' })
    const output = schemaZodParser(schema)

    expect(output.description).toBe('Desc')
  })

  test('applies the whole meta store', () => {
    const schema = string().meta({ title: 'Title', description: 'Desc', custom: true })
    const output = schemaZodParser(schema)

    expect(output.meta()).toStrictEqual({ title: 'Title', description: 'Desc', custom: true })
  })
})
