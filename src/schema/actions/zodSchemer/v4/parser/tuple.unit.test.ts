import type { A } from 'ts-toolbelt'
import { z } from 'zod/v4'

import { number, string, tuple } from '~/schema/index.js'

import { schemaZodParser } from './schema.js'

const STR = 'foo'
const NUM = 42
const VALUE: [typeof STR, typeof NUM] = [STR, NUM]

const nonStrictZodTuple = <ELEMENTS extends [z.ZodType, ...z.ZodType[]]>(...elements: ELEMENTS) =>
  z
    .tuple(elements)
    .rest(z.unknown())
    .transform(values => values.slice(0, elements.length) as z.output<z.ZodTuple<ELEMENTS, null>>)

describe('zodSchemer > parser > tuple', () => {
  test('returns tuple zod schema', () => {
    const schema = tuple(string(), number())
    const output = schemaZodParser(schema)
    const expected = nonStrictZodTuple(z.string(), z.number())

    const assert: A.Equals<typeof output, typeof expected> = 1
    assert

    expect(expected).toBeInstanceOf(z.ZodPipe)
    expect(expected.in).toBeInstanceOf(z.ZodTuple)
    expect(expected.in.def.items[0]).toBeInstanceOf(z.ZodString)
    expect(expected.in.def.items[1]).toBeInstanceOf(z.ZodNumber)
    expect(output).toBeInstanceOf(z.ZodPipe)
    expect(output.in).toBeInstanceOf(z.ZodTuple)
    expect(output.in.def.items[0]).toBeInstanceOf(z.ZodString)
    expect(output.in.def.items[1]).toBeInstanceOf(z.ZodNumber)

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

      expect(output.in.def.rest).toBeInstanceOf(z.ZodUnknown)
      expect(output.parse([STR, NUM, 'extra'])).toStrictEqual(VALUE)
    })

    test('emits a strict Zod tuple for a strict tuple', () => {
      const schema = tuple(string(), number()).strict()
      const output = schemaZodParser(schema)
      const expected = z.tuple([z.string(), z.number()])

      const assert: A.Equals<typeof output, typeof expected> = 1
      assert

      expect(output).toBeInstanceOf(z.ZodTuple)
      expect(output.def.rest).toBe(null)
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
      expect(expected.unwrap().in).toBeInstanceOf(z.ZodTuple)
      expect(expected.unwrap().in.def.items[0]).toBeInstanceOf(z.ZodString)
      expect(expected.unwrap().in.def.items[1]).toBeInstanceOf(z.ZodNumber)
      expect(output).toBeInstanceOf(z.ZodOptional)
      expect(output.unwrap().in).toBeInstanceOf(z.ZodTuple)
      expect(output.unwrap().in.def.items[0]).toBeInstanceOf(z.ZodString)
      expect(output.unwrap().in.def.items[1]).toBeInstanceOf(z.ZodNumber)

      expect(expected.parse(undefined)).toStrictEqual(undefined)
      expect(output.parse(undefined)).toStrictEqual(undefined)
    })

    test('returns non-optional zod schema if defined is true', () => {
      const schema = tuple(string(), number()).optional()
      const output = schemaZodParser(schema, { defined: true })
      const expected = nonStrictZodTuple(z.string(), z.number())

      const assert: A.Equals<typeof output, typeof expected> = 1
      assert

      expect(expected.in).toBeInstanceOf(z.ZodTuple)
      expect(expected.in.def.items[0]).toBeInstanceOf(z.ZodString)
      expect(expected.in.def.items[1]).toBeInstanceOf(z.ZodNumber)
      expect(output.in).toBeInstanceOf(z.ZodTuple)
      expect(output.in.def.items[0]).toBeInstanceOf(z.ZodString)
      expect(output.in.def.items[1]).toBeInstanceOf(z.ZodNumber)

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
      expect(expected.unwrap().in).toBeInstanceOf(z.ZodTuple)
      expect(expected.unwrap().in.def.items[0]).toBeInstanceOf(z.ZodString)
      expect(expected.unwrap().in.def.items[1]).toBeInstanceOf(z.ZodNumber)
      expect(output).toBeInstanceOf(z.ZodDefault)
      expect(output.unwrap().in).toBeInstanceOf(z.ZodTuple)
      expect(output.unwrap().in.def.items[0]).toBeInstanceOf(z.ZodString)
      expect(output.unwrap().in.def.items[1]).toBeInstanceOf(z.ZodNumber)

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
      expect(expected.unwrap().in).toBeInstanceOf(z.ZodTuple)
      expect(output).toBeInstanceOf(z.ZodDefault)
      expect(output.unwrap().in).toBeInstanceOf(z.ZodTuple)

      expect(expected.parse(undefined)).toStrictEqual(VALUE)
      expect(output.parse(undefined)).toStrictEqual(VALUE)
    })

    test('returns non-defaulted zod schema if fill is false', () => {
      const schema = tuple(string(), number()).key().default(VALUE)
      const output = schemaZodParser(schema, { fill: false })
      const expected = nonStrictZodTuple(z.string(), z.number())

      const assert: A.Equals<typeof output, typeof expected> = 1
      assert

      expect(expected.in).toBeInstanceOf(z.ZodTuple)
      expect(output.in).toBeInstanceOf(z.ZodTuple)

      expect(() => expected.parse(undefined)).toThrow()
      expect(() => output.parse(undefined)).toThrow()
    })
  })

  describe('validation', () => {
    test('returns checked zod schema if validate is set', () => {
      const isNonEmpty = ([input]: [string]): boolean => input.length > 0
      const schema = tuple(string()).validate(isNonEmpty)
      const output = schemaZodParser(schema)
      const expected = nonStrictZodTuple(z.string()).refine(isNonEmpty)

      const assert: A.Equals<typeof output, typeof expected> = 1
      assert

      expect(expected).toBeInstanceOf(z.ZodPipe)
      expect(expected.in).toBeInstanceOf(z.ZodTuple)
      expect(expected.in.def.items[0]).toBeInstanceOf(z.ZodString)
      expect(output).toBeInstanceOf(z.ZodPipe)
      expect(output.in).toBeInstanceOf(z.ZodTuple)
      expect(output.in.def.items[0]).toBeInstanceOf(z.ZodString)

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
