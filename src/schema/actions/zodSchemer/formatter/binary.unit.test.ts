import type { A } from 'ts-toolbelt'
import { z } from 'zod'
import { zerialize } from 'zodex'

import { binary } from '~/schema/index.js'

import { schemaZodFormatter } from './schema.js'

describe('zodSchemer > formatter > binary', () => {
  test('returns instanceof zod schema', () => {
    const schema = binary()
    const output = schemaZodFormatter(schema)
    const expected = z.instanceof(Uint8Array)

    const assert: A.Equals<typeof output, typeof expected> = 1
    assert

    // `instanceof` is not supported by zodex
    expect(zerialize(output as any)).toStrictEqual(zerialize(expected as any))
  })

  test('returns optional zod schema', () => {
    const schema = binary().optional()
    const output = schemaZodFormatter(schema)
    const expected = z.instanceof(Uint8Array).optional()

    const assert: A.Equals<typeof output, typeof expected> = 1
    assert

    // `instanceof` is not supported by zodex
    expect(zerialize(output as any)).toStrictEqual(zerialize(expected as any))
  })

  test('returns optional zod schema when partial is true', () => {
    const schema = binary()
    const output = schemaZodFormatter(schema, { partial: true })
    const expected = z.instanceof(Uint8Array).optional()

    const assert: A.Equals<typeof output, typeof expected> = 1
    assert

    // `instanceof` is not supported by zodex
    expect(zerialize(output as any)).toStrictEqual(zerialize(expected as any))
  })

  test('returns non-optional zod schema when partial is true but defined is true', () => {
    const schema = binary()
    const output = schemaZodFormatter(schema, { partial: true, defined: true })
    const expected = z.instanceof(Uint8Array)

    const assert: A.Equals<typeof output, typeof expected> = 1
    assert

    // `instanceof` is not supported by zodex
    expect(zerialize(output as any)).toStrictEqual(zerialize(expected as any))
  })
})
