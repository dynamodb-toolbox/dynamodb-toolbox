import type { A } from 'ts-toolbelt'
import { z } from 'zod'

import { number } from '~/schema/index.js'

import { schemaZodParser } from './schema.js'

const NUM = 42
const NUM_2 = 43
const BIG_NUM = BigInt('42')

describe('zodSchemer > formatter > number', () => {
  test('returns number zod schema', () => {
    const schema = number()
    const output = schemaZodParser(schema)
    const expected = z.number()

    const assert: A.Equals<typeof output, typeof expected> = 1
    assert

    expect(expected).toBeInstanceOf(z.ZodNumber)
    expect(output).toBeInstanceOf(z.ZodNumber)

    expect(expected.parse(NUM)).toBe(NUM)
    expect(output.parse(NUM)).toBe(NUM)

    expect(() => expected.parse(BIG_NUM)).toThrow()
    expect(() => output.parse(BIG_NUM)).toThrow()

    expect(() => expected.parse(undefined)).toThrow()
    expect(() => output.parse(undefined)).toThrow()
  })

  test('returns union zod schema if big is true', () => {
    const schema = number().big()
    const output = schemaZodParser(schema)
    const expected = z.union([z.number(), z.bigint()])

    const assert: A.Equals<typeof output, typeof expected> = 1
    assert

    expect(expected).toBeInstanceOf(z.ZodUnion)
    expect(expected.options).toHaveLength(2)
    expect(expected.options[0]).toBeInstanceOf(z.ZodNumber)
    expect(expected.options[1]).toBeInstanceOf(z.ZodBigInt)
    expect(output).toBeInstanceOf(z.ZodUnion)
    expect(output.options).toHaveLength(2)
    expect(output.options[0]).toBeInstanceOf(z.ZodNumber)
    expect(output.options[1]).toBeInstanceOf(z.ZodBigInt)

    expect(expected.parse(NUM)).toBe(NUM)
    expect(output.parse(NUM)).toBe(NUM)

    expect(expected.parse(BIG_NUM)).toBe(BIG_NUM)
    expect(output.parse(BIG_NUM)).toBe(BIG_NUM)
  })

  describe('optionality', () => {
    test('returns optional zod schema', () => {
      const schema = number().optional()
      const output = schemaZodParser(schema)
      const expected = z.number().optional()

      const assert: A.Equals<typeof output, typeof expected> = 1
      assert

      expect(expected).toBeInstanceOf(z.ZodOptional)
      expect(output).toBeInstanceOf(z.ZodOptional)
      expect(expected.unwrap()).toBeInstanceOf(z.ZodNumber)
      expect(output.unwrap()).toBeInstanceOf(z.ZodNumber)

      expect(expected.parse(undefined)).toBe(undefined)
      expect(output.parse(undefined)).toBe(undefined)
    })

    test('returns non-optional zod schema if defined is true', () => {
      const schema = number().optional()
      const output = schemaZodParser(schema, { defined: true })
      const expected = z.number()

      const assert: A.Equals<typeof output, typeof expected> = 1
      assert

      expect(expected).toBeInstanceOf(z.ZodNumber)
      expect(output).toBeInstanceOf(z.ZodNumber)

      expect(() => expected.parse(undefined)).toThrow()
      expect(() => output.parse(undefined)).toThrow()
    })
  })

  describe('defaults', () => {
    test('returns defaulted zod schema', () => {
      const schema = number().default(NUM)
      const output = schemaZodParser(schema)
      const expected = z.number().default(NUM)

      const assert: A.Equals<typeof output, typeof expected> = 1
      assert

      expect(expected).toBeInstanceOf(z.ZodDefault)
      expect(expected.removeDefault()).toBeInstanceOf(z.ZodNumber)
      expect(output).toBeInstanceOf(z.ZodDefault)
      expect(output.removeDefault()).toBeInstanceOf(z.ZodNumber)

      expect(expected.parse(undefined)).toStrictEqual(NUM)
      expect(output.parse(undefined)).toStrictEqual(NUM)
    })

    test('returns defaulted zod schema (key)', () => {
      const schema = number().key().default(NUM)
      const output = schemaZodParser(schema)
      const expected = z.number().default(NUM)

      const assert: A.Equals<typeof output, typeof expected> = 1
      assert

      expect(expected).toBeInstanceOf(z.ZodDefault)
      expect(expected.removeDefault()).toBeInstanceOf(z.ZodNumber)
      expect(output).toBeInstanceOf(z.ZodDefault)
      expect(output.removeDefault()).toBeInstanceOf(z.ZodNumber)

      expect(expected.parse(undefined)).toStrictEqual(NUM)
      expect(output.parse(undefined)).toStrictEqual(NUM)
    })

    test('returns non-defaulted zod schema if fill is false', () => {
      const schema = number().default(NUM)
      const output = schemaZodParser(schema, { fill: false })
      const expected = z.number()

      const assert: A.Equals<typeof output, typeof expected> = 1
      assert

      expect(expected).toBeInstanceOf(z.ZodNumber)
      expect(output).toBeInstanceOf(z.ZodNumber)

      expect(() => expected.parse(undefined)).toThrow()
      expect(() => output.parse(undefined)).toThrow()
    })
  })

  describe('encoding/decoding', () => {
    test('returns zod effect if transform is set', () => {
      const transformer = {
        encode: (value: number) => ({ value }),
        decode: ({ value }: { value: number }) => value
      }
      const schema = number().transform(transformer)
      const output = schemaZodParser(schema)
      const expectedSchema = z.number()
      const expectedEffect = expectedSchema.transform(arg => transformer.encode(arg))

      const assert: A.Equals<
        typeof output,
        // NOTE: I couldn't find a way to pass an input type to an effect so I have to re-define one here
        z.ZodEffects<typeof expectedSchema, { value: number }, z.input<typeof expectedSchema>>
      > = 1
      assert

      const VALUE_NUM = { value: NUM }

      expect(expectedEffect).toBeInstanceOf(z.ZodEffects)
      expect(expectedEffect.innerType()).toBeInstanceOf(z.ZodNumber)
      expect(output).toBeInstanceOf(z.ZodEffects)
      expect(output.innerType()).toBeInstanceOf(z.ZodNumber)

      expect(expectedEffect.parse(NUM)).toStrictEqual(VALUE_NUM)
      expect(output.parse(NUM)).toStrictEqual(VALUE_NUM)
    })

    test('returns untransformed zod schema if transform is set but transform is false', () => {
      const transformer = {
        encode: (value: number) => ({ value }),
        decode: ({ value }: { value: number }) => value
      }
      const schema = number().transform(transformer)
      const output = schemaZodParser(schema, { transform: false })
      const expected = z.number()

      const assert: A.Equals<typeof output, typeof expected> = 1
      assert

      expect(expected).toBeInstanceOf(z.ZodNumber)
      expect(output).toBeInstanceOf(z.ZodNumber)

      expect(expected.parse(NUM)).toBe(NUM)
      expect(output.parse(NUM)).toBe(NUM)
    })
  })

  describe('enumeration', () => {
    test('returns literal zod schema if enum has one value', () => {
      const schema = number().enum(NUM)
      const output = schemaZodParser(schema)
      const expected = z.literal(NUM)

      const assert: A.Equals<typeof output, typeof expected> = 1
      assert

      expect(expected).toBeInstanceOf(z.ZodLiteral)
      expect(output).toBeInstanceOf(z.ZodLiteral)

      expect(expected.value).toBe(NUM)
      expect(output.value).toBe(NUM)
    })

    test('returns union of literals zod schema if enum has more than one values', () => {
      const schema = number().enum(NUM, NUM_2)
      const output = schemaZodParser(schema)
      const expected = z.union([z.literal(NUM), z.literal(NUM_2)])

      const assert: A.Equals<typeof output, typeof expected> = 1
      assert

      expect(expected).toBeInstanceOf(z.ZodUnion)
      expect(expected.options).toHaveLength(2)
      expect(expected.options[0]).toBeInstanceOf(z.ZodLiteral)
      expect(expected.options[0].value).toBe(NUM)
      expect(expected.options[1]).toBeInstanceOf(z.ZodLiteral)
      expect(expected.options[1].value).toBe(NUM_2)
      expect(output).toBeInstanceOf(z.ZodUnion)
      expect(output.options).toHaveLength(2)
      expect(output.options[0]).toBeInstanceOf(z.ZodLiteral)
      expect(output.options[0].value).toBe(NUM)
      expect(output.options[1]).toBeInstanceOf(z.ZodLiteral)
      expect(output.options[1].value).toBe(NUM_2)
    })
  })
})
