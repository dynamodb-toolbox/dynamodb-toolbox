import type { A } from 'ts-toolbelt'
import { z } from 'zod'

import { number, string, tuple } from '~/schema/index.js'

import { schemaZodParser } from './schema.js'

const STR = 'foo'
const NUM = 42
const VALUE: [typeof STR, typeof NUM] = [STR, NUM]

describe('zodSchemer > parser > tuple', () => {
  test('returns tuple zod schema', () => {
    const schema = tuple(string(), number())
    const output = schemaZodParser(schema)
    const expected = z.tuple([z.string(), z.number()])

    const assert: A.Equals<typeof output, typeof expected> = 1
    assert

    expect(expected).toBeInstanceOf(z.ZodTuple)
    expect(expected.items[0]).toBeInstanceOf(z.ZodString)
    expect(expected.items[1]).toBeInstanceOf(z.ZodNumber)
    expect(output).toBeInstanceOf(z.ZodTuple)
    expect(output.items[0]).toBeInstanceOf(z.ZodString)
    expect(output.items[1]).toBeInstanceOf(z.ZodNumber)

    expect(expected.parse(VALUE)).toStrictEqual(VALUE)
    expect(output.parse(VALUE)).toStrictEqual(VALUE)

    expect(() => expected.parse(undefined)).toThrow()
    expect(() => output.parse(undefined)).toThrow()
  })

  describe('optionality', () => {
    test('returns optional zod schema', () => {
      const schema = tuple(string(), number()).optional()
      const output = schemaZodParser(schema)
      const expected = z.tuple([z.string(), z.number()]).optional()

      const assert: A.Equals<typeof output, typeof expected> = 1
      assert

      expect(expected).toBeInstanceOf(z.ZodOptional)
      expect(expected.unwrap()).toBeInstanceOf(z.ZodTuple)
      expect(expected.unwrap().items[0]).toBeInstanceOf(z.ZodString)
      expect(expected.unwrap().items[1]).toBeInstanceOf(z.ZodNumber)
      expect(output).toBeInstanceOf(z.ZodOptional)
      expect(output.unwrap()).toBeInstanceOf(z.ZodTuple)
      expect(output.unwrap().items[0]).toBeInstanceOf(z.ZodString)
      expect(output.unwrap().items[1]).toBeInstanceOf(z.ZodNumber)

      expect(expected.parse(undefined)).toStrictEqual(undefined)
      expect(output.parse(undefined)).toStrictEqual(undefined)
    })

    test('returns non-optional zod schema if defined is true', () => {
      const schema = tuple(string(), number()).optional()
      const output = schemaZodParser(schema, { defined: true })
      const expected = z.tuple([z.string(), z.number()])

      const assert: A.Equals<typeof output, typeof expected> = 1
      assert

      expect(expected).toBeInstanceOf(z.ZodTuple)
      expect(expected.items[0]).toBeInstanceOf(z.ZodString)
      expect(expected.items[1]).toBeInstanceOf(z.ZodNumber)
      expect(output).toBeInstanceOf(z.ZodTuple)
      expect(output.items[0]).toBeInstanceOf(z.ZodString)
      expect(output.items[1]).toBeInstanceOf(z.ZodNumber)

      expect(() => expected.parse(undefined)).toThrow()
      expect(() => output.parse(undefined)).toThrow()
    })
  })

  describe('defaults', () => {
    test('returns defaulted zod schema', () => {
      const schema = tuple(string(), number()).default(VALUE)
      const output = schemaZodParser(schema)
      const expected = z.tuple([z.string(), z.number()]).default(VALUE)

      const assert: A.Equals<typeof output, typeof expected> = 1
      assert

      expect(expected).toBeInstanceOf(z.ZodDefault)
      expect(expected.removeDefault()).toBeInstanceOf(z.ZodTuple)
      expect(expected.removeDefault().items[0]).toBeInstanceOf(z.ZodString)
      expect(expected.removeDefault().items[1]).toBeInstanceOf(z.ZodNumber)
      expect(output).toBeInstanceOf(z.ZodDefault)
      expect(output.removeDefault()).toBeInstanceOf(z.ZodTuple)
      expect(output.removeDefault().items[0]).toBeInstanceOf(z.ZodString)
      expect(output.removeDefault().items[1]).toBeInstanceOf(z.ZodNumber)

      expect(expected.parse(undefined)).toStrictEqual(VALUE)
      expect(output.parse(undefined)).toStrictEqual(VALUE)
    })

    test('returns defaulted zod schema (key)', () => {
      const schema = tuple(string(), number()).key().default(VALUE)
      const output = schemaZodParser(schema)
      const expected = z.tuple([z.string(), z.number()]).default(VALUE)

      const assert: A.Equals<typeof output, typeof expected> = 1
      assert

      expect(expected).toBeInstanceOf(z.ZodDefault)
      expect(expected.removeDefault()).toBeInstanceOf(z.ZodTuple)
      expect(expected.removeDefault().items[0]).toBeInstanceOf(z.ZodString)
      expect(expected.removeDefault().items[1]).toBeInstanceOf(z.ZodNumber)
      expect(output).toBeInstanceOf(z.ZodDefault)
      expect(output.removeDefault()).toBeInstanceOf(z.ZodTuple)
      expect(output.removeDefault().items[0]).toBeInstanceOf(z.ZodString)
      expect(output.removeDefault().items[1]).toBeInstanceOf(z.ZodNumber)

      expect(expected.parse(undefined)).toStrictEqual(VALUE)
      expect(output.parse(undefined)).toStrictEqual(VALUE)
    })

    test('returns non-defaulted zod schema if fill is false', () => {
      const schema = tuple(string(), number()).key().default(VALUE)
      const output = schemaZodParser(schema, { fill: false })
      const expected = z.tuple([z.string(), z.number()])

      const assert: A.Equals<typeof output, typeof expected> = 1
      assert

      expect(expected).toBeInstanceOf(z.ZodTuple)
      expect(expected.items[0]).toBeInstanceOf(z.ZodString)
      expect(expected.items[1]).toBeInstanceOf(z.ZodNumber)
      expect(output).toBeInstanceOf(z.ZodTuple)
      expect(output.items[0]).toBeInstanceOf(z.ZodString)
      expect(output.items[1]).toBeInstanceOf(z.ZodNumber)

      expect(() => expected.parse(undefined)).toThrow()
      expect(() => output.parse(undefined)).toThrow()
    })
  })

  describe('validation', () => {
    test('returns zod effect if validate is set', () => {
      const isNonEmpty = ([input]: [string]): boolean => input.length > 0
      const schema = tuple(string()).validate(isNonEmpty)
      const output = schemaZodParser(schema)
      const expected = z.tuple([z.string()]).refine(isNonEmpty)

      const assert: A.Equals<typeof output, typeof expected> = 1
      assert

      expect(expected).toBeInstanceOf(z.ZodEffects)
      expect(expected.innerType()).toBeInstanceOf(z.ZodTuple)
      expect(expected.innerType().items[0]).toBeInstanceOf(z.ZodString)
      expect(output).toBeInstanceOf(z.ZodEffects)
      expect(output.innerType()).toBeInstanceOf(z.ZodTuple)
      expect(output.innerType().items[0]).toBeInstanceOf(z.ZodString)

      expect(() => expected.parse([''])).toThrow()
      expect(() => output.parse([''])).toThrow()
    })
  })
})
