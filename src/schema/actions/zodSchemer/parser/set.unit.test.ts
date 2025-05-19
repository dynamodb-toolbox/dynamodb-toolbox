import type { A } from 'ts-toolbelt'
import { z } from 'zod'

import { set, string } from '~/schema/index.js'

import { schemaZodParser } from './schema.js'

const SET = new Set(['foo', 'bar'])

describe('zodSchemer > parser > set', () => {
  test('returns set zod schema', () => {
    const schema = set(string())
    const output = schemaZodParser(schema)
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
      const output = schemaZodParser(schema)
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
      const output = schemaZodParser(schema, { defined: true })
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
  })

  describe('defaults', () => {
    test('returns defaulted zod schema', () => {
      const schema = set(string()).default(SET)
      const output = schemaZodParser(schema)
      const expected = z.set(z.string()).default(SET)

      const assert: A.Equals<typeof output, typeof expected> = 1
      assert

      expect(expected).toBeInstanceOf(z.ZodDefault)
      expect(expected.removeDefault()).toBeInstanceOf(z.ZodSet)
      expect(expected.removeDefault()._def.valueType).toBeInstanceOf(z.ZodString)
      expect(output).toBeInstanceOf(z.ZodDefault)
      expect(output.removeDefault()).toBeInstanceOf(z.ZodSet)
      expect(output.removeDefault()._def.valueType).toBeInstanceOf(z.ZodString)

      expect(expected.parse(undefined)).toStrictEqual(SET)
      expect(output.parse(undefined)).toStrictEqual(SET)
    })

    test('returns defaulted zod schema (key)', () => {
      const schema = set(string()).key().default(SET)
      const output = schemaZodParser(schema)
      const expected = z.set(z.string()).default(SET)

      const assert: A.Equals<typeof output, typeof expected> = 1
      assert

      expect(expected).toBeInstanceOf(z.ZodDefault)
      expect(expected.removeDefault()).toBeInstanceOf(z.ZodSet)
      expect(expected.removeDefault()._def.valueType).toBeInstanceOf(z.ZodString)
      expect(output).toBeInstanceOf(z.ZodDefault)
      expect(output.removeDefault()).toBeInstanceOf(z.ZodSet)
      expect(output.removeDefault()._def.valueType).toBeInstanceOf(z.ZodString)

      expect(expected.parse(undefined)).toStrictEqual(SET)
      expect(output.parse(undefined)).toStrictEqual(SET)
    })

    test('returns non-defaulted zod schema if fill is false', () => {
      const schema = set(string()).key().default(SET)
      const output = schemaZodParser(schema, { fill: false })
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
      const output = schemaZodParser(schema)
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
})
