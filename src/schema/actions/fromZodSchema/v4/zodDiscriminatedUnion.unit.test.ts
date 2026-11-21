import type { A } from 'ts-toolbelt'
import { z } from 'zod/v4'

import { AnyOfSchema_, MapSchema_, StringSchema_, anyOf, map, string } from '~/schema/index.js'

import { fromZodSchema } from './fromZodSchema.js'

describe('fromZodSchema(v4) > zodDiscriminatedUnion', () => {
  test('returns discriminated anyOf schema', () => {
    const output = fromZodSchema(
      z.discriminatedUnion('type', [
        z.object({ type: z.literal('a') }),
        z.object({ type: z.enum(['b', 'c']) })
      ])
    )
    const expected = anyOf(
      map({ type: string().const('a') }),
      // The spread is what `EnumProps` infers: a multi-value enum loses its arity (see types.ts)
      map({ type: string().enum(...(['b', 'c'] as ('b' | 'c')[])) })
    ).discriminate('type')

    const assert: A.Equals<typeof output, typeof expected> = 1
    assert

    expect(output).toBeInstanceOf(AnyOfSchema_)
    expect(output.props.discriminator).toBe('type')
    expect(output.elements).toHaveLength(2)
    expect(output.elements[0]).toBeInstanceOf(MapSchema_)
    expect(output.elements[0].attributes.type).toBeInstanceOf(StringSchema_)
    expect(output.elements[0].attributes.type.props.enum).toStrictEqual(['a'])
    expect(output.elements[1]).toBeInstanceOf(MapSchema_)
    expect(output.elements[1].attributes.type).toBeInstanceOf(StringSchema_)
    expect(output.elements[1].attributes.type.props.enum).toStrictEqual(['b', 'c'])
  })

  test('maps a description to meta.description', () => {
    const output = fromZodSchema(
      z
        .discriminatedUnion('type', [
          z.object({ type: z.literal('a') }),
          z.object({ type: z.literal('b') })
        ])
        .describe('Desc')
    )

    expect((output.props as { meta?: unknown }).meta).toStrictEqual({ description: 'Desc' })
  })
})
