import type { A } from 'ts-toolbelt'
import { z } from 'zod'
import { zerialize } from 'zodex'

import { anyOf, map, number, string } from '~/schema/index.js'

import { schemaZodFormatter } from './schema.js'

describe('zodSchemer > formatter > anyOf', () => {
  test('returns union zod schema', () => {
    const schema = anyOf(string(), number())
    const output = schemaZodFormatter(schema)
    const expected = z.union([z.string(), z.number()])

    const assert: A.Equals<typeof output, typeof expected> = 1
    assert

    expect(zerialize(output)).toStrictEqual(zerialize(expected))
  })

  test('returns discriminated union zod schema when discriminator is present', () => {
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

    expect(zerialize(output)).toStrictEqual(zerialize(expected))
  })

  test('returns optional zod schema', () => {
    const schema = anyOf(string(), number()).optional()
    const output = schemaZodFormatter(schema)
    const expected = z.union([z.string(), z.number()]).optional()

    const assert: A.Equals<typeof output, typeof expected> = 1
    assert

    expect(zerialize(output)).toStrictEqual(zerialize(expected))
  })

  test('returns optional zod schema when partial is true', () => {
    const schema = anyOf(string(), number())
    const output = schemaZodFormatter(schema, { partial: true })
    const expected = z.union([z.string(), z.number()]).optional()

    const assert: A.Equals<typeof output, typeof expected> = 1
    assert

    expect(zerialize(output)).toStrictEqual(zerialize(expected))
  })

  test('returns non-optional zod schema when partial is true but defined is true', () => {
    const schema = anyOf(string(), number())
    const output = schemaZodFormatter(schema, { partial: true, defined: true })
    const expected = z.union([z.string(), z.number()])

    const assert: A.Equals<typeof output, typeof expected> = 1
    assert

    expect(zerialize(output)).toStrictEqual(zerialize(expected))
  })
})
