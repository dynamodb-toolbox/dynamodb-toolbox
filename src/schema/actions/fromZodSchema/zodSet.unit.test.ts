import type { A } from 'ts-toolbelt'
import { z } from 'zod'

import { NumberSchema_, SetSchema_, StringSchema_, number, set, string } from '~/schema/index.js'

import { fromZodSchema } from './fromZodSchema.js'

describe('fromZodSchema > zodSet', () => {
  test('returns string set schema', () => {
    const schema = z.set(z.string())
    const output = fromZodSchema(schema)
    const expected = set(string())

    const assert: A.Equals<typeof output, typeof expected> = 1
    assert

    expect(output).toBeInstanceOf(SetSchema_)
    expect(output.elements).toBeInstanceOf(StringSchema_)
  })

  test('returns number set schema', () => {
    const schema = z.set(z.number())
    const output = fromZodSchema(schema)
    const expected = set(number())

    const assert: A.Equals<typeof output, typeof expected> = 1
    assert

    expect(output).toBeInstanceOf(SetSchema_)
    expect(output.elements).toBeInstanceOf(NumberSchema_)
  })

  test('returns bigint set schema', () => {
    const schema = z.set(z.bigint())
    const output = fromZodSchema(schema)
    const expected = set(number().big())

    const assert: A.Equals<typeof output, typeof expected> = 1
    assert

    expect(output).toBeInstanceOf(SetSchema_)
    expect(output.elements).toBeInstanceOf(NumberSchema_)
  })
})
