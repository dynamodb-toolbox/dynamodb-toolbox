import type { A } from 'ts-toolbelt'
import { z } from 'zod'

import { item, number, string } from '~/schema/index.js'

import { itemZodParser } from './item.js'
import { compileAttributeNameEncoder } from './utils.js'

const STR = 'foo'
const NUM = 42
const VALUE = { str: STR, num: NUM }

describe('zodSchemer > parser > item', () => {
  test('returns object zod schema', () => {
    const schema = item({ str: string(), num: number() })
    const output = itemZodParser(schema)
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

  test('returns zod effects if an attribute is renamed', () => {
    const schema = item({ str: string(), num: number().savedAs('_n') })
    const output = itemZodParser(schema)
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
    const schema = item({ str: string(), num: number().savedAs('_n') })
    const output = itemZodParser(schema, { transform: false })
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
})
