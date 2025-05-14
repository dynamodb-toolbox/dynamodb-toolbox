import type { A } from 'ts-toolbelt'
import { z } from 'zod'
import { zerialize } from 'zodex'

import { any } from '~/schema/index.js'
import { jsonStringify } from '~/transformers/jsonStringify.js'

import { schemaZodFormatter } from './schema.js'

describe('zodSchemer > formatter > any', () => {
  test('returns custom zod schema', () => {
    const schema = any()
    const output = schemaZodFormatter(schema)
    const expected = z.custom()

    const assert: A.Equals<typeof output, typeof expected> = 1
    assert

    // `custom` is not supported by zodex
    expect(zerialize(output as any)).toStrictEqual(zerialize(expected as any))
  })

  test('returns casted custom zod schema', () => {
    const schema = any().castAs<string>()
    const output = schemaZodFormatter(schema)
    const expected = z.custom<string>()

    const assert: A.Equals<typeof output, typeof expected> = 1
    assert

    // `custom` is not supported by zodex
    expect(zerialize(output as any)).toStrictEqual(zerialize(expected as any))
  })

  test('returns optional zod schema', () => {
    const schema = any().optional()
    const output = schemaZodFormatter(schema)
    const expected = z.custom().optional()

    const assert: A.Equals<typeof output, typeof expected> = 1
    assert

    // `custom` is not supported by zodex
    expect(zerialize(output as any)).toStrictEqual(zerialize(expected as any))
  })

  test('returns zod effect if transform is set', () => {
    const transformer = jsonStringify()
    const schema = any().transform(transformer)
    const output = schemaZodFormatter(schema)
    const expectedSchema = z.custom()
    const expectedEffect = z.preprocess(arg => transformer.decode(arg as any), expectedSchema)

    const assert: A.Equals<
      typeof output,
      // NOTE: I couldn't find a way to pass an input type to an effect so I have to re-define one here
      z.ZodEffects<typeof expectedSchema, z.output<typeof expectedSchema>, string>
    > = 1
    assert

    expect(output.parse(JSON.stringify({ foo: 'bar' }))).toStrictEqual({ foo: 'bar' })
    expect(expectedEffect.parse(JSON.stringify({ foo: 'bar' }))).toStrictEqual({ foo: 'bar' })
  })

  test('returns untransformed zod schema if transform is set but transform is false', () => {
    const transformer = jsonStringify()
    const schema = any().transform(transformer)
    const output = schemaZodFormatter(schema, { transform: false })
    const expected = z.custom()

    const assert: A.Equals<typeof output, typeof expected> = 1
    assert

    expect(output.parse({ foo: 'bar' })).toStrictEqual({ foo: 'bar' })
    expect(expected.parse({ foo: 'bar' })).toStrictEqual({ foo: 'bar' })
  })

  test('returns optional zod schema if partial is true', () => {
    const schema = any()
    const output = schemaZodFormatter(schema, { partial: true })
    const expected = z.custom().optional()

    const assert: A.Equals<typeof output, typeof expected> = 1
    assert

    // `custom` is not supported by zodex
    expect(zerialize(output as any)).toStrictEqual(zerialize(expected as any))
  })

  test('returns non-optional zod schema if partial is true but defined is true', () => {
    const schema = any()
    const output = schemaZodFormatter(schema, { partial: true, defined: true })
    const expected = z.custom()

    const assert: A.Equals<typeof output, typeof expected> = 1
    assert

    // `custom` is not supported by zodex
    expect(zerialize(output as any)).toStrictEqual(zerialize(expected as any))
  })
})
