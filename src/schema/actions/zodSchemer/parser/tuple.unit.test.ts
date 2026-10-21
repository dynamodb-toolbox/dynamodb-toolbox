import type { A } from 'ts-toolbelt'
import { z } from 'zod'

import { number, string, tuple } from '~/schema/index.js'

import { schemaZodParser } from './schema.js'

const STR = 'foo'
const NUM = 42
const VALUE: [typeof STR, typeof NUM] = [STR, NUM]

const nonStrictZodTuple = <ELEMENTS extends [z.ZodTypeAny, ...z.ZodTypeAny[]]>(
  ...elements: ELEMENTS
) =>
  z
    .tuple(elements)
    .rest(z.unknown())
    .transform(values => values.slice(0, elements.length) as z.output<z.ZodTuple<ELEMENTS>>)

describe('zodSchemer > parser > tuple', () => {
  test('returns tuple zod schema', () => {
    const schema = tuple(string(), number())
    const output = schemaZodParser(schema)
    const expected = nonStrictZodTuple(z.string(), z.number())

    const assert: A.Equals<typeof output, typeof expected> = 1
    assert

    expect(expected).toBeInstanceOf(z.ZodEffects)
    expect(expected.innerType()).toBeInstanceOf(z.ZodTuple)
    expect(expected.innerType().items[0]).toBeInstanceOf(z.ZodString)
    expect(expected.innerType().items[1]).toBeInstanceOf(z.ZodNumber)
    expect(output).toBeInstanceOf(z.ZodEffects)
    expect(output.innerType()).toBeInstanceOf(z.ZodTuple)
    expect(output.innerType().items[0]).toBeInstanceOf(z.ZodString)
    expect(output.innerType().items[1]).toBeInstanceOf(z.ZodNumber)

    expect(expected.parse(VALUE)).toStrictEqual(VALUE)
    expect(output.parse(VALUE)).toStrictEqual(VALUE)

    expect(() => expected.parse(undefined)).toThrow()
    expect(() => output.parse(undefined)).toThrow()
  })

  describe('strictness', () => {
    test('emits a Zod tuple dropping additional elements for a non-strict tuple', () => {
      const schema = tuple(string(), number())
      const output = schemaZodParser(schema)
      const expected = z
        .tuple([z.string(), z.number()])
        .rest(z.unknown())
        .transform(values => values.slice(0, 2) as [string, number])

      const assert: A.Equals<typeof output, typeof expected> = 1
      assert

      expect(output.innerType()._def.rest).toBeInstanceOf(z.ZodUnknown)
      expect(output.parse([STR, NUM, 'extra'])).toStrictEqual(VALUE)
    })

    test('emits a strict Zod tuple for a strict tuple', () => {
      const schema = tuple(string(), number()).strict()
      const output = schemaZodParser(schema)
      const expected = z.tuple([z.string(), z.number()])

      const assert: A.Equals<typeof output, typeof expected> = 1
      assert

      expect(output).toBeInstanceOf(z.ZodTuple)
      expect(output._def.rest).toBe(null)
      expect(() => output.parse([STR, NUM, 'extra'])).toThrow()
    })
  })

  describe('optionality', () => {
    test('returns optional zod schema', () => {
      const schema = tuple(string(), number()).optional()
      const output = schemaZodParser(schema)
      const expected = nonStrictZodTuple(z.string(), z.number()).optional()

      const assert: A.Equals<typeof output, typeof expected> = 1
      assert

      expect(expected).toBeInstanceOf(z.ZodOptional)
      expect(expected.unwrap().innerType()).toBeInstanceOf(z.ZodTuple)
      expect(expected.unwrap().innerType().items[0]).toBeInstanceOf(z.ZodString)
      expect(expected.unwrap().innerType().items[1]).toBeInstanceOf(z.ZodNumber)
      expect(output).toBeInstanceOf(z.ZodOptional)
      expect(output.unwrap().innerType()).toBeInstanceOf(z.ZodTuple)
      expect(output.unwrap().innerType().items[0]).toBeInstanceOf(z.ZodString)
      expect(output.unwrap().innerType().items[1]).toBeInstanceOf(z.ZodNumber)

      expect(expected.parse(undefined)).toStrictEqual(undefined)
      expect(output.parse(undefined)).toStrictEqual(undefined)
    })

    test('returns non-optional zod schema if defined is true', () => {
      const schema = tuple(string(), number()).optional()
      const output = schemaZodParser(schema, { defined: true })
      const expected = nonStrictZodTuple(z.string(), z.number())

      const assert: A.Equals<typeof output, typeof expected> = 1
      assert

      expect(expected.innerType()).toBeInstanceOf(z.ZodTuple)
      expect(expected.innerType().items[0]).toBeInstanceOf(z.ZodString)
      expect(expected.innerType().items[1]).toBeInstanceOf(z.ZodNumber)
      expect(output.innerType()).toBeInstanceOf(z.ZodTuple)
      expect(output.innerType().items[0]).toBeInstanceOf(z.ZodString)
      expect(output.innerType().items[1]).toBeInstanceOf(z.ZodNumber)

      expect(() => expected.parse(undefined)).toThrow()
      expect(() => output.parse(undefined)).toThrow()
    })
  })

  describe('defaults', () => {
    test('returns defaulted zod schema', () => {
      const schema = tuple(string(), number()).default(VALUE)
      const output = schemaZodParser(schema)
      const expected = nonStrictZodTuple(z.string(), z.number()).default(VALUE)

      const assert: A.Equals<typeof output, typeof expected> = 1
      assert

      expect(expected).toBeInstanceOf(z.ZodDefault)
      expect(expected.removeDefault().innerType()).toBeInstanceOf(z.ZodTuple)
      expect(expected.removeDefault().innerType().items[0]).toBeInstanceOf(z.ZodString)
      expect(expected.removeDefault().innerType().items[1]).toBeInstanceOf(z.ZodNumber)
      expect(output).toBeInstanceOf(z.ZodDefault)
      expect(output.removeDefault().innerType()).toBeInstanceOf(z.ZodTuple)
      expect(output.removeDefault().innerType().items[0]).toBeInstanceOf(z.ZodString)
      expect(output.removeDefault().innerType().items[1]).toBeInstanceOf(z.ZodNumber)

      expect(expected.parse(undefined)).toStrictEqual(VALUE)
      expect(output.parse(undefined)).toStrictEqual(VALUE)
    })

    test('returns defaulted zod schema (key)', () => {
      const schema = tuple(string(), number()).key().default(VALUE)
      const output = schemaZodParser(schema)
      const expected = nonStrictZodTuple(z.string(), z.number()).default(VALUE)

      const assert: A.Equals<typeof output, typeof expected> = 1
      assert

      expect(expected).toBeInstanceOf(z.ZodDefault)
      expect(expected.removeDefault().innerType()).toBeInstanceOf(z.ZodTuple)
      expect(output).toBeInstanceOf(z.ZodDefault)
      expect(output.removeDefault().innerType()).toBeInstanceOf(z.ZodTuple)

      expect(expected.parse(undefined)).toStrictEqual(VALUE)
      expect(output.parse(undefined)).toStrictEqual(VALUE)
    })

    test('returns non-defaulted zod schema if fill is false', () => {
      const schema = tuple(string(), number()).key().default(VALUE)
      const output = schemaZodParser(schema, { fill: false })
      const expected = nonStrictZodTuple(z.string(), z.number())

      const assert: A.Equals<typeof output, typeof expected> = 1
      assert

      expect(expected.innerType()).toBeInstanceOf(z.ZodTuple)
      expect(output.innerType()).toBeInstanceOf(z.ZodTuple)

      expect(() => expected.parse(undefined)).toThrow()
      expect(() => output.parse(undefined)).toThrow()
    })
  })

  describe('validation', () => {
    test('returns zod effect if validate is set', () => {
      const isNonEmpty = ([input]: [string]): boolean => input.length > 0
      const schema = tuple(string()).validate(isNonEmpty)
      const output = schemaZodParser(schema)
      const expected = nonStrictZodTuple(z.string()).refine(isNonEmpty)

      const assert: A.Equals<typeof output, typeof expected> = 1
      assert

      expect(expected).toBeInstanceOf(z.ZodEffects)
      expect(expected.innerType().innerType()).toBeInstanceOf(z.ZodTuple)
      expect(expected.innerType().innerType().items[0]).toBeInstanceOf(z.ZodString)
      expect(output).toBeInstanceOf(z.ZodEffects)
      expect(output.innerType().innerType()).toBeInstanceOf(z.ZodTuple)
      expect(output.innerType().innerType().items[0]).toBeInstanceOf(z.ZodString)

      expect(() => expected.parse([''])).toThrow()
      expect(() => output.parse([''])).toThrow()
    })
  })

  test('applies meta.description', () => {
    const schema = tuple(string()).meta({ description: 'Desc' })
    const output = schemaZodParser(schema)

    expect(output.description).toBe('Desc')
  })
})
