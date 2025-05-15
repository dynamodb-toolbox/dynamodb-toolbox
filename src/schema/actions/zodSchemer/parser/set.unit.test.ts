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
