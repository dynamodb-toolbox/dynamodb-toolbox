import type { A } from 'ts-toolbelt'
import { z } from 'zod'

import { list, map, string } from '~/schema/index.js'

import { schemaZodFormatter } from './schema.js'

const LIST = ['foo', 'bar']

describe('zodSchemer > formatter > list', () => {
  test('returns array zod schema', () => {
    const schema = list(string())
    const output = schemaZodFormatter(schema)
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
    const output = schemaZodFormatter(schema)
    const expected = z.array(z.string()).optional()

    const assert: A.Equals<typeof output, typeof expected> = 1
    assert

    expect(expected).toBeInstanceOf(z.ZodOptional)
    expect(expected.unwrap()).toBeInstanceOf(z.ZodArray)
    expect(expected.unwrap().element).toBeInstanceOf(z.ZodString)
    expect(output).toBeInstanceOf(z.ZodOptional)
    expect(output.unwrap()).toBeInstanceOf(z.ZodArray)
    expect(output.unwrap().element).toBeInstanceOf(z.ZodString)

    expect(expected.parse(LIST)).toStrictEqual(LIST)
    expect(output.parse(LIST)).toStrictEqual(LIST)

    expect(expected.parse(undefined)).toStrictEqual(undefined)
    expect(output.parse(undefined)).toStrictEqual(undefined)
  })

  test('returns optional & partial zod schema if partial is true', () => {
    const schema = list(map({ str: string() }))
    const output = schemaZodFormatter(schema, { partial: true })
    const expected = z.array(z.object({ str: z.string() }).partial()).optional()

    const assert: A.Equals<typeof output, typeof expected> = 1
    assert

    expect(expected).toBeInstanceOf(z.ZodOptional)
    expect(expected.unwrap()).toBeInstanceOf(z.ZodArray)
    expect(expected.unwrap().element).toBeInstanceOf(z.ZodObject)
    expect(expected.unwrap().element.shape.str).toBeInstanceOf(z.ZodOptional)
    expect(expected.unwrap().element.shape.str.unwrap()).toBeInstanceOf(z.ZodString)
    expect(expected).toBeInstanceOf(z.ZodOptional)
    expect(expected.unwrap()).toBeInstanceOf(z.ZodArray)
    expect(expected.unwrap().element).toBeInstanceOf(z.ZodObject)
    expect(expected.unwrap().element.shape.str).toBeInstanceOf(z.ZodOptional)
    expect(expected.unwrap().element.shape.str.unwrap()).toBeInstanceOf(z.ZodString)

    expect(expected.parse([{}])).toStrictEqual([{}])
    expect(output.parse([{}])).toStrictEqual([{}])

    expect(expected.parse(undefined)).toStrictEqual(undefined)
    expect(output.parse(undefined)).toStrictEqual(undefined)
  })

  test('returns non-optional & partial zod schema if partial is true but defined is true', () => {
    const schema = list(map({ str: string() }))
    const output = schemaZodFormatter(schema, { partial: true, defined: true })
    const expected = z.array(z.object({ str: z.string() }).partial())
    const assert: A.Equals<typeof output, typeof expected> = 1
    assert

    expect(expected).toBeInstanceOf(z.ZodArray)
    expect(expected.element).toBeInstanceOf(z.ZodObject)
    expect(expected.element.shape.str).toBeInstanceOf(z.ZodOptional)
    expect(expected.element.shape.str.unwrap()).toBeInstanceOf(z.ZodString)
    expect(expected).toBeInstanceOf(z.ZodArray)
    expect(expected.element).toBeInstanceOf(z.ZodObject)
    expect(expected.element.shape.str).toBeInstanceOf(z.ZodOptional)
    expect(expected.element.shape.str.unwrap()).toBeInstanceOf(z.ZodString)

    expect(expected.parse([{}])).toStrictEqual([{}])
    expect(output.parse([{}])).toStrictEqual([{}])

    expect(() => expected.parse(undefined)).toThrow()
    expect(() => output.parse(undefined)).toThrow()
  })
})
