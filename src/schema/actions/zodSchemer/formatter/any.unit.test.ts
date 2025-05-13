import type { A } from 'ts-toolbelt'
import { z } from 'zod'
import { zerialize } from 'zodex'

import { any } from '~/schema/index.js'

import { schemaZodFormatter } from './schema.js'

describe('zodSchemer > formatter > any', () => {
  test('returns custom zod schema', () => {
    const schema = any()
    const output = schemaZodFormatter(schema)
    const expected = z.custom()

    const assert: A.Equals<typeof output, typeof expected> = 1
    assert

    // `custom` is not supported by zodex
    expect(zerialize(output as any)).toStrictEqual(zerialize(expected as any))
  })

  test('returns casted custom zod schema', () => {
    const schema = any().castAs<string>()
    const output = schemaZodFormatter(schema)
    const expected = z.custom<string>()

    const assert: A.Equals<typeof output, typeof expected> = 1
    assert

    // `custom` is not supported by zodex
    expect(zerialize(output as any)).toStrictEqual(zerialize(expected as any))
  })

  test('returns optional zod schema', () => {
    const schema = any().optional()
    const output = schemaZodFormatter(schema)
    const expected = z.custom().optional()

    const assert: A.Equals<typeof output, typeof expected> = 1
    assert

    // `custom` is not supported by zodex
    expect(zerialize(output as any)).toStrictEqual(zerialize(expected as any))
  })

  test('returns optional zod schema if partial is true', () => {
    const schema = any()
    const output = schemaZodFormatter(schema, { partial: true })
    const expected = z.custom().optional()

    const assert: A.Equals<typeof output, typeof expected> = 1
    assert

    // `custom` is not supported by zodex
    expect(zerialize(output as any)).toStrictEqual(zerialize(expected as any))
  })

  test('returns non-optional zod schema if partial is true but defined is true', () => {
    const schema = any()
    const output = schemaZodFormatter(schema, { partial: true, defined: true })
    const expected = z.custom()

    const assert: A.Equals<typeof output, typeof expected> = 1
    assert

    // `custom` is not supported by zodex
    expect(zerialize(output as any)).toStrictEqual(zerialize(expected as any))
  })
})
