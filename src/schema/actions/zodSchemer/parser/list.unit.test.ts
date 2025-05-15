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
