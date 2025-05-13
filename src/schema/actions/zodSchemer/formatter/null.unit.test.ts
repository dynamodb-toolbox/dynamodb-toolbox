import type { A } from 'ts-toolbelt'
import { z } from 'zod'
import { zerialize } from 'zodex'

import { nul } from '~/schema/index.js'

import { schemaZodFormatter } from './schema.js'

describe('zodSchemer > formatter > nul', () => {
  test('returns nul zod schema', () => {
    const schema = nul()
    const output = schemaZodFormatter(schema)
    const expected = z.null()

    const assert: A.Equals<typeof output, typeof expected> = 1
    assert

    expect(zerialize(output)).toStrictEqual(zerialize(expected))
  })

  test('returns optional zod schema', () => {
    const schema = nul().optional()
    const output = schemaZodFormatter(schema)
    const expected = z.null().optional()

    const assert: A.Equals<typeof output, typeof expected> = 1
    assert

    expect(zerialize(output)).toStrictEqual(zerialize(expected))
  })

  test('returns optional zod schema if partial is true', () => {
    const schema = nul()
    const output = schemaZodFormatter(schema, { partial: true })
    const expected = z.null().optional()

    const assert: A.Equals<typeof output, typeof expected> = 1
    assert

    expect(zerialize(output)).toStrictEqual(zerialize(expected))
  })

  test('returns non-optional zod schema if partial is true but defined is true', () => {
    const schema = nul()
    const output = schemaZodFormatter(schema, { partial: true, defined: true })
    const expected = z.null()

    const assert: A.Equals<typeof output, typeof expected> = 1
    assert

    expect(zerialize(output)).toStrictEqual(zerialize(expected))
  })
})
