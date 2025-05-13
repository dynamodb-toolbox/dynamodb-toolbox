import type { A } from 'ts-toolbelt'
import { z } from 'zod'
import { zerialize } from 'zodex'

import { number } from '~/schema/index.js'

import { schemaZodFormatter } from './schema.js'

describe('zodSchemer > formatter > number', () => {
  test('returns number zod schema', () => {
    const schema = number()
    const output = schemaZodFormatter(schema)
    const expected = z.number()

    const assert: A.Equals<typeof output, typeof expected> = 1
    assert

    expect(zerialize(output)).toStrictEqual(zerialize(expected))
  })

  test('returns casted custom zod schema', () => {
    const schema = number().big()
    const output = schemaZodFormatter(schema)
    const expected = z.union([z.number(), z.bigint()])

    const assert: A.Equals<typeof output, typeof expected> = 1
    assert

    // `custom` is not supported by zodex
    expect(zerialize(output as any)).toStrictEqual(zerialize(expected as any))
  })

  test('returns optional zod schema', () => {
    const schema = number().optional()
    const output = schemaZodFormatter(schema)
    const expected = z.number().optional()

    const assert: A.Equals<typeof output, typeof expected> = 1
    assert

    expect(zerialize(output)).toStrictEqual(zerialize(expected))
  })

  test('returns optional zod schema when partial is true', () => {
    const schema = number()
    const output = schemaZodFormatter(schema, { partial: true })
    const expected = z.number().optional()

    const assert: A.Equals<typeof output, typeof expected> = 1
    assert

    expect(zerialize(output)).toStrictEqual(zerialize(expected))
  })

  test('returns non-optional zod schema when partial is true but defined is true', () => {
    const schema = number()
    const output = schemaZodFormatter(schema, { partial: true, defined: true })
    const expected = z.number()

    const assert: A.Equals<typeof output, typeof expected> = 1
    assert

    expect(zerialize(output)).toStrictEqual(zerialize(expected))
  })

  test('returns literal zod schema when enum has one value', () => {
    const schema = number().const(42)
    const output = schemaZodFormatter(schema)
    const expected = z.literal(42)

    const assert: A.Equals<typeof output, typeof expected> = 1
    assert

    expect(zerialize(output)).toStrictEqual(zerialize(expected))
  })

  test('returns union of literals zod schema when enum has more than one values', () => {
    const schema = number().enum(42, 43)
    const output = schemaZodFormatter(schema)
    const expected = z.union([z.literal(42), z.literal(43)])

    const assert: A.Equals<typeof output, typeof expected> = 1
    assert

    expect(zerialize(output)).toStrictEqual(zerialize(expected))
  })
})
