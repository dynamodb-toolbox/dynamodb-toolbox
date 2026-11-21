import type { A } from 'ts-toolbelt'
import { z } from 'zod/v4'

import { anyOf, map, number, string } from '~/schema/index.js'

import { schemaZodParser } from './schema.js'

const STR = 'foo'
const NUM = 42
const TRUE = true

describe('zodSchemer > parser > anyOf', () => {
  test('returns union zod schema', () => {
    const schema = anyOf(string(), number())
    const output = schemaZodParser(schema)
    const expected = z.union([z.string(), z.number()])

    const assert: A.Equals<typeof output, typeof expected> = 1
    assert

    expect(expected).toBeInstanceOf(z.ZodUnion)
    expect(expected.options).toHaveLength(2)
    expect(expected.options[0]).toBeInstanceOf(z.ZodString)
    expect(expected.options[1]).toBeInstanceOf(z.ZodNumber)
    expect(output).toBeInstanceOf(z.ZodUnion)
    expect(output.options).toHaveLength(2)
    expect(output.options[0]).toBeInstanceOf(z.ZodString)
    expect(output.options[1]).toBeInstanceOf(z.ZodNumber)

    expect(expected.parse(STR)).toBe(STR)
    expect(expected.parse(NUM)).toBe(NUM)
    expect(() => expected.parse(TRUE)).toThrow()
    expect(() => expected.parse(undefined)).toThrow()
    expect(output.parse(STR)).toBe(STR)
    expect(output.parse(NUM)).toBe(NUM)
    expect(() => output.parse(TRUE)).toThrow()
    expect(() => output.parse(undefined)).toThrow()
  })

  test('returns discriminated union zod schema if discriminator is present', () => {
    const schema = anyOf(
      map({ type: string().enum('a') }),
      map({ type: string().enum('b', 'c') })
    ).discriminate('type')
    const output = schemaZodParser(schema)
    const expected = z.discriminatedUnion('type', [
      z.object({ type: z.literal('a') }),
      z.object({ type: z.enum(['b', 'c']) })
    ])

    const assert: A.Equals<typeof output, typeof expected> = 1
    assert

    expect(expected).toBeInstanceOf(z.ZodDiscriminatedUnion)
    expect(expected.options).toHaveLength(2)
    expect(expected.options[0]).toBeInstanceOf(z.ZodObject)
    expect(expected.options[0].shape.type).toBeInstanceOf(z.ZodLiteral)
    expect(expected.options[0].shape.type.value).toBe('a')
    expect(expected.options[1]).toBeInstanceOf(z.ZodObject)
    expect(expected.options[1].shape.type).toBeInstanceOf(z.ZodEnum)
    expect(expected.options[1].shape.type.options).toStrictEqual(['b', 'c'])
    expect(output).toBeInstanceOf(z.ZodDiscriminatedUnion)
    expect(output.options).toHaveLength(2)
    expect(output.options[0]).toBeInstanceOf(z.ZodObject)
    expect(output.options[0].shape.type).toBeInstanceOf(z.ZodLiteral)
    expect(output.options[0].shape.type.value).toBe('a')
    expect(output.options[1]).toBeInstanceOf(z.ZodObject)
    expect(output.options[1].shape.type).toBeInstanceOf(z.ZodEnum)
    expect(output.options[1].shape.type.options).toStrictEqual(['b', 'c'])
  })

  test('returns discriminated union zod schema if an element has renamed attributes', () => {
    const schema = anyOf(
      map({ type: string().enum('a'), num: number().savedAs('_n') }),
      map({ type: string().enum('b') })
    ).discriminate('type')
    const output = schemaZodParser(schema)
    const expectedOption = z.object({ type: z.literal('a'), num: z.number() })
    const expected = z.discriminatedUnion('type', [
      expectedOption.transform(({ type, num }): { type: 'a'; _n: number } => ({ type, _n: num })),
      z.object({ type: z.literal('b') })
    ])

    const assert: A.Equals<typeof output, typeof expected> = 1
    assert

    // The renamer is a `.transform`, so the option is a pipe whose input side is still an object
    expect(expected).toBeInstanceOf(z.ZodDiscriminatedUnion)
    expect(expected.options[0]).toBeInstanceOf(z.ZodPipe)
    expect(output).toBeInstanceOf(z.ZodDiscriminatedUnion)
    expect(output.options).toHaveLength(2)
    expect(output.options[0]).toBeInstanceOf(z.ZodPipe)
    expect(output.options[0].in).toBeInstanceOf(z.ZodObject)
    expect(output.options[1]).toBeInstanceOf(z.ZodObject)

    const VALUE = { type: 'a', num: NUM } as const
    const RENAMED_VALUE = { type: 'a', _n: NUM }

    expect(expected.parse(VALUE)).toStrictEqual(RENAMED_VALUE)
    expect(output.parse(VALUE)).toStrictEqual(RENAMED_VALUE)
  })

  describe('optionality', () => {
    test('returns optional zod schema', () => {
      const schema = anyOf(string(), number()).optional()
      const output = schemaZodParser(schema)
      const expected = z.union([z.string(), z.number()]).optional()

      const assert: A.Equals<typeof output, typeof expected> = 1
      assert

      expect(expected).toBeInstanceOf(z.ZodOptional)
      expect(expected.unwrap()).toBeInstanceOf(z.ZodUnion)
      expect(expected.unwrap().options).toHaveLength(2)
      expect(expected.unwrap().options[0]).toBeInstanceOf(z.ZodString)
      expect(expected.unwrap().options[1]).toBeInstanceOf(z.ZodNumber)
      expect(output).toBeInstanceOf(z.ZodOptional)
      expect(output.unwrap()).toBeInstanceOf(z.ZodUnion)
      expect(output.unwrap().options).toHaveLength(2)
      expect(output.unwrap().options[0]).toBeInstanceOf(z.ZodString)
      expect(output.unwrap().options[1]).toBeInstanceOf(z.ZodNumber)

      expect(expected.parse(undefined)).toBe(undefined)
      expect(output.parse(undefined)).toBe(undefined)
    })

    test('returns non-optional zod schema if defined is true', () => {
      const schema = anyOf(string(), number()).optional()
      const output = schemaZodParser(schema, { defined: true })
      const expected = z.union([z.string(), z.number()])

      const assert: A.Equals<typeof output, typeof expected> = 1
      assert

      expect(expected).toBeInstanceOf(z.ZodUnion)
      expect(expected.options).toHaveLength(2)
      expect(expected.options[0]).toBeInstanceOf(z.ZodString)
      expect(expected.options[1]).toBeInstanceOf(z.ZodNumber)
      expect(output).toBeInstanceOf(z.ZodUnion)
      expect(output.options).toHaveLength(2)
      expect(output.options[0]).toBeInstanceOf(z.ZodString)
      expect(output.options[1]).toBeInstanceOf(z.ZodNumber)

      expect(expected.parse(STR)).toBe(STR)
      expect(expected.parse(NUM)).toBe(NUM)
      expect(() => expected.parse(TRUE)).toThrow()
      expect(() => expected.parse(undefined)).toThrow()
      expect(output.parse(STR)).toBe(STR)
      expect(output.parse(NUM)).toBe(NUM)
      expect(() => output.parse(TRUE)).toThrow()
      expect(() => output.parse(undefined)).toThrow()
    })
  })

  describe('defaults', () => {
    test('returns defaulted zod schema', () => {
      const schema = anyOf(string(), number()).default(STR)
      const output = schemaZodParser(schema)
      const expected = z.union([z.string(), z.number()]).default(STR)

      const assert: A.Equals<typeof output, typeof expected> = 1
      assert

      expect(expected).toBeInstanceOf(z.ZodDefault)
      expect(expected.unwrap()).toBeInstanceOf(z.ZodUnion)
      expect(expected.unwrap().options).toHaveLength(2)
      expect(expected.unwrap().options[0]).toBeInstanceOf(z.ZodString)
      expect(expected.unwrap().options[1]).toBeInstanceOf(z.ZodNumber)
      expect(output).toBeInstanceOf(z.ZodDefault)
      expect(output.unwrap()).toBeInstanceOf(z.ZodUnion)
      expect(output.unwrap().options).toHaveLength(2)
      expect(output.unwrap().options[0]).toBeInstanceOf(z.ZodString)
      expect(output.unwrap().options[1]).toBeInstanceOf(z.ZodNumber)

      expect(expected.parse(undefined)).toStrictEqual(STR)
      expect(output.parse(undefined)).toStrictEqual(STR)
    })

    test('returns defaulted zod schema (key)', () => {
      const schema = anyOf(string(), number()).key().default(STR)
      const output = schemaZodParser(schema)
      const expected = z.union([z.string(), z.number()]).default(STR)

      const assert: A.Equals<typeof output, typeof expected> = 1
      assert

      expect(expected).toBeInstanceOf(z.ZodDefault)
      expect(expected.unwrap()).toBeInstanceOf(z.ZodUnion)
      expect(expected.unwrap().options).toHaveLength(2)
      expect(expected.unwrap().options[0]).toBeInstanceOf(z.ZodString)
      expect(expected.unwrap().options[1]).toBeInstanceOf(z.ZodNumber)
      expect(output).toBeInstanceOf(z.ZodDefault)
      expect(output.unwrap()).toBeInstanceOf(z.ZodUnion)
      expect(output.unwrap().options).toHaveLength(2)
      expect(output.unwrap().options[0]).toBeInstanceOf(z.ZodString)
      expect(output.unwrap().options[1]).toBeInstanceOf(z.ZodNumber)

      expect(expected.parse(undefined)).toStrictEqual(STR)
      expect(output.parse(undefined)).toStrictEqual(STR)
    })

    test('returns non-defaulted zod schema if fill is false', () => {
      const schema = anyOf(string(), number()).default(STR)
      const output = schemaZodParser(schema, { fill: false })
      const expected = z.union([z.string(), z.number()])

      const assert: A.Equals<typeof output, typeof expected> = 1
      assert

      expect(expected).toBeInstanceOf(z.ZodUnion)
      expect(expected.options).toHaveLength(2)
      expect(expected.options[0]).toBeInstanceOf(z.ZodString)
      expect(expected.options[1]).toBeInstanceOf(z.ZodNumber)
      expect(output).toBeInstanceOf(z.ZodUnion)
      expect(output.options).toHaveLength(2)
      expect(output.options[0]).toBeInstanceOf(z.ZodString)
      expect(output.options[1]).toBeInstanceOf(z.ZodNumber)

      expect(() => expected.parse(undefined)).toThrow()
      expect(() => output.parse(undefined)).toThrow()
    })
  })

  describe('validation', () => {
    test('returns checked zod schema if validate is set', () => {
      const isTruthy = (input: unknown): boolean => Boolean(input)
      const schema = anyOf(string(), number()).validate(isTruthy)
      const output = schemaZodParser(schema)
      const expected = z.union([z.string(), z.number()]).refine(isTruthy)

      const assert: A.Equals<typeof output, typeof expected> = 1
      assert

      expect(expected).toBeInstanceOf(z.ZodUnion)
      expect(expected.options).toHaveLength(2)
      expect(expected.options[0]).toBeInstanceOf(z.ZodString)
      expect(expected.options[1]).toBeInstanceOf(z.ZodNumber)
      expect(output).toBeInstanceOf(z.ZodUnion)
      expect(output.options).toHaveLength(2)
      expect(output.options[0]).toBeInstanceOf(z.ZodString)
      expect(output.options[1]).toBeInstanceOf(z.ZodNumber)

      expect(() => expected.parse('')).toThrow()
      expect(() => output.parse('')).toThrow()
      expect(() => expected.parse(0)).toThrow()
      expect(() => output.parse(0)).toThrow()
    })
  })

  test('applies meta.description', () => {
    const schema = anyOf(string(), number()).meta({ description: 'Desc' })
    const output = schemaZodParser(schema)

    expect(output.description).toBe('Desc')
  })
})
