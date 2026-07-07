import type { A } from 'ts-toolbelt'
import { z } from 'zod'

import { AnyOfSchema_, MapSchema_, StringSchema_, anyOf, map, string } from '~/schema/index.js'

import { fromZodSchema } from './fromZodSchema.js'

describe('fromZodSchema > discriminatedUnion', () => {
  test('returns discriminated anyOf schema', () => {
    const schema = z.discriminatedUnion('type', [
      z.object({ type: z.literal('a') }),
      z.object({ type: z.enum(['b', 'c']) })
    ])
    const output = fromZodSchema(schema)
    const expected = anyOf(
      map({ type: string().const('a') }),
      map({ type: string().enum('b', 'c') })
    ).discriminate('type')

    const assert: A.Equals<typeof output, typeof expected> = 1
    assert

    expect(output).toBeInstanceOf(AnyOfSchema_)
    expect(output.elements).toHaveLength(2)
    expect(output.elements[0]).toBeInstanceOf(MapSchema_)
    expect(output.elements[0].attributes.type).toBeInstanceOf(StringSchema_)
    expect(output.elements[0].attributes.type.props.enum).toStrictEqual(['a'])
    expect(output.elements[1]).toBeInstanceOf(MapSchema_)
    expect(output.elements[1].attributes.type).toBeInstanceOf(StringSchema_)
    expect(output.elements[1].attributes.type.props.enum).toStrictEqual(['b', 'c'])
  })
})
