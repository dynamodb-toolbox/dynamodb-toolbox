import type { A } from 'ts-toolbelt'
import { z } from 'zod'
import { zerialize } from 'zodex'

import { set, string } from '~/schema/index.js'

import { schemaZodFormatter } from './schema.js'

describe('zodSchemer > formatter > set', () => {
  test('returns set zod schema', () => {
    const schema = set(string())
    const output = schemaZodFormatter(schema)
    const expected = z.set(z.string())

    const assert: A.Equals<typeof output, typeof expected> = 1
    assert

    expect(zerialize(output)).toStrictEqual(zerialize(expected))
  })

  test('returns optional zod schema', () => {
    const schema = set(string()).optional()
    const output = schemaZodFormatter(schema)
    const expected = z.set(z.string()).optional()

    const assert: A.Equals<typeof output, typeof expected> = 1
    assert

    expect(zerialize(output)).toStrictEqual(zerialize(expected))
  })

  test('returns optional zod schema if partial is true', () => {
    const schema = set(string())
    const output = schemaZodFormatter(schema, { partial: true })
    const expected = z.set(z.string()).optional()

    const assert: A.Equals<typeof output, typeof expected> = 1
    assert

    expect(zerialize(output)).toStrictEqual(zerialize(expected))
  })

  test('returns non-optional zod schema if partial is true but defined is true', () => {
    const schema = set(string())
    const output = schemaZodFormatter(schema, { partial: true, defined: true })
    const expected = z.set(z.string())
    const assert: A.Equals<typeof output, typeof expected> = 1
    assert

    expect(zerialize(output)).toStrictEqual(zerialize(expected))
  })
})
