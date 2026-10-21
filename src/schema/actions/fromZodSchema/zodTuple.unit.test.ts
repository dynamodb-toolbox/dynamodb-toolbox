import type { A } from 'ts-toolbelt'
import { z } from 'zod'

import {
  NumberSchema_,
  StringSchema_,
  TupleSchema_,
  number,
  string,
  tuple
} from '~/schema/index.js'

import { fromZodSchema } from './fromZodSchema.js'

describe('fromZodSchema > zodTuple', () => {
  test('returns strict tuple schema from a plain zod tuple', () => {
    const schema = z.tuple([z.string(), z.number()])
    const output = fromZodSchema(schema)
    const expected = tuple(string(), number()).strict()

    const assert: A.Equals<typeof output, typeof expected> = 1
    assert

    expect(output).toBeInstanceOf(TupleSchema_)
    expect(output.elements[0]).toBeInstanceOf(StringSchema_)
    expect(output.elements[1]).toBeInstanceOf(NumberSchema_)
    expect(output.props.strict).toBe(true)
  })

  test('returns non-strict tuple schema from a zod tuple with a rest element', () => {
    const schema = z.tuple([z.string(), z.number()]).rest(z.unknown())
    const output = fromZodSchema(schema)
    const expected = tuple(string(), number())

    const assert: A.Equals<typeof output, typeof expected> = 1
    assert

    expect(output).toBeInstanceOf(TupleSchema_)
  })

  test('maps a description to meta.description', () => {
    const output = fromZodSchema(z.tuple([z.string()]).describe('Desc'))

    expect((output.props as { meta?: unknown }).meta).toStrictEqual({ description: 'Desc' })
  })
})
