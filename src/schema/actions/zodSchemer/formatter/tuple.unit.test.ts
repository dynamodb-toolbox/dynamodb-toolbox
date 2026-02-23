import type { A } from 'ts-toolbelt'
import { z } from 'zod'

import { map, number, string, tuple } from '~/schema/index.js'

import { schemaZodFormatter } from './schema.js'

const STR = 'foo'
const NUM = 42

describe('zodSchemer > formatter > tuple', () => {
  test('returns tuple zod schema', () => {
    const schema = tuple(string(), number())
    const output = schemaZodFormatter(schema)
    const expected = z.tuple([z.string(), z.number()])

    const assert: A.Equals<typeof output, typeof expected> = 1
    assert

    expect(expected).toBeInstanceOf(z.ZodTuple)
    expect(expected.items).toHaveLength(2)
    expect(expected.items[0]).toBeInstanceOf(z.ZodString)
    expect(expected.items[1]).toBeInstanceOf(z.ZodNumber)
    expect(output).toBeInstanceOf(z.ZodTuple)
    expect(output.items).toHaveLength(2)
    expect(output.items[0]).toBeInstanceOf(z.ZodString)
    expect(output.items[1]).toBeInstanceOf(z.ZodNumber)

    expect(expected.parse([STR, NUM])).toStrictEqual([STR, NUM])
    expect(() => expected.parse(STR)).toThrow()
    expect(() => expected.parse(undefined)).toThrow()
    expect(output.parse([STR, NUM])).toStrictEqual([STR, NUM])
    expect(() => output.parse(STR)).toThrow()
    expect(() => output.parse(undefined)).toThrow()
  })

  describe('optionality', () => {
    test('returns optional zod schema', () => {
      const schema = tuple(string(), number()).optional()
      const output = schemaZodFormatter(schema)
      const expected = z.tuple([z.string(), z.number()]).optional()

      const assert: A.Equals<typeof output, typeof expected> = 1
      assert

      expect(expected).toBeInstanceOf(z.ZodOptional)
      expect(expected.unwrap()).toBeInstanceOf(z.ZodTuple)
      expect(expected.unwrap().items).toHaveLength(2)
      expect(expected.unwrap().items[0]).toBeInstanceOf(z.ZodString)
      expect(expected.unwrap().items[1]).toBeInstanceOf(z.ZodNumber)
      expect(output).toBeInstanceOf(z.ZodOptional)
      expect(output.unwrap()).toBeInstanceOf(z.ZodTuple)
      expect(output.unwrap().items).toHaveLength(2)
      expect(output.unwrap().items[0]).toBeInstanceOf(z.ZodString)
      expect(output.unwrap().items[1]).toBeInstanceOf(z.ZodNumber)

      expect(expected.parse(undefined)).toBe(undefined)
      expect(output.parse(undefined)).toBe(undefined)
    })

    test('returns non-optional zod schema if defined is true', () => {
      const schema = tuple(string(), number()).optional()
      const output = schemaZodFormatter(schema, { defined: true })
      const expected = z.tuple([z.string(), z.number()])

      const assert: A.Equals<typeof output, typeof expected> = 1
      assert

      expect(expected).toBeInstanceOf(z.ZodTuple)
      expect(expected.items).toHaveLength(2)
      expect(expected.items[0]).toBeInstanceOf(z.ZodString)
      expect(expected.items[1]).toBeInstanceOf(z.ZodNumber)
      expect(output).toBeInstanceOf(z.ZodTuple)
      expect(output.items).toHaveLength(2)
      expect(output.items[0]).toBeInstanceOf(z.ZodString)
      expect(output.items[1]).toBeInstanceOf(z.ZodNumber)

      expect(expected.parse([STR, NUM])).toStrictEqual([STR, NUM])
      expect(() => expected.parse(STR)).toThrow()
      expect(() => expected.parse(undefined)).toThrow()
      expect(output.parse([STR, NUM])).toStrictEqual([STR, NUM])
      expect(() => output.parse(STR)).toThrow()
      expect(() => output.parse(undefined)).toThrow()
    })
  })

  describe('validation', () => {
    test('returns zod effect if validate is set', () => {
      const isNonEmpty = ([input]: [string]): boolean => input.length > 0
      const schema = tuple(string()).validate(isNonEmpty)
      const output = schemaZodFormatter(schema)
      const expected = z.tuple([z.string()]).refine(isNonEmpty)

      const assert: A.Equals<typeof output, typeof expected> = 1
      assert

      expect(expected).toBeInstanceOf(z.ZodEffects)
      expect(expected.innerType()).toBeInstanceOf(z.ZodTuple)
      expect(expected.innerType().items).toHaveLength(1)
      expect(expected.innerType().items[0]).toBeInstanceOf(z.ZodString)
      expect(output).toBeInstanceOf(z.ZodEffects)
      expect(output.innerType()).toBeInstanceOf(z.ZodTuple)
      expect(output.innerType().items).toHaveLength(1)
      expect(output.innerType().items[0]).toBeInstanceOf(z.ZodString)

      expect(() => expected.parse([''])).toThrow()
      expect(() => output.parse([''])).toThrow()
    })
  })

  describe('partiality', () => {
    test('returns optional & partial zod schema if partial is true', () => {
      const schema = tuple(map({ str: string() }))
      const output = schemaZodFormatter(schema, { partial: true })
      const expected = z.tuple([z.object({ str: z.string() }).partial().optional()]).optional()

      const assert: A.Equals<typeof output, typeof expected> = 1
      assert

      expect(expected).toBeInstanceOf(z.ZodOptional)
      expect(expected.unwrap()).toBeInstanceOf(z.ZodTuple)
      expect(expected.unwrap().items).toHaveLength(1)
      expect(expected.unwrap().items[0]).toBeInstanceOf(z.ZodOptional)
      expect(expected.unwrap().items[0].unwrap()).toBeInstanceOf(z.ZodObject)
      expect(expected.unwrap().items[0].unwrap().shape.str).toBeInstanceOf(z.ZodOptional)
      expect(expected.unwrap().items[0].unwrap().shape.str.unwrap()).toBeInstanceOf(z.ZodString)
      expect(output).toBeInstanceOf(z.ZodOptional)
      expect(output.unwrap()).toBeInstanceOf(z.ZodTuple)
      expect(output.unwrap().items).toHaveLength(1)
      expect(output.unwrap().items[0]).toBeInstanceOf(z.ZodOptional)
      expect(output.unwrap().items[0].unwrap()).toBeInstanceOf(z.ZodObject)
      expect(output.unwrap().items[0].unwrap().shape.str).toBeInstanceOf(z.ZodOptional)
      expect(output.unwrap().items[0].unwrap().shape.str.unwrap()).toBeInstanceOf(z.ZodString)

      expect(expected.parse([{}])).toStrictEqual([{}])
      expect(output.parse([{}])).toStrictEqual([{}])

      expect(expected.parse(undefined)).toStrictEqual(undefined)
      expect(output.parse(undefined)).toStrictEqual(undefined)
    })

    test('returns non-optional & partial zod schema if partial and defined are true', () => {
      const schema = tuple(map({ str: string() }))
      const output = schemaZodFormatter(schema, { partial: true, defined: true })
      const expected = z.tuple([z.object({ str: z.string() }).partial().optional()])
      const assert: A.Equals<typeof output, typeof expected> = 1
      assert

      expect(expected).toBeInstanceOf(z.ZodTuple)
      expect(expected.items).toHaveLength(1)
      expect(expected.items[0]).toBeInstanceOf(z.ZodOptional)
      expect(expected.items[0].unwrap()).toBeInstanceOf(z.ZodObject)
      expect(expected.items[0].unwrap().shape.str).toBeInstanceOf(z.ZodOptional)
      expect(expected.items[0].unwrap().shape.str.unwrap()).toBeInstanceOf(z.ZodString)
      expect(output).toBeInstanceOf(z.ZodTuple)
      expect(output.items).toHaveLength(1)
      expect(output.items[0]).toBeInstanceOf(z.ZodOptional)
      expect(output.items[0].unwrap()).toBeInstanceOf(z.ZodObject)
      expect(output.items[0].unwrap().shape.str).toBeInstanceOf(z.ZodOptional)
      expect(output.items[0].unwrap().shape.str.unwrap()).toBeInstanceOf(z.ZodString)

      expect(expected.parse([{}])).toStrictEqual([{}])
      expect(output.parse([{}])).toStrictEqual([{}])

      expect(() => expected.parse(undefined)).toThrow()
      expect(() => output.parse(undefined)).toThrow()
    })
  })
})
