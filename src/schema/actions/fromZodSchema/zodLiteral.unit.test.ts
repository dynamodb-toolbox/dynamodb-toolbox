import type { A } from 'ts-toolbelt'
import { z } from 'zod'

import {
  BooleanSchema_,
  NullSchema_,
  NumberSchema_,
  StringSchema_,
  boolean,
  nul,
  number,
  string
} from '~/schema/index.js'

import { fromZodSchema } from './fromZodSchema.js'

describe('fromZodSchema > zodLiteral', () => {
  test('returns null const if zod schema is a null literal', () => {
    const schema = z.literal(null)
    const output = fromZodSchema(schema)
    const expected = nul().const(null)

    const assert: A.Equals<typeof output, typeof expected> = 1
    assert

    expect(output).toBeInstanceOf(NullSchema_)
    expect(output.props.enum).toStrictEqual([null])
    expect(output.props.putDefault).toBe(null)
  })

  test('returns boolean const if zod schema is a boolean literal', () => {
    const schema = z.literal(true)
    const output = fromZodSchema(schema)
    const expected = boolean().const(true)

    const assert: A.Equals<typeof output, typeof expected> = 1
    assert

    expect(output).toBeInstanceOf(BooleanSchema_)
    expect(output.props.enum).toStrictEqual([true])
    expect(output.props.putDefault).toBe(true)
  })

  test('returns number const if zod schema is a number literal', () => {
    const schema = z.literal(42)
    const output = fromZodSchema(schema)
    const expected = number().const(42)

    const assert: A.Equals<typeof output, typeof expected> = 1
    assert

    expect(output).toBeInstanceOf(NumberSchema_)
    expect(output.props.enum).toStrictEqual([42])
    expect(output.props.putDefault).toBe(42)
  })

  test('returns number const if zod schema is a bigint literal', () => {
    const bigint = BigInt(9007199254740991)
    const schema = z.literal(bigint)
    const output = fromZodSchema(schema)
    const expected = number().big().const(bigint)

    const assert: A.Equals<typeof output, typeof expected> = 1
    assert

    expect(output).toBeInstanceOf(NumberSchema_)
    expect(output.props.big).toBe(true)
    expect(output.props.enum).toStrictEqual([bigint])
    expect(output.props.putDefault).toBe(bigint)
  })

  test('returns string const if zod schema is a string literal', () => {
    const schema = z.literal('foo')
    const output = fromZodSchema(schema)
    const expected = string().const('foo')

    const assert: A.Equals<typeof output, typeof expected> = 1
    assert

    expect(output).toBeInstanceOf(StringSchema_)
    expect(output.props.enum).toStrictEqual(['foo'])
    expect(output.props.putDefault).toBe('foo')
  })
})
