import type { A } from 'ts-toolbelt'
import { z } from 'zod'

import { nul } from '~/schema/index.js'

import { schemaZodParser } from './schema.js'

const NULL = null

describe('zodSchemer > formatter > nul', () => {
  test('returns nul zod schema', () => {
    const schema = nul()
    const output = schemaZodParser(schema)
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
      const output = schemaZodParser(schema)
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
      const output = schemaZodParser(schema, { defined: true })
      const expected = z.null()

      const assert: A.Equals<typeof output, typeof expected> = 1
      assert

      expect(expected).toBeInstanceOf(z.ZodNull)
      expect(output).toBeInstanceOf(z.ZodNull)

      expect(() => expected.parse(undefined)).toThrow()
      expect(() => output.parse(undefined)).toThrow()
    })
  })

  describe('defaults', () => {
    test('returns defaulted zod schema', () => {
      const schema = nul().default(NULL)
      const output = schemaZodParser(schema)
      const expected = z.null().default(NULL)

      const assert: A.Equals<typeof output, typeof expected> = 1
      assert

      expect(expected).toBeInstanceOf(z.ZodDefault)
      expect(expected.removeDefault()).toBeInstanceOf(z.ZodNull)
      expect(output).toBeInstanceOf(z.ZodDefault)
      expect(output.removeDefault()).toBeInstanceOf(z.ZodNull)

      expect(expected.parse(undefined)).toStrictEqual(NULL)
      expect(output.parse(undefined)).toStrictEqual(NULL)
    })

    test('returns defaulted zod schema (key)', () => {
      const schema = nul().key().default(NULL)
      const output = schemaZodParser(schema)
      const expected = z.null().default(NULL)

      const assert: A.Equals<typeof output, typeof expected> = 1
      assert

      expect(expected).toBeInstanceOf(z.ZodDefault)
      expect(expected.removeDefault()).toBeInstanceOf(z.ZodNull)
      expect(output).toBeInstanceOf(z.ZodDefault)
      expect(output.removeDefault()).toBeInstanceOf(z.ZodNull)

      expect(expected.parse(undefined)).toStrictEqual(NULL)
      expect(output.parse(undefined)).toStrictEqual(NULL)
    })

    test('returns non-defaulted zod schema if fill is false', () => {
      const schema = nul().default(NULL)
      const output = schemaZodParser(schema, { fill: false })
      const expected = z.null()

      const assert: A.Equals<typeof output, typeof expected> = 1
      assert

      expect(expected).toBeInstanceOf(z.ZodNull)
      expect(output).toBeInstanceOf(z.ZodNull)

      expect(() => expected.parse(undefined)).toThrow()
      expect(() => output.parse(undefined)).toThrow()
    })
  })

  describe('encoding/decoding', () => {
    test('returns zod effect if transform is set', () => {
      const transformer = {
        encode: (value: null) => ({ value }),
        decode: ({ value }: { value: null }) => value
      }
      const schema = nul().transform(transformer)
      const output = schemaZodParser(schema)
      const expectedSchema = z.null()
      const expectedEffect = expectedSchema.transform(arg => transformer.encode(arg))

      const assert: A.Equals<
        typeof output,
        // NOTE: I couldn't find a way to pass an input type to an effect so I have to re-define one here
        z.ZodEffects<typeof expectedSchema, { value: null }, z.input<typeof expectedSchema>>
      > = 1
      assert

      const VALUE_NULL = { value: NULL }

      expect(expectedEffect).toBeInstanceOf(z.ZodEffects)
      expect(expectedEffect.innerType()).toBeInstanceOf(z.ZodNull)
      expect(output).toBeInstanceOf(z.ZodEffects)
      expect(output.innerType()).toBeInstanceOf(z.ZodNull)

      expect(expectedEffect.parse(NULL)).toStrictEqual(VALUE_NULL)
      expect(output.parse(NULL)).toStrictEqual(VALUE_NULL)
    })

    test('returns untransformed zod schema if transform is set but transform is false', () => {
      const transformer = {
        encode: (value: null) => ({ value }),
        decode: ({ value }: { value: null }) => value
      }
      const schema = nul().transform(transformer)
      const output = schemaZodParser(schema, { transform: false })
      const expected = z.null()

      const assert: A.Equals<typeof output, typeof expected> = 1
      assert

      expect(expected).toBeInstanceOf(z.ZodNull)
      expect(output).toBeInstanceOf(z.ZodNull)

      expect(expected.parse(NULL)).toBe(NULL)
      expect(output.parse(NULL)).toBe(NULL)
    })
  })
})
