import type { A } from 'ts-toolbelt'
import { z } from 'zod'

import { number } from '~/schema/index.js'

import { schemaZodFormatter } from './schema.js'

const NUM = 42
const NUM_2 = 43
const BIG_NUM = BigInt('42')

describe('zodSchemer > formatter > number', () => {
  test('returns number zod schema', () => {
    const schema = number()
    const output = schemaZodFormatter(schema)
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
    const output = schemaZodFormatter(schema)
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
      const output = schemaZodFormatter(schema)
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
      const output = schemaZodFormatter(schema, { defined: true })
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
      const output = schemaZodFormatter(schema)
      const expectedSchema = z.number()
      const expectedEffect = z.preprocess(arg => transformer.decode(arg as any), expectedSchema)

      const assert: A.Equals<
        typeof output,
        // NOTE: I couldn't find a way to pass an input type to an effect so I have to re-define one here
        z.ZodEffects<typeof expectedSchema, z.output<typeof expectedSchema>, { value: number }>
      > = 1
      assert

      const VALUE_NUM = { value: NUM }

      expect(expectedEffect).toBeInstanceOf(z.ZodEffects)
      expect(expectedEffect.innerType()).toBeInstanceOf(z.ZodNumber)
      expect(output).toBeInstanceOf(z.ZodEffects)
      expect(output.innerType()).toBeInstanceOf(z.ZodNumber)

      expect(expectedEffect.parse(VALUE_NUM)).toBe(NUM)
      expect(output.parse(VALUE_NUM)).toBe(NUM)
    })

    test('returns untransformed zod schema if transform is set but transform is false', () => {
      const transformer = {
        encode: (value: number) => ({ value }),
        decode: ({ value }: { value: number }) => value
      }
      const schema = number().transform(transformer)
      const output = schemaZodFormatter(schema, { transform: false })
      const expected = z.number()

      const assert: A.Equals<typeof output, typeof expected> = 1
      assert

      expect(expected).toBeInstanceOf(z.ZodNumber)
      expect(output).toBeInstanceOf(z.ZodNumber)

      expect(expected.parse(NUM)).toBe(NUM)
      expect(output.parse(NUM)).toBe(NUM)
    })
  })

  describe('partiality', () => {
    test('returns optional zod schema if partial is true', () => {
      const schema = number()
      const output = schemaZodFormatter(schema, { partial: true })
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

    test('returns non-optional zod schema if partial and defined are true', () => {
      const schema = number()
      const output = schemaZodFormatter(schema, { partial: true, defined: true })
      const expected = z.number()

      const assert: A.Equals<typeof output, typeof expected> = 1
      assert

      expect(expected).toBeInstanceOf(z.ZodNumber)
      expect(output).toBeInstanceOf(z.ZodNumber)

      expect(() => expected.parse(undefined)).toThrow()
      expect(() => output.parse(undefined)).toThrow()
    })
  })

  describe('enumeration', () => {
    test('returns literal zod schema if enum has one value', () => {
      const schema = number().const(NUM)
      const output = schemaZodFormatter(schema)
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
      const output = schemaZodFormatter(schema)
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
