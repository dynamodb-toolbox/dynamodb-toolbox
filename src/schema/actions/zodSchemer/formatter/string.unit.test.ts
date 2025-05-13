import type { A } from 'ts-toolbelt'
import { z } from 'zod'
import { zerialize } from 'zodex'

import { string } from '~/schema/index.js'

import { schemaZodFormatter } from './schema.js'

describe('zodSchemer > formatter > string', () => {
  test('returns string zod schema', () => {
    const schema = string()
    const output = schemaZodFormatter(schema)
    const expected = z.string()

    const assert: A.Equals<typeof output, typeof expected> = 1
    assert

    expect(zerialize(output)).toStrictEqual(zerialize(expected))
  })

  test('returns optional zod schema', () => {
    const schema = string().optional()
    const output = schemaZodFormatter(schema)
    const expected = z.string().optional()

    const assert: A.Equals<typeof output, typeof expected> = 1
    assert

    expect(zerialize(output)).toStrictEqual(zerialize(expected))
  })

  test('returns optional zod schema if partial is true', () => {
    const schema = string()
    const output = schemaZodFormatter(schema, { partial: true })
    const expected = z.string().optional()

    const assert: A.Equals<typeof output, typeof expected> = 1
    assert

    expect(zerialize(output)).toStrictEqual(zerialize(expected))
  })

  test('returns non-optional zod schema if partial is true but defined is true', () => {
    const schema = string()
    const output = schemaZodFormatter(schema, { partial: true, defined: true })
    const expected = z.string()

    const assert: A.Equals<typeof output, typeof expected> = 1
    assert

    expect(zerialize(output)).toStrictEqual(zerialize(expected))
  })

  test('returns literal zod schema if enum has one value', () => {
    const schema = string().const('foo')
    const output = schemaZodFormatter(schema)
    const expected = z.literal('foo')

    const assert: A.Equals<typeof output, typeof expected> = 1
    assert

    expect(zerialize(output)).toStrictEqual(zerialize(expected))
  })

  test('returns enum zod schema if enum has more than one values', () => {
    const schema = string().enum('foo', 'bar')
    const output = schemaZodFormatter(schema)
    const expected = z.enum(['foo', 'bar'])

    const assert: A.Equals<typeof output, typeof expected> = 1
    assert

    expect(zerialize(output)).toStrictEqual(zerialize(expected))
  })
})
