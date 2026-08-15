import type { A } from 'ts-toolbelt'
import { z } from 'zod'

import { StringSchema_, string } from '~/schema/index.js'

import { fromZodSchema } from './fromZodSchema.js'

describe('fromZodSchema > zodEnum', () => {
  test('returns string enum', () => {
    const schema = z.enum(['foo', 'bar'])
    const output = fromZodSchema(schema)
    const expected = string().enum('foo', 'bar')

    const assert: A.Equals<typeof output, typeof expected> = 1
    assert

    expect(output).toBeInstanceOf(StringSchema_)
    expect(output.props.enum).toStrictEqual(['foo', 'bar'])
  })

  test('maps a description to meta.description', () => {
    const output = fromZodSchema(z.enum(['foo', 'bar']).describe('Desc'))

    expect((output.props as { meta?: unknown }).meta).toStrictEqual({ description: 'Desc' })
  })
})
