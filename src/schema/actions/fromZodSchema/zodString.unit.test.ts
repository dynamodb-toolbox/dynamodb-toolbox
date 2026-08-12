import type { A } from 'ts-toolbelt'
import { z } from 'zod'

import { StringSchema_, string } from '~/schema/index.js'

import { fromZodSchema } from './fromZodSchema.js'

describe('fromZodSchema > zodString', () => {
  test('returns string schema', () => {
    const schema = z.string()
    const output = fromZodSchema(schema)
    const expected = string()

    const assert: A.Equals<typeof output, typeof expected> = 1
    assert

    expect(output).toBeInstanceOf(StringSchema_)
  })

  test('maps a description to meta.description', () => {
    const output = fromZodSchema(z.string().describe('Desc'))

    expect((output.props as { meta?: unknown }).meta).toStrictEqual({ description: 'Desc' })
  })
})
