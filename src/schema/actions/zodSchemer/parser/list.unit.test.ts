import type { A } from 'ts-toolbelt'
import { z } from 'zod'

import { list, string } from '~/schema/index.js'

import { schemaZodParser } from './schema.js'

const LIST = ['foo', 'bar']

describe('zodSchemer > parser > list', () => {
  test('returns array zod schema', () => {
    const schema = list(string())
    const output = schemaZodParser(schema)
    const expected = z.array(z.string())

    const assert: A.Equals<typeof output, typeof expected> = 1
    assert

    expect(expected).toBeInstanceOf(z.ZodArray)
    expect(expected.element).toBeInstanceOf(z.ZodString)
    expect(output).toBeInstanceOf(z.ZodArray)
    expect(output.element).toBeInstanceOf(z.ZodString)

    expect(expected.parse(LIST)).toStrictEqual(LIST)
    expect(output.parse(LIST)).toStrictEqual(LIST)

    expect(() => expected.parse(undefined)).toThrow()
    expect(() => output.parse(undefined)).toThrow()
  })

  describe('optionality', () => {
    test('returns optional zod schema', () => {
      const schema = list(string()).optional()
      const output = schemaZodParser(schema)
      const expected = z.array(z.string()).optional()

      const assert: A.Equals<typeof output, typeof expected> = 1
      assert

      expect(expected).toBeInstanceOf(z.ZodOptional)
      expect(expected.unwrap()).toBeInstanceOf(z.ZodArray)
      expect(expected.unwrap().element).toBeInstanceOf(z.ZodString)
      expect(output).toBeInstanceOf(z.ZodOptional)
      expect(output.unwrap()).toBeInstanceOf(z.ZodArray)
      expect(output.unwrap().element).toBeInstanceOf(z.ZodString)

      expect(expected.parse(undefined)).toStrictEqual(undefined)
      expect(output.parse(undefined)).toStrictEqual(undefined)
    })

    test('returns non-optional zod schema if defined is true', () => {
      const schema = list(string()).optional()
      const output = schemaZodParser(schema, { defined: true })
      const expected = z.array(z.string())
      const assert: A.Equals<typeof output, typeof expected> = 1
      assert

      expect(expected).toBeInstanceOf(z.ZodArray)
      expect(expected.element).toBeInstanceOf(z.ZodString)
      expect(expected).toBeInstanceOf(z.ZodArray)
      expect(expected.element).toBeInstanceOf(z.ZodString)

      expect(() => expected.parse(undefined)).toThrow()
      expect(() => output.parse(undefined)).toThrow()
    })
  })

  describe('defaults', () => {
    test('returns defaulted zod schema', () => {
      const schema = list(string()).default(LIST)
      const output = schemaZodParser(schema)
      const expected = z.array(z.string()).default(LIST)

      const assert: A.Equals<typeof output, typeof expected> = 1
      assert

      expect(expected).toBeInstanceOf(z.ZodDefault)
      expect(expected.removeDefault()).toBeInstanceOf(z.ZodArray)
      expect(expected.removeDefault().element).toBeInstanceOf(z.ZodString)
      expect(output).toBeInstanceOf(z.ZodDefault)
      expect(output.removeDefault()).toBeInstanceOf(z.ZodArray)
      expect(output.removeDefault().element).toBeInstanceOf(z.ZodString)

      expect(expected.parse(undefined)).toStrictEqual(LIST)
      expect(output.parse(undefined)).toStrictEqual(LIST)
    })

    test('returns defaulted zod schema (key)', () => {
      const schema = list(string()).key().default(LIST)
      const output = schemaZodParser(schema)
      const expected = z.array(z.string()).default(LIST)

      const assert: A.Equals<typeof output, typeof expected> = 1
      assert

      expect(expected).toBeInstanceOf(z.ZodDefault)
      expect(expected.removeDefault()).toBeInstanceOf(z.ZodArray)
      expect(expected.removeDefault().element).toBeInstanceOf(z.ZodString)
      expect(output).toBeInstanceOf(z.ZodDefault)
      expect(output.removeDefault()).toBeInstanceOf(z.ZodArray)
      expect(output.removeDefault().element).toBeInstanceOf(z.ZodString)

      expect(expected.parse(undefined)).toStrictEqual(LIST)
      expect(output.parse(undefined)).toStrictEqual(LIST)
    })

    test('returns non-defaulted zod schema if fill is false', () => {
      const schema = list(string()).key().default(LIST)
      const output = schemaZodParser(schema, { fill: false })
      const expected = z.array(z.string())

      const assert: A.Equals<typeof output, typeof expected> = 1
      assert

      expect(expected).toBeInstanceOf(z.ZodArray)
      expect(expected.element).toBeInstanceOf(z.ZodString)
      expect(output).toBeInstanceOf(z.ZodArray)
      expect(output.element).toBeInstanceOf(z.ZodString)

      expect(() => expected.parse(undefined)).toThrow()
      expect(() => output.parse(undefined)).toThrow()
    })
  })
})
