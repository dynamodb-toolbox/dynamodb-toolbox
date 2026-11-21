import type { A } from 'ts-toolbelt'
import { z } from 'zod/v4'

import { Parser } from '~/schema/actions/parse/index.js'
import { NumberSchema_, StringSchema_, number, string } from '~/schema/index.js'

import { fromZodSchema } from './fromZodSchema.js'

describe('fromZodSchema(v4) > zodPipe', () => {
  test('returns the non-transformed schema of a transform', () => {
    const schema = z.string().transform(value => value.trim())
    const output = fromZodSchema(schema)
    const expected = string()

    const assert: A.Equals<typeof output, typeof expected> = 1
    assert

    expect(output).toBeInstanceOf(StringSchema_)
    expect(output.build(Parser).parse(' foo ')).toBe(' foo ')
  })

  test('returns the non-transformed schema of a preprocess', () => {
    const schema = z.preprocess(value => Number(value), z.number())
    const output = fromZodSchema(schema)
    const expected = number()

    const assert: A.Equals<typeof output, typeof expected> = 1
    assert

    expect(output).toBeInstanceOf(NumberSchema_)
  })

  test('maps a description to meta.description', () => {
    const output = fromZodSchema(
      z
        .string()
        .transform(value => value.trim())
        .describe('Desc')
    )

    expect((output.props as { meta?: unknown }).meta).toStrictEqual({ description: 'Desc' })
  })
})
