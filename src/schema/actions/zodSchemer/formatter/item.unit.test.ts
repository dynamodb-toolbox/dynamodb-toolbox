import type { A } from 'ts-toolbelt'
import { z } from 'zod'
import { zerialize } from 'zodex'

import { item, number, string } from '~/schema/index.js'

import { itemZodFormatter } from './item.js'
import { compileRenamer } from './utils.js'

describe('zodSchemer > formatter > item', () => {
  test('returns object zod schema', () => {
    const schema = item({ str: string(), num: number(), hidden: string().hidden() })
    const output = itemZodFormatter(schema)
    const expected = z.object({ str: z.string(), num: z.number() })

    const assert: A.Equals<typeof output, typeof expected> = 1
    assert

    expect(zerialize(output)).toStrictEqual(zerialize(expected))
  })

  test('returns zod effects if an attribute is renamed', () => {
    const schema = item({ str: string(), num: number().savedAs('_n'), hidden: string().hidden() })
    const output = itemZodFormatter(schema)
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

    expect(zerialize(output)).toStrictEqual(zerialize(expectedEffect))
  })

  test('returns a zod schema if an attribute is renamed but transform is false', () => {
    const schema = item({ str: string(), num: number().savedAs('_n'), hidden: string().hidden() })
    const output = itemZodFormatter(schema, { transform: false })
    const expected = z.object({ str: z.string(), num: z.number() })

    const assert: A.Equals<typeof output, typeof expected> = 1
    assert

    expect(zerialize(output)).toStrictEqual(zerialize(expected))
  })

  test('shows hidden attributes if format is false', () => {
    const schema = item({ str: string(), num: number(), hidden: string().hidden() })
    const output = itemZodFormatter(schema, { format: false })
    const expected = z.object({ str: z.string(), num: z.number(), hidden: z.string() })

    const assert: A.Equals<typeof output, typeof expected> = 1
    assert

    expect(zerialize(output)).toStrictEqual(zerialize(expected))
  })

  test('returns non-optional & partial zod schema if partial is true', () => {
    const schema = item({ str: string(), num: number(), hidden: string().hidden() })
    const output = itemZodFormatter(schema, { partial: true })
    const expected = z.object({ str: z.string(), num: z.number() }).partial()

    const assert: A.Equals<typeof output, typeof expected> = 1
    assert

    expect(zerialize(output)).toStrictEqual(zerialize(expected))
  })

  test('returns non-optional & partial zod schema if partial is true but defined is true', () => {
    const schema = item({ str: string(), num: number() })
    const output = itemZodFormatter(schema, { partial: true, defined: true })
    const expected = z.object({ str: z.string(), num: z.number() }).partial()

    const assert: A.Equals<typeof output, typeof expected> = 1
    assert

    expect(zerialize(output)).toStrictEqual(zerialize(expected))
  })
})
