import type { A } from 'ts-toolbelt'
import { z } from 'zod/v4'

import { MapSchema_, NumberSchema_, StringSchema_, map, number, string } from '~/schema/index.js'

import { fromZodSchema } from './fromZodSchema.js'

describe('fromZodSchema(v4) > zodObject', () => {
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

  // `z.strictObject` and `z.object` are indistinguishable at the type level, so `strict` is only
  // carried at runtime (see the `FromZodObject` type)
  test('returns strict map schema from a strict zod object', () => {
    const output = fromZodSchema(z.strictObject({ str: z.string() }))

    expect(output).toBeInstanceOf(MapSchema_)
    expect((output.props as { strict?: unknown }).strict).toBe(true)
  })

  test('returns non-strict map schema from a loose zod object', () => {
    const output = fromZodSchema(z.looseObject({ str: z.string() }))

    expect(output).toBeInstanceOf(MapSchema_)
    expect((output.props as { strict?: unknown }).strict).toBeUndefined()
  })

  test('maps a description to meta.description', () => {
    const output = fromZodSchema(z.object({ name: z.string() }).describe('Desc'))

    expect((output.props as { meta?: unknown }).meta).toStrictEqual({ description: 'Desc' })
  })
})
