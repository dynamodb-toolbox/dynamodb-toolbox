import type { A } from 'ts-toolbelt'
import { z } from 'zod'

import { anyOf, map, number, string } from '~/schema/index.js'

import { schemaZodFormatter } from './schema.js'

const STR = 'foo'
const NUM = 42
const TRUE = true

describe('zodSchemer > formatter > anyOf', () => {
  test('returns union zod schema', () => {
    const schema = anyOf(string(), number())
    const output = schemaZodFormatter(schema)
    const expected = z.union([z.string(), z.number()])

    const assert: A.Equals<typeof output, typeof expected> = 1
    assert

    expect(expected).toBeInstanceOf(z.ZodUnion)
    expect(expected.options).toHaveLength(2)
    expect(expected.options[0]).toBeInstanceOf(z.ZodString)
    expect(expected.options[1]).toBeInstanceOf(z.ZodNumber)
    expect(output).toBeInstanceOf(z.ZodUnion)
    expect(output.options).toHaveLength(2)
    expect(output.options[0]).toBeInstanceOf(z.ZodString)
    expect(output.options[1]).toBeInstanceOf(z.ZodNumber)

    expect(expected.parse(STR)).toBe(STR)
    expect(expected.parse(NUM)).toBe(NUM)
    expect(() => expected.parse(TRUE)).toThrow()
    expect(() => expected.parse(undefined)).toThrow()
    expect(output.parse(STR)).toBe(STR)
    expect(output.parse(NUM)).toBe(NUM)
    expect(() => output.parse(TRUE)).toThrow()
    expect(() => output.parse(undefined)).toThrow()
  })

  test('returns discriminated union zod schema if discriminator is present', () => {
    const schema = anyOf(
      map({ type: string().const('a') }),
      map({ type: string().enum('b', 'c') })
    ).discriminate('type')
    const output = schemaZodFormatter(schema)
    const expected = z.discriminatedUnion('type', [
      z.object({ type: z.literal('a') }),
      z.object({ type: z.enum(['b', 'c']) })
    ])

    const assert: A.Equals<typeof output, typeof expected> = 1
    assert

    expect(expected).toBeInstanceOf(z.ZodDiscriminatedUnion)
    expect(expected.options).toHaveLength(2)
    expect(expected.options[0]).toBeInstanceOf(z.ZodObject)
    expect(expected.options[0].shape.type).toBeInstanceOf(z.ZodLiteral)
    expect(expected.options[0].shape.type.value).toBe('a')
    expect(expected.options[1]).toBeInstanceOf(z.ZodObject)
    expect(expected.options[1].shape.type).toBeInstanceOf(z.ZodEnum)
    expect(expected.options[1].shape.type.options).toStrictEqual(['b', 'c'])
    expect(output).toBeInstanceOf(z.ZodDiscriminatedUnion)
    expect(output.options).toHaveLength(2)
    expect(output.options[0]).toBeInstanceOf(z.ZodObject)
    expect(output.options[0].shape.type).toBeInstanceOf(z.ZodLiteral)
    expect(output.options[0].shape.type.value).toBe('a')
    expect(output.options[1]).toBeInstanceOf(z.ZodObject)
    expect(output.options[1].shape.type).toBeInstanceOf(z.ZodEnum)
    expect(output.options[1].shape.type.options).toStrictEqual(['b', 'c'])
  })

  test('returns optional zod schema', () => {
    const schema = anyOf(string(), number()).optional()
    const output = schemaZodFormatter(schema)
    const expected = z.union([z.string(), z.number()]).optional()

    const assert: A.Equals<typeof output, typeof expected> = 1
    assert

    expect(expected).toBeInstanceOf(z.ZodOptional)
    expect(expected.unwrap()).toBeInstanceOf(z.ZodUnion)
    expect(expected.unwrap().options).toHaveLength(2)
    expect(expected.unwrap().options[0]).toBeInstanceOf(z.ZodString)
    expect(expected.unwrap().options[1]).toBeInstanceOf(z.ZodNumber)
    expect(output).toBeInstanceOf(z.ZodOptional)
    expect(output.unwrap()).toBeInstanceOf(z.ZodUnion)
    expect(output.unwrap().options).toHaveLength(2)
    expect(output.unwrap().options[0]).toBeInstanceOf(z.ZodString)
    expect(output.unwrap().options[1]).toBeInstanceOf(z.ZodNumber)

    expect(expected.parse(undefined)).toBe(undefined)
    expect(output.parse(undefined)).toBe(undefined)
  })

  test('returns optional zod schema if partial is true', () => {
    const schema = anyOf(string(), number())
    const output = schemaZodFormatter(schema, { partial: true })
    const expected = z.union([z.string(), z.number()]).optional()

    const assert: A.Equals<typeof output, typeof expected> = 1
    assert

    expect(expected).toBeInstanceOf(z.ZodOptional)
    expect(expected.unwrap()).toBeInstanceOf(z.ZodUnion)
    expect(expected.unwrap().options).toHaveLength(2)
    expect(expected.unwrap().options[0]).toBeInstanceOf(z.ZodString)
    expect(expected.unwrap().options[1]).toBeInstanceOf(z.ZodNumber)
    expect(output).toBeInstanceOf(z.ZodOptional)
    expect(output.unwrap()).toBeInstanceOf(z.ZodUnion)
    expect(output.unwrap().options).toHaveLength(2)
    expect(output.unwrap().options[0]).toBeInstanceOf(z.ZodString)
    expect(output.unwrap().options[1]).toBeInstanceOf(z.ZodNumber)

    expect(expected.parse(undefined)).toBe(undefined)
    expect(output.parse(undefined)).toBe(undefined)
  })

  test('returns non-optional zod schema if defined is true (partial)', () => {
    const schema = anyOf(string(), number())
    const output = schemaZodFormatter(schema, { partial: true, defined: true })
    const expected = z.union([z.string(), z.number()])

    const assert: A.Equals<typeof output, typeof expected> = 1
    assert

    expect(expected).toBeInstanceOf(z.ZodUnion)
    expect(expected.options).toHaveLength(2)
    expect(expected.options[0]).toBeInstanceOf(z.ZodString)
    expect(expected.options[1]).toBeInstanceOf(z.ZodNumber)
    expect(output).toBeInstanceOf(z.ZodUnion)
    expect(output.options).toHaveLength(2)
    expect(output.options[0]).toBeInstanceOf(z.ZodString)
    expect(output.options[1]).toBeInstanceOf(z.ZodNumber)

    expect(expected.parse(STR)).toBe(STR)
    expect(expected.parse(NUM)).toBe(NUM)
    expect(() => expected.parse(TRUE)).toThrow()
    expect(() => expected.parse(undefined)).toThrow()
    expect(output.parse(STR)).toBe(STR)
    expect(output.parse(NUM)).toBe(NUM)
    expect(() => output.parse(TRUE)).toThrow()
    expect(() => output.parse(undefined)).toThrow()
  })

  test('returns non-optional zod schema if defined is true (optional)', () => {
    const schema = anyOf(string(), number()).optional()
    const output = schemaZodFormatter(schema, { defined: true })
    const expected = z.union([z.string(), z.number()])

    const assert: A.Equals<typeof output, typeof expected> = 1
    assert

    expect(expected).toBeInstanceOf(z.ZodUnion)
    expect(expected.options).toHaveLength(2)
    expect(expected.options[0]).toBeInstanceOf(z.ZodString)
    expect(expected.options[1]).toBeInstanceOf(z.ZodNumber)
    expect(output).toBeInstanceOf(z.ZodUnion)
    expect(output.options).toHaveLength(2)
    expect(output.options[0]).toBeInstanceOf(z.ZodString)
    expect(output.options[1]).toBeInstanceOf(z.ZodNumber)

    expect(expected.parse(STR)).toBe(STR)
    expect(expected.parse(NUM)).toBe(NUM)
    expect(() => expected.parse(TRUE)).toThrow()
    expect(() => expected.parse(undefined)).toThrow()
    expect(output.parse(STR)).toBe(STR)
    expect(output.parse(NUM)).toBe(NUM)
    expect(() => output.parse(TRUE)).toThrow()
    expect(() => output.parse(undefined)).toThrow()
  })
})
