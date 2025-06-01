import type { A } from 'ts-toolbelt'
import { z } from 'zod'

import { boolean } from '~/schema/index.js'

import { schemaZodParser } from './schema.js'

const TRUE = true
const FALSE = false

describe('zodSchemer > parser > boolean', () => {
  test('returns boolean zod schema', () => {
    const schema = boolean()
    const output = schemaZodParser(schema)
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
      const output = schemaZodParser(schema)
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
      const output = schemaZodParser(schema, { partial: true, defined: true })
      const expected = z.boolean()

      const assert: A.Equals<typeof output, typeof expected> = 1
      assert

      expect(expected).toBeInstanceOf(z.ZodBoolean)
      expect(output).toBeInstanceOf(z.ZodBoolean)

      expect(() => expected.parse(undefined)).toThrow()
      expect(() => output.parse(undefined)).toThrow()
    })
  })

  describe('defaults', () => {
    test('returns defaulted zod schema', () => {
      const schema = boolean().default(TRUE)
      const output = schemaZodParser(schema)
      const expected = z.boolean().default(TRUE)

      const assert: A.Equals<typeof output, typeof expected> = 1
      assert

      expect(expected).toBeInstanceOf(z.ZodDefault)
      expect(expected.removeDefault()).toBeInstanceOf(z.ZodBoolean)
      expect(output).toBeInstanceOf(z.ZodDefault)
      expect(output.removeDefault()).toBeInstanceOf(z.ZodBoolean)

      expect(expected.parse(undefined)).toStrictEqual(TRUE)
      expect(output.parse(undefined)).toStrictEqual(TRUE)
    })

    test('returns defaulted zod schema (key)', () => {
      const schema = boolean().key().default(TRUE)
      const output = schemaZodParser(schema)
      const expected = z.boolean().default(TRUE)

      const assert: A.Equals<typeof output, typeof expected> = 1
      assert

      expect(expected).toBeInstanceOf(z.ZodDefault)
      expect(expected.removeDefault()).toBeInstanceOf(z.ZodBoolean)
      expect(output).toBeInstanceOf(z.ZodDefault)
      expect(output.removeDefault()).toBeInstanceOf(z.ZodBoolean)

      expect(expected.parse(undefined)).toStrictEqual(TRUE)
      expect(output.parse(undefined)).toStrictEqual(TRUE)
    })

    test('returns non-defaulted zod schema if fill is false', () => {
      const schema = boolean().default(TRUE)
      const output = schemaZodParser(schema, { fill: false })
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
    test('returns zod effect if validate is set', () => {
      const isTrue = (input: boolean): boolean => input === true
      const schema = boolean().validate(isTrue)
      const output = schemaZodParser(schema)
      const expected = z.boolean().refine(isTrue)

      const assert: A.Equals<typeof output, typeof expected> = 1
      assert

      expect(expected).toBeInstanceOf(z.ZodEffects)
      expect(expected.innerType()).toBeInstanceOf(z.ZodBoolean)
      expect(output).toBeInstanceOf(z.ZodEffects)
      expect(output.innerType()).toBeInstanceOf(z.ZodBoolean)

      expect(() => expected.parse(false)).toThrow()
      expect(() => output.parse(false)).toThrow()
    })
  })

  describe('encoding/decoding', () => {
    test('returns zod effect if transform is set', () => {
      const transformer = {
        encode: (decoded: boolean) => String(decoded),
        decode: (encoded: string) => encoded === 'true'
      }
      const schema = boolean().transform(transformer)
      const output = schemaZodParser(schema)
      const expectedSchema = z.boolean()
      const expectedEffect = expectedSchema.transform(arg => transformer.encode(arg))

      const assert: A.Equals<
        typeof output,
        // NOTE: I couldn't find a way to pass an input type to an effect so I have to re-define one here
        z.ZodEffects<typeof expectedSchema, string, z.input<typeof expectedSchema>>
      > = 1
      assert

      const STR_TRUE = 'true'

      expect(expectedEffect).toBeInstanceOf(z.ZodEffects)
      expect(expectedEffect.innerType()).toBeInstanceOf(z.ZodBoolean)
      expect(output).toBeInstanceOf(z.ZodEffects)
      expect(output.innerType()).toBeInstanceOf(z.ZodBoolean)

      expect(expectedEffect.parse(TRUE)).toBe(STR_TRUE)
      expect(output.parse(TRUE)).toBe(STR_TRUE)
    })

    test('returns untransformed zod schema if transform is set but transform is false', () => {
      const transformer = {
        encode: (decoded: boolean) => String(decoded),
        decode: (encoded: string) => encoded === 'true'
      }
      const schema = boolean().transform(transformer)
      const output = schemaZodParser(schema, { transform: false })
      const expected = z.boolean()

      const assert: A.Equals<typeof output, typeof expected> = 1
      assert

      expect(expected).toBeInstanceOf(z.ZodBoolean)
      expect(output).toBeInstanceOf(z.ZodBoolean)

      expect(expected.parse(TRUE)).toBe(TRUE)
      expect(output.parse(TRUE)).toBe(TRUE)
    })
  })

  describe('enumeration', () => {
    test('returns literal zod schema if enum has one value', () => {
      const schema = boolean().enum(TRUE)
      const output = schemaZodParser(schema)
      const expected = z.literal(TRUE)

      const assert: A.Equals<typeof output, typeof expected> = 1
      assert

      expect(expected).toBeInstanceOf(z.ZodLiteral)
      expect(output).toBeInstanceOf(z.ZodLiteral)

      expect(expected.value).toBe(TRUE)
      expect(output.value).toBe(TRUE)
    })

    test('returns union of literals zod schema if enum has more than one values', () => {
      const schema = boolean().enum(TRUE, FALSE)
      const output = schemaZodParser(schema)
      const expected = z.union([z.literal(TRUE), z.literal(FALSE)])

      const assert: A.Equals<typeof output, typeof expected> = 1
      assert

      expect(expected).toBeInstanceOf(z.ZodUnion)
      expect(expected.options).toHaveLength(2)
      expect(expected.options[0]).toBeInstanceOf(z.ZodLiteral)
      expect(expected.options[0].value).toBe(TRUE)
      expect(expected.options[1]).toBeInstanceOf(z.ZodLiteral)
      expect(expected.options[1].value).toBe(FALSE)
      expect(output).toBeInstanceOf(z.ZodUnion)
      expect(output.options).toHaveLength(2)
      expect(output.options[0]).toBeInstanceOf(z.ZodLiteral)
      expect(output.options[0].value).toBe(TRUE)
      expect(output.options[1]).toBeInstanceOf(z.ZodLiteral)
      expect(output.options[1].value).toBe(FALSE)
    })
  })
})
