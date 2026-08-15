import type { A } from 'ts-toolbelt'
import { z } from 'zod'

import { MapSchema_, NumberSchema_, StringSchema_, map, number, string } from '~/schema/index.js'

import { fromZodSchema } from './fromZodSchema.js'

describe('fromZodSchema > zodObject', () => {
  test('returns map schema', () => {
    const schema = z.object({ str: z.string(), num: z.number() })
    const output = fromZodSchema(schema)
    const expected = map({ str: string(), num: number() })

    const assert: A.Equals<typeof output, typeof expected> = 1
    assert

    expect(output).toBeInstanceOf(MapSchema_)
    expect(output.attributes.str).toBeInstanceOf(StringSchema_)
    expect(output.attributes.num).toBeInstanceOf(NumberSchema_)
  })

  test('returns strict map schema from a strict zod object', () => {
    const schema = z.object({ str: z.string() }).strict()
    const output = fromZodSchema(schema)
    const expected = map({ str: string() }).strict()

    const assert: A.Equals<typeof output, typeof expected> = 1
    assert

    expect(output).toBeInstanceOf(MapSchema_)
    expect(output.props.strict).toBe(true)
  })

  test('maps a description to meta.description', () => {
    const output = fromZodSchema(z.object({ name: z.string() }).describe('Desc'))

    expect((output.props as { meta?: unknown }).meta).toStrictEqual({ description: 'Desc' })
  })
})
