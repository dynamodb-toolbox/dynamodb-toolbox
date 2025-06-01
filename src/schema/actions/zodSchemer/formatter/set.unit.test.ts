import type { A } from 'ts-toolbelt'
import { z } from 'zod'

import { set, string } from '~/schema/index.js'

import { schemaZodFormatter } from './schema.js'

const SET = new Set(['foo', 'bar'])

describe('zodSchemer > formatter > set', () => {
  test('returns set zod schema', () => {
    const schema = set(string())
    const output = schemaZodFormatter(schema)
    const expected = z.set(z.string())

    const assert: A.Equals<typeof output, typeof expected> = 1
    assert

    expect(expected).toBeInstanceOf(z.ZodSet)
    expect(expected._def.valueType).toBeInstanceOf(z.ZodString)
    expect(output).toBeInstanceOf(z.ZodSet)
    expect(output._def.valueType).toBeInstanceOf(z.ZodString)

    expect(expected.parse(SET)).toStrictEqual(SET)
    expect(output.parse(SET)).toStrictEqual(SET)

    expect(() => expected.parse(undefined)).toThrow()
    expect(() => output.parse(undefined)).toThrow()
  })

  describe('optionality', () => {
    test('returns optional zod schema', () => {
      const schema = set(string()).optional()
      const output = schemaZodFormatter(schema)
      const expected = z.set(z.string()).optional()

      const assert: A.Equals<typeof output, typeof expected> = 1
      assert

      expect(expected).toBeInstanceOf(z.ZodOptional)
      expect(expected.unwrap()).toBeInstanceOf(z.ZodSet)
      expect(expected.unwrap()._def.valueType).toBeInstanceOf(z.ZodString)
      expect(output).toBeInstanceOf(z.ZodOptional)
      expect(output.unwrap()).toBeInstanceOf(z.ZodSet)
      expect(output.unwrap()._def.valueType).toBeInstanceOf(z.ZodString)

      expect(expected.parse(undefined)).toStrictEqual(undefined)
      expect(output.parse(undefined)).toStrictEqual(undefined)
    })

    test('returns non-optional zod schema if defined is true', () => {
      const schema = set(string()).optional()
      const output = schemaZodFormatter(schema, { defined: true })
      const expected = z.set(z.string())
      const assert: A.Equals<typeof output, typeof expected> = 1
      assert

      expect(expected).toBeInstanceOf(z.ZodSet)
      expect(expected._def.valueType).toBeInstanceOf(z.ZodString)
      expect(output).toBeInstanceOf(z.ZodSet)
      expect(output._def.valueType).toBeInstanceOf(z.ZodString)

      expect(() => expected.parse(undefined)).toThrow()
      expect(() => output.parse(undefined)).toThrow()
    })
  })

  describe('validation', () => {
    test('returns zod effect if validate is set', () => {
      const isNonEmpty = (input: Set<unknown>): boolean => input.size > 0
      const schema = set(string()).validate(isNonEmpty)
      const output = schemaZodFormatter(schema)
      const expected = z.set(z.string()).refine(isNonEmpty)

      const assert: A.Equals<typeof output, typeof expected> = 1
      assert

      expect(expected).toBeInstanceOf(z.ZodEffects)
      expect(expected.innerType()).toBeInstanceOf(z.ZodSet)
      expect(expected.innerType()._def.valueType).toBeInstanceOf(z.ZodString)
      expect(output).toBeInstanceOf(z.ZodEffects)
      expect(output.innerType()).toBeInstanceOf(z.ZodSet)
      expect(output.innerType()._def.valueType).toBeInstanceOf(z.ZodString)

      expect(() => expected.parse(new Set())).toThrow()
      expect(() => output.parse(new Set())).toThrow()
    })
  })

  describe('partiality', () => {
    test('returns optional zod schema if partial is true', () => {
      const schema = set(string())
      const output = schemaZodFormatter(schema, { partial: true })
      const expected = z.set(z.string()).optional()

      const assert: A.Equals<typeof output, typeof expected> = 1
      assert

      expect(expected).toBeInstanceOf(z.ZodOptional)
      expect(expected.unwrap()).toBeInstanceOf(z.ZodSet)
      expect(expected.unwrap()._def.valueType).toBeInstanceOf(z.ZodString)
      expect(output).toBeInstanceOf(z.ZodOptional)
      expect(output.unwrap()).toBeInstanceOf(z.ZodSet)
      expect(output.unwrap()._def.valueType).toBeInstanceOf(z.ZodString)

      expect(expected.parse(undefined)).toStrictEqual(undefined)
      expect(output.parse(undefined)).toStrictEqual(undefined)
    })

    test('returns non-optional zod schema if partial and defined are true', () => {
      const schema = set(string())
      const output = schemaZodFormatter(schema, { partial: true, defined: true })
      const expected = z.set(z.string())
      const assert: A.Equals<typeof output, typeof expected> = 1
      assert

      expect(expected).toBeInstanceOf(z.ZodSet)
      expect(expected._def.valueType).toBeInstanceOf(z.ZodString)
      expect(output).toBeInstanceOf(z.ZodSet)
      expect(output._def.valueType).toBeInstanceOf(z.ZodString)

      expect(() => expected.parse(undefined)).toThrow()
      expect(() => output.parse(undefined)).toThrow()
    })
  })
})
