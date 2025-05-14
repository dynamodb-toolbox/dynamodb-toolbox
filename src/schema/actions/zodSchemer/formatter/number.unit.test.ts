import type { A } from 'ts-toolbelt'
import { z } from 'zod'
import { zerialize } from 'zodex'

import { number, string } from '~/schema/index.js'

import { schemaZodFormatter } from './schema.js'

describe('zodSchemer > formatter > number', () => {
  test('returns number zod schema', () => {
    const schema = number()
    const output = schemaZodFormatter(schema)
    const expected = z.number()

    const assert: A.Equals<typeof output, typeof expected> = 1
    assert

    expect(zerialize(output)).toStrictEqual(zerialize(expected))
  })

  test('returns casted custom zod schema', () => {
    const schema = number().big()
    const output = schemaZodFormatter(schema)
    const expected = z.union([z.number(), z.bigint()])

    const assert: A.Equals<typeof output, typeof expected> = 1
    assert

    // `custom` is not supported by zodex
    expect(zerialize(output as any)).toStrictEqual(zerialize(expected as any))
  })

  test('returns optional zod schema', () => {
    const schema = number().optional()
    const output = schemaZodFormatter(schema)
    const expected = z.number().optional()

    const assert: A.Equals<typeof output, typeof expected> = 1
    assert

    expect(zerialize(output)).toStrictEqual(zerialize(expected))
  })

  test('returns zod effect if transform is set', () => {
    const transformer = {
      encode: (value: number) => ({ value }),
      decode: ({ value }: { value: number }) => value
    }
    const schema = number().transform(transformer)
    const output = schemaZodFormatter(schema)
    const expectedSchema = z.number()
    const expectedEffect = z.preprocess(arg => transformer.decode(arg as any), expectedSchema)

    const assert: A.Equals<
      typeof output,
      // NOTE: I couldn't find a way to pass an input type to an effect so I have to re-define one here
      z.ZodEffects<typeof expectedSchema, z.output<typeof expectedSchema>, { value: number }>
    > = 1
    assert

    expect(output.parse({ value: 42 })).toBe(42)
    expect(expectedEffect.parse({ value: 43 })).toBe(43)
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
    const schema = number()
    const output = schemaZodFormatter(schema, { partial: true })
    const expected = z.number().optional()

    const assert: A.Equals<typeof output, typeof expected> = 1
    assert

    expect(zerialize(output)).toStrictEqual(zerialize(expected))
  })

  test('returns non-optional zod schema if partial is true but defined is true', () => {
    const schema = number()
    const output = schemaZodFormatter(schema, { partial: true, defined: true })
    const expected = z.number()

    const assert: A.Equals<typeof output, typeof expected> = 1
    assert

    expect(zerialize(output)).toStrictEqual(zerialize(expected))
  })

  test('returns literal zod schema if enum has one value', () => {
    const schema = number().const(42)
    const output = schemaZodFormatter(schema)
    const expected = z.literal(42)

    const assert: A.Equals<typeof output, typeof expected> = 1
    assert

    expect(zerialize(output)).toStrictEqual(zerialize(expected))
  })

  test('returns union of literals zod schema if enum has more than one values', () => {
    const schema = number().enum(42, 43)
    const output = schemaZodFormatter(schema)
    const expected = z.union([z.literal(42), z.literal(43)])

    const assert: A.Equals<typeof output, typeof expected> = 1
    assert

    expect(zerialize(output)).toStrictEqual(zerialize(expected))
  })
})
