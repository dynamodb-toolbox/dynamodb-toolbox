import type { A } from 'ts-toolbelt'
import { z } from 'zod/v4'

import { NumberSchema_, number } from '~/schema/index.js'

import { fromZodSchema } from './fromZodSchema.js'

describe('fromZodSchema(v4) > zodNumber', () => {
  test('returns number schema', () => {
    const schema = z.number()
    const output = fromZodSchema(schema)
    const expected = number()

    const assert: A.Equals<typeof output, typeof expected> = 1
    assert

    expect(output).toBeInstanceOf(NumberSchema_)
  })

  test('returns number schema from an integer schema', () => {
    const output = fromZodSchema(z.int())

    expect(output).toBeInstanceOf(NumberSchema_)
  })

  test('maps a description to meta.description', () => {
    const output = fromZodSchema(z.number().describe('Desc'))

    expect((output.props as { meta?: unknown }).meta).toStrictEqual({ description: 'Desc' })
  })
})
