import type { A } from 'ts-toolbelt'
import { z } from 'zod'
import { zerialize } from 'zodex'

import { boolean } from '~/schema/index.js'

import { schemaZodFormatter } from './schema.js'

describe('zodSchemer > formatter > boolean', () => {
  test('returns boolean zod schema', () => {
    const schema = boolean()
    const output = schemaZodFormatter(schema)
    const expected = z.boolean()

    const assert: A.Equals<typeof output, typeof expected> = 1
    assert

    expect(zerialize(output)).toStrictEqual(zerialize(expected))
  })

  test('returns optional zod schema', () => {
    const schema = boolean().optional()
    const output = schemaZodFormatter(schema)
    const expected = z.boolean().optional()

    const assert: A.Equals<typeof output, typeof expected> = 1
    assert

    expect(zerialize(output)).toStrictEqual(zerialize(expected))
  })

  test('returns optional zod schema if partial is true', () => {
    const schema = boolean()
    const output = schemaZodFormatter(schema, { partial: true })
    const expected = z.boolean().optional()

    const assert: A.Equals<typeof output, typeof expected> = 1
    assert

    expect(zerialize(output)).toStrictEqual(zerialize(expected))
  })

  test('returns non-optional zod schema if partial is true but defined is true', () => {
    const schema = boolean()
    const output = schemaZodFormatter(schema, { partial: true, defined: true })
    const expected = z.boolean()

    const assert: A.Equals<typeof output, typeof expected> = 1
    assert

    expect(zerialize(output)).toStrictEqual(zerialize(expected))
  })

  test('returns literal zod schema if enum has one value', () => {
    const schema = boolean().const(true)
    const output = schemaZodFormatter(schema)
    const expected = z.literal(true)

    const assert: A.Equals<typeof output, typeof expected> = 1
    assert

    expect(zerialize(output)).toStrictEqual(zerialize(expected))
  })

  test('returns union of literals zod schema if enum has more than one values', () => {
    const schema = boolean().enum(true, false)
    const output = schemaZodFormatter(schema)
    const expected = z.union([z.literal(true), z.literal(false)])

    const assert: A.Equals<typeof output, typeof expected> = 1
    assert

    expect(zerialize(output)).toStrictEqual(zerialize(expected))
  })
})
