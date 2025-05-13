import type { A } from 'ts-toolbelt'
import { z } from 'zod'
import { zerialize } from 'zodex'

import { item, number, string } from '~/schema/index.js'

import { itemZodFormatter } from './item.js'

describe('zodSchemer > formatter > item', () => {
  test('returns object zod schema', () => {
    const schema = item({ str: string(), num: number(), hidden: string().hidden() })
    const output = itemZodFormatter(schema)
    const expected = z.object({ str: z.string(), num: z.number() })

    const assert: A.Equals<typeof output, typeof expected> = 1
    assert

    expect(zerialize(output)).toStrictEqual(zerialize(expected))
  })

  test('returns partial zod schema when partial is true', () => {
    const schema = item({ str: string(), num: number() })
    const output = itemZodFormatter(schema, { partial: true })
    const expected = z.object({ str: z.string(), num: z.number() }).partial()

    const assert: A.Equals<typeof output, typeof expected> = 1
    assert

    expect(zerialize(output)).toStrictEqual(zerialize(expected))
  })

  test('returns partial zod schema when partial is true but defined is true', () => {
    const schema = item({ str: string(), num: number() })
    const output = itemZodFormatter(schema, { partial: true, defined: true })
    const expected = z.object({ str: z.string(), num: z.number() }).partial()

    const assert: A.Equals<typeof output, typeof expected> = 1
    assert

    expect(zerialize(output)).toStrictEqual(zerialize(expected))
  })
})
