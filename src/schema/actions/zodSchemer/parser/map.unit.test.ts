import type { A } from 'ts-toolbelt'
import { z } from 'zod'

import { map, number, string } from '~/schema/index.js'

import { schemaZodParser } from './schema.js'
import { compileAttributeNameEncoder } from './utils.js'

const STR = 'foo'
const NUM = 42
const VALUE = { str: STR, num: NUM }

describe('zodSchemer > parser > map', () => {
  test('returns object zod schema', () => {
    const schema = map({ str: string(), num: number() })
    const output = schemaZodParser(schema)
    const expected = z.object({ str: z.string(), num: z.number() })

    const assert: A.Equals<typeof output, typeof expected> = 1
    assert

    expect(expected).toBeInstanceOf(z.ZodObject)
    expect(expected.shape.str).toBeInstanceOf(z.ZodString)
    expect(expected.shape.num).toBeInstanceOf(z.ZodNumber)
    expect(output).toBeInstanceOf(z.ZodObject)
    expect(output.shape.str).toBeInstanceOf(z.ZodString)
    expect(output.shape.num).toBeInstanceOf(z.ZodNumber)

    expect(expected.parse(VALUE)).toStrictEqual(VALUE)
    expect(output.parse(VALUE)).toStrictEqual(VALUE)

    expect(() => expected.parse(undefined)).toThrow()
    expect(() => output.parse(undefined)).toThrow()
  })

  test('returns optional zod schema', () => {
    const schema = map({ str: string(), num: number() }).optional()
    const output = schemaZodParser(schema)
    const expected = z.object({ str: z.string(), num: z.number() }).optional()

    const assert: A.Equals<typeof output, typeof expected> = 1
    assert

    expect(expected).toBeInstanceOf(z.ZodOptional)
    expect(expected.unwrap()).toBeInstanceOf(z.ZodObject)
    expect(expected.unwrap().shape.str).toBeInstanceOf(z.ZodString)
    expect(expected.unwrap().shape.num).toBeInstanceOf(z.ZodNumber)
    expect(output).toBeInstanceOf(z.ZodOptional)
    expect(output.unwrap()).toBeInstanceOf(z.ZodObject)
    expect(output.unwrap().shape.str).toBeInstanceOf(z.ZodString)
    expect(output.unwrap().shape.num).toBeInstanceOf(z.ZodNumber)

    expect(expected.parse(undefined)).toStrictEqual(undefined)
    expect(output.parse(undefined)).toStrictEqual(undefined)
  })

  test('returns a zod effect if an attribute is renamed', () => {
    const schema = map({ str: string(), num: number().savedAs('_n') })
    const output = schemaZodParser(schema)
    const expectedSchema = z.object({ str: z.string(), num: z.number() })
    const expectedEffect = expectedSchema.transform(compileAttributeNameEncoder(schema))

    const assert: A.Equals<
      typeof output,
      // NOTE: I couldn't find a way to pass an input type to an effect so I have to re-define one here
      z.ZodEffects<
        typeof expectedSchema,
        { str: string; _n: number },
        z.input<typeof expectedSchema>
      >
    > = 1
    assert

    expect(expectedEffect).toBeInstanceOf(z.ZodEffects)
    expect(expectedEffect.innerType()).toBeInstanceOf(z.ZodObject)
    expect(expectedEffect.innerType().shape.str).toBeInstanceOf(z.ZodString)
    expect(expectedEffect.innerType().shape.num).toBeInstanceOf(z.ZodNumber)
    expect(output).toBeInstanceOf(z.ZodEffects)
    expect(output.innerType()).toBeInstanceOf(z.ZodObject)
    expect(output.innerType().shape.str).toBeInstanceOf(z.ZodString)
    expect(output.innerType().shape.num).toBeInstanceOf(z.ZodNumber)

    const RENAMED_VALUE = { str: STR, _n: NUM }

    expect(expectedEffect.parse(VALUE)).toStrictEqual(RENAMED_VALUE)
    expect(output.parse(VALUE)).toStrictEqual(RENAMED_VALUE)
  })

  test('returns a zod schema if an attribute is renamed but transform is false', () => {
    const schema = map({ str: string(), num: number().savedAs('_n') })
    const output = schemaZodParser(schema, { transform: false })
    const expected = z.object({ str: z.string(), num: z.number() })

    const assert: A.Equals<typeof output, typeof expected> = 1
    assert

    expect(expected).toBeInstanceOf(z.ZodObject)
    expect(expected.shape.str).toBeInstanceOf(z.ZodString)
    expect(expected.shape.num).toBeInstanceOf(z.ZodNumber)
    expect(output).toBeInstanceOf(z.ZodObject)
    expect(output.shape.str).toBeInstanceOf(z.ZodString)
    expect(output.shape.num).toBeInstanceOf(z.ZodNumber)
  })

  test('returns non-optional zod schema if defined is true', () => {
    const schema = map({ str: string(), num: number() }).optional()
    const output = schemaZodParser(schema, { defined: true })
    const expected = z.object({ str: z.string(), num: z.number() })

    const assert: A.Equals<typeof output, typeof expected> = 1
    assert

    expect(expected).toBeInstanceOf(z.ZodObject)
    expect(expected.shape.str).toBeInstanceOf(z.ZodString)
    expect(expected.shape.num).toBeInstanceOf(z.ZodNumber)
    expect(output).toBeInstanceOf(z.ZodObject)
    expect(output.shape.str).toBeInstanceOf(z.ZodString)
    expect(output.shape.num).toBeInstanceOf(z.ZodNumber)

    expect(() => expected.parse(undefined)).toThrow()
    expect(() => output.parse(undefined)).toThrow()
  })
})
