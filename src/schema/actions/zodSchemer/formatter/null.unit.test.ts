import type { A } from 'ts-toolbelt'
import { z } from 'zod'
import { zerialize } from 'zodex'

import { nul, string } from '~/schema/index.js'

import { schemaZodFormatter } from './schema.js'

describe('zodSchemer > formatter > nul', () => {
  test('returns nul zod schema', () => {
    const schema = nul()
    const output = schemaZodFormatter(schema)
    const expected = z.null()

    const assert: A.Equals<typeof output, typeof expected> = 1
    assert

    expect(zerialize(output)).toStrictEqual(zerialize(expected))
  })

  test('returns optional zod schema', () => {
    const schema = nul().optional()
    const output = schemaZodFormatter(schema)
    const expected = z.null().optional()

    const assert: A.Equals<typeof output, typeof expected> = 1
    assert

    expect(zerialize(output)).toStrictEqual(zerialize(expected))
  })

  test('returns zod effect if transform is set', () => {
    const transformer = {
      encode: (value: null) => ({ value }),
      decode: ({ value }: { value: null }) => value
    }
    const schema = nul().transform(transformer)
    const output = schemaZodFormatter(schema)
    const expectedSchema = z.null()
    const expectedEffect = z.preprocess(arg => transformer.decode(arg as any), expectedSchema)

    const assert: A.Equals<
      typeof output,
      // NOTE: I couldn't find a way to pass an input type to an effect so I have to re-define one here
      z.ZodEffects<typeof expectedSchema, z.output<typeof expectedSchema>, { value: null }>
    > = 1
    assert

    expect(output.parse({ value: null })).toBe(null)
    expect(expectedEffect.parse({ value: null })).toBe(null)
  })

  test('returns untransformed zod schema if transform is set but transform is false', () => {
    const transformer = {
      encode: (content: string) => ({ content }),
      decode: ({ content }: { content: string }) => content
    }
    const schema = string().transform(transformer)
    const output = schemaZodFormatter(schema, { transform: false })
    const expected = z.string()

    const assert: A.Equals<typeof output, typeof expected> = 1
    assert

    expect(output.parse('yolo')).toBe('yolo')
    expect(expected.parse('swag')).toBe('swag')
  })

  test('returns optional zod schema if partial is true', () => {
    const schema = nul()
    const output = schemaZodFormatter(schema, { partial: true })
    const expected = z.null().optional()

    const assert: A.Equals<typeof output, typeof expected> = 1
    assert

    expect(zerialize(output)).toStrictEqual(zerialize(expected))
  })

  test('returns non-optional zod schema if partial is true but defined is true', () => {
    const schema = nul()
    const output = schemaZodFormatter(schema, { partial: true, defined: true })
    const expected = z.null()

    const assert: A.Equals<typeof output, typeof expected> = 1
    assert

    expect(zerialize(output)).toStrictEqual(zerialize(expected))
  })
})
