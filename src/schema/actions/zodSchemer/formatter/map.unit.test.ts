import type { A } from 'ts-toolbelt'
import { z } from 'zod'

import { map, number, string } from '~/schema/index.js'

import { schemaZodFormatter } from './schema.js'
import { compileRenamer } from './utils.js'

const STR = 'foo'
const NUM = 42
const VALUE = { str: STR, num: NUM }

describe('zodSchemer > formatter > map', () => {
  test('returns object zod schema', () => {
    const schema = map({ str: string(), num: number(), hidden: string().hidden() })
    const output = schemaZodFormatter(schema)
    const expected = z.object({ str: z.string(), num: z.number() })

    const assert: A.Equals<typeof output, typeof expected> = 1
    assert

    expect(expected).toBeInstanceOf(z.ZodObject)
    expect(expected.shape.str).toBeInstanceOf(z.ZodString)
    expect(expected.shape.num).toBeInstanceOf(z.ZodNumber)
    expect(expected.shape).not.toHaveProperty('hidden')
    expect(output).toBeInstanceOf(z.ZodObject)
    expect(output.shape.str).toBeInstanceOf(z.ZodString)
    expect(output.shape.num).toBeInstanceOf(z.ZodNumber)
    expect(output.shape).not.toHaveProperty('hidden')

    expect(expected.parse(VALUE)).toStrictEqual(VALUE)
    expect(output.parse(VALUE)).toStrictEqual(VALUE)

    expect(() => expected.parse(undefined)).toThrow()
    expect(() => output.parse(undefined)).toThrow()
  })

  test('returns optional zod schema', () => {
    const schema = map({ str: string(), num: number(), hidden: string().hidden() }).optional()
    const output = schemaZodFormatter(schema)
    const expected = z.object({ str: z.string(), num: z.number() }).optional()

    const assert: A.Equals<typeof output, typeof expected> = 1
    assert

    expect(expected).toBeInstanceOf(z.ZodOptional)
    expect(expected.unwrap()).toBeInstanceOf(z.ZodObject)
    expect(expected.unwrap().shape.str).toBeInstanceOf(z.ZodString)
    expect(expected.unwrap().shape.num).toBeInstanceOf(z.ZodNumber)
    expect(expected.unwrap().shape).not.toHaveProperty('hidden')
    expect(output).toBeInstanceOf(z.ZodOptional)
    expect(output.unwrap()).toBeInstanceOf(z.ZodObject)
    expect(output.unwrap().shape.str).toBeInstanceOf(z.ZodString)
    expect(output.unwrap().shape.num).toBeInstanceOf(z.ZodNumber)
    expect(output.unwrap().shape).not.toHaveProperty('hidden')

    expect(expected.parse(VALUE)).toStrictEqual(VALUE)
    expect(output.parse(VALUE)).toStrictEqual(VALUE)

    expect(expected.parse(undefined)).toStrictEqual(undefined)
    expect(output.parse(undefined)).toStrictEqual(undefined)
  })

  test('returns a zod effect if an attribute is renamed', () => {
    const schema = map({ str: string(), num: number().savedAs('_n'), hidden: string().hidden() })
    const output = schemaZodFormatter(schema)
    const expectedSchema = z.object({ str: z.string(), num: z.number() })
    const expectedEffect = z.preprocess(compileRenamer(schema), expectedSchema)

    const assert: A.Equals<
      typeof output,
      // NOTE: I couldn't find a way to pass an input type to an effect so I have to re-define one here
      z.ZodEffects<
        typeof expectedSchema,
        z.output<typeof expectedSchema>,
        { str: string; _n: number; hidden: string }
      >
    > = 1
    assert

    expect(expectedEffect).toBeInstanceOf(z.ZodEffects)
    expect(expectedEffect.innerType()).toBeInstanceOf(z.ZodObject)
    expect(expectedEffect.innerType().shape.str).toBeInstanceOf(z.ZodString)
    expect(expectedEffect.innerType().shape.num).toBeInstanceOf(z.ZodNumber)
    expect(expectedEffect.innerType().shape).not.toHaveProperty('hidden')
    expect(output).toBeInstanceOf(z.ZodEffects)
    expect(output.innerType()).toBeInstanceOf(z.ZodObject)
    expect(output.innerType().shape.str).toBeInstanceOf(z.ZodString)
    expect(output.innerType().shape.num).toBeInstanceOf(z.ZodNumber)
    expect(output.innerType().shape).not.toHaveProperty('hidden')

    const RENAMED_VALUE = { str: STR, _n: NUM }

    expect(expectedEffect.parse(RENAMED_VALUE)).toStrictEqual(VALUE)
    expect(output.parse(RENAMED_VALUE)).toStrictEqual(VALUE)
  })

  test('returns a zod schema if an attribute is renamed but transform is false', () => {
    const schema = map({ str: string(), num: number().savedAs('_n'), hidden: string().hidden() })
    const output = schemaZodFormatter(schema, { transform: false })
    const expected = z.object({ str: z.string(), num: z.number() })

    const assert: A.Equals<typeof output, typeof expected> = 1
    assert

    expect(expected).toBeInstanceOf(z.ZodObject)
    expect(expected.shape.str).toBeInstanceOf(z.ZodString)
    expect(expected.shape.num).toBeInstanceOf(z.ZodNumber)
    expect(expected.shape).not.toHaveProperty('hidden')
    expect(output).toBeInstanceOf(z.ZodObject)
    expect(output.shape.str).toBeInstanceOf(z.ZodString)
    expect(output.shape.num).toBeInstanceOf(z.ZodNumber)
    expect(output.shape).not.toHaveProperty('hidden')

    expect(expected.parse(VALUE)).toStrictEqual(VALUE)
    expect(output.parse(VALUE)).toStrictEqual(VALUE)
  })

  test('shows hidden attributes if format is false', () => {
    const schema = map({ str: string(), num: number(), hidden: string().hidden() })
    const output = schemaZodFormatter(schema, { format: false })
    const expected = z.object({ str: z.string(), num: z.number(), hidden: z.string() })

    const assert: A.Equals<typeof output, typeof expected> = 1
    assert

    expect(expected).toBeInstanceOf(z.ZodObject)
    expect(expected.shape.str).toBeInstanceOf(z.ZodString)
    expect(expected.shape.num).toBeInstanceOf(z.ZodNumber)
    expect(expected.shape.hidden).toBeInstanceOf(z.ZodString)
    expect(output).toBeInstanceOf(z.ZodObject)
    expect(output.shape.str).toBeInstanceOf(z.ZodString)
    expect(output.shape.num).toBeInstanceOf(z.ZodNumber)
    expect(output.shape.hidden).toBeInstanceOf(z.ZodString)

    const COMPLETE_VALUE = { ...VALUE, hidden: STR }

    expect(expected.parse(COMPLETE_VALUE)).toStrictEqual(COMPLETE_VALUE)
    expect(output.parse(COMPLETE_VALUE)).toStrictEqual(COMPLETE_VALUE)

    expect(() => expected.parse(VALUE)).toThrow()
    expect(() => output.parse(VALUE)).toThrow()
  })

  test('returns optional & partial zod schema if partial is true', () => {
    const schema = map({ str: string(), num: number() })
    const output = schemaZodFormatter(schema, { partial: true })
    const expected = z.object({ str: z.string(), num: z.number() }).partial().optional()

    const assert: A.Equals<typeof output, typeof expected> = 1
    assert

    expect(expected).toBeInstanceOf(z.ZodOptional)
    expect(expected.unwrap()).toBeInstanceOf(z.ZodObject)
    expect(expected.unwrap().shape.str).toBeInstanceOf(z.ZodOptional)
    expect(expected.unwrap().shape.str.unwrap()).toBeInstanceOf(z.ZodString)
    expect(expected.unwrap().shape.num).toBeInstanceOf(z.ZodOptional)
    expect(expected.unwrap().shape.num.unwrap()).toBeInstanceOf(z.ZodNumber)
    expect(expected.unwrap().shape).not.toHaveProperty('hidden')
    expect(output).toBeInstanceOf(z.ZodOptional)
    expect(output.unwrap()).toBeInstanceOf(z.ZodObject)
    expect(output.unwrap().shape.str).toBeInstanceOf(z.ZodOptional)
    expect(output.unwrap().shape.str.unwrap()).toBeInstanceOf(z.ZodString)
    expect(output.unwrap().shape.num).toBeInstanceOf(z.ZodOptional)
    expect(output.unwrap().shape.num.unwrap()).toBeInstanceOf(z.ZodNumber)
    expect(output.unwrap().shape).not.toHaveProperty('hidden')

    expect(expected.parse(VALUE)).toStrictEqual(VALUE)
    expect(output.parse(VALUE)).toStrictEqual(VALUE)

    expect(expected.parse(undefined)).toStrictEqual(undefined)
    expect(output.parse(undefined)).toStrictEqual(undefined)
  })

  test('returns non-optional & partial zod schema if partial is true but defined is true', () => {
    const schema = map({ str: string(), num: number() })
    const output = schemaZodFormatter(schema, { partial: true, defined: true })
    const expected = z.object({ str: z.string(), num: z.number() }).partial()

    const assert: A.Equals<typeof output, typeof expected> = 1
    assert

    expect(expected).toBeInstanceOf(z.ZodObject)
    expect(expected.shape.str).toBeInstanceOf(z.ZodOptional)
    expect(expected.shape.str.unwrap()).toBeInstanceOf(z.ZodString)
    expect(expected.shape.num).toBeInstanceOf(z.ZodOptional)
    expect(expected.shape.num.unwrap()).toBeInstanceOf(z.ZodNumber)
    expect(expected.shape).not.toHaveProperty('hidden')
    expect(output).toBeInstanceOf(z.ZodObject)
    expect(output.shape.str).toBeInstanceOf(z.ZodOptional)
    expect(output.shape.str.unwrap()).toBeInstanceOf(z.ZodString)
    expect(output.shape.num).toBeInstanceOf(z.ZodOptional)
    expect(output.shape.num.unwrap()).toBeInstanceOf(z.ZodNumber)
    expect(output.shape).not.toHaveProperty('hidden')

    expect(expected.parse(VALUE)).toStrictEqual(VALUE)
    expect(output.parse(VALUE)).toStrictEqual(VALUE)

    expect(() => expected.parse(undefined)).toThrow()
    expect(() => output.parse(undefined)).toThrow()
  })
})
