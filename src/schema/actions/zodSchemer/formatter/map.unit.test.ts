import type { A } from 'ts-toolbelt'
import { z } from 'zod'
import { zerialize } from 'zodex'

import { map, number, string } from '~/schema/index.js'

import { schemaZodFormatter } from './schema.js'
import { compileRenamer } from './utils.js'

describe('zodSchemer > formatter > map', () => {
  test('returns object zod schema', () => {
    const schema = map({ str: string(), num: number(), hidden: string().hidden() })
    const output = schemaZodFormatter(schema)
    const expected = z.object({ str: z.string(), num: z.number() })

    const assert: A.Equals<typeof output, typeof expected> = 1
    assert

    expect(zerialize(output)).toStrictEqual(zerialize(expected))
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

    expect(zerialize(output)).toStrictEqual(zerialize(expectedEffect))
  })

  test('returns a zod schema if an attribute is renamed but transform is false', () => {
    const schema = map({ str: string(), num: number().savedAs('_n'), hidden: string().hidden() })
    const output = schemaZodFormatter(schema, { transform: false })
    const expected = z.object({ str: z.string(), num: z.number() })

    const assert: A.Equals<typeof output, typeof expected> = 1
    assert

    expect(zerialize(output)).toStrictEqual(zerialize(expected))
  })

  test('shows hidden attributes if format is false', () => {
    const schema = map({ str: string(), num: number(), hidden: string().hidden() })
    const output = schemaZodFormatter(schema, { format: false })
    const expected = z.object({ str: z.string(), num: z.number(), hidden: z.string() })

    const assert: A.Equals<typeof output, typeof expected> = 1
    assert

    expect(zerialize(output)).toStrictEqual(zerialize(expected))
  })

  test('returns optional & partial zod schema if partial is true', () => {
    const schema = map({ str: string(), num: number() })
    const output = schemaZodFormatter(schema, { partial: true })
    const expected = z.object({ str: z.string(), num: z.number() }).partial().optional()

    const assert: A.Equals<typeof output, typeof expected> = 1
    assert

    expect(zerialize(output)).toStrictEqual(zerialize(expected))
  })

  test('returns non-optional & partial zod schema if partial is true but defined is true', () => {
    const schema = map({ str: string(), num: number() })
    const output = schemaZodFormatter(schema, { partial: true, defined: true })
    const expected = z.object({ str: z.string(), num: z.number() }).partial()

    const assert: A.Equals<typeof output, typeof expected> = 1
    assert

    expect(zerialize(output)).toStrictEqual(zerialize(expected))
  })
})
