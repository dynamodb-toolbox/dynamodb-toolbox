import type { A } from 'ts-toolbelt'
import { z } from 'zod'
import { zerialize } from 'zodex'

import { list, map, string } from '~/schema/index.js'

import { schemaZodFormatter } from './schema.js'

describe('zodSchemer > formatter > list', () => {
  test('returns array zod schema', () => {
    const schema = list(string())
    const output = schemaZodFormatter(schema)
    const expected = z.array(z.string())

    const assert: A.Equals<typeof output, typeof expected> = 1
    assert

    expect(zerialize(output)).toStrictEqual(zerialize(expected))
  })

  test('returns optional zod schema', () => {
    const schema = list(string()).optional()
    const output = schemaZodFormatter(schema)
    const expected = z.array(z.string()).optional()

    const assert: A.Equals<typeof output, typeof expected> = 1
    assert

    expect(zerialize(output)).toStrictEqual(zerialize(expected))
  })

  test('returns optional & partial zod schema when partial is true', () => {
    const schema = list(map({ str: string() }))
    const output = schemaZodFormatter(schema, { partial: true })
    const expected = z.array(z.object({ str: z.string() }).partial()).optional()

    const assert: A.Equals<typeof output, typeof expected> = 1
    assert

    expect(zerialize(output)).toStrictEqual(zerialize(expected))
  })

  test('returns non-optional & partial zod schema when partial is true but defined is true', () => {
    const schema = list(map({ str: string() }))
    const output = schemaZodFormatter(schema, { partial: true, defined: true })
    const expected = z.array(z.object({ str: z.string() }).partial())
    const assert: A.Equals<typeof output, typeof expected> = 1
    assert

    expect(zerialize(output)).toStrictEqual(zerialize(expected))
  })
})
