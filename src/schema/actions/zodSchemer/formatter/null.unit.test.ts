import type { A } from 'ts-toolbelt'
import { z } from 'zod'

import { nul } from '~/schema/index.js'

import { schemaZodFormatter } from './schema.js'

const NULL = null

describe('zodSchemer > formatter > nul', () => {
  test('returns nul zod schema', () => {
    const schema = nul()
    const output = schemaZodFormatter(schema)
    const expected = z.null()

    const assert: A.Equals<typeof output, typeof expected> = 1
    assert

    expect(expected).toBeInstanceOf(z.ZodNull)
    expect(output).toBeInstanceOf(z.ZodNull)

    expect(expected.parse(NULL)).toBe(NULL)
    expect(output.parse(NULL)).toBe(NULL)

    expect(() => expected.parse(undefined)).toThrow()
    expect(() => output.parse(undefined)).toThrow()
  })

  test('returns optional zod schema', () => {
    const schema = nul().optional()
    const output = schemaZodFormatter(schema)
    const expected = z.null().optional()

    const assert: A.Equals<typeof output, typeof expected> = 1
    assert

    expect(expected).toBeInstanceOf(z.ZodOptional)
    expect(output).toBeInstanceOf(z.ZodOptional)
    expect(expected.unwrap()).toBeInstanceOf(z.ZodNull)
    expect(output.unwrap()).toBeInstanceOf(z.ZodNull)

    expect(expected.parse(undefined)).toBe(undefined)
    expect(output.parse(undefined)).toBe(undefined)
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

    const VALUE_NULL = { value: NULL }

    expect(expectedEffect).toBeInstanceOf(z.ZodEffects)
    expect(expectedEffect.innerType()).toBeInstanceOf(z.ZodNull)
    expect(output).toBeInstanceOf(z.ZodEffects)
    expect(output.innerType()).toBeInstanceOf(z.ZodNull)

    expect(expectedEffect.parse(VALUE_NULL)).toBe(NULL)
    expect(output.parse(VALUE_NULL)).toBe(NULL)
  })

  test('returns untransformed zod schema if transform is set but transform is false', () => {
    const transformer = {
      encode: (value: null) => ({ value }),
      decode: ({ value }: { value: null }) => value
    }
    const schema = nul().transform(transformer)
    const output = schemaZodFormatter(schema, { transform: false })
    const expected = z.null()

    const assert: A.Equals<typeof output, typeof expected> = 1
    assert

    expect(expected).toBeInstanceOf(z.ZodNull)
    expect(output).toBeInstanceOf(z.ZodNull)

    expect(expected.parse(NULL)).toBe(NULL)
    expect(output.parse(NULL)).toBe(NULL)
  })

  test('returns optional zod schema if partial is true', () => {
    const schema = nul()
    const output = schemaZodFormatter(schema, { partial: true })
    const expected = z.null().optional()

    const assert: A.Equals<typeof output, typeof expected> = 1
    assert

    expect(expected).toBeInstanceOf(z.ZodOptional)
    expect(output).toBeInstanceOf(z.ZodOptional)
    expect(expected.unwrap()).toBeInstanceOf(z.ZodNull)
    expect(output.unwrap()).toBeInstanceOf(z.ZodNull)

    expect(expected.parse(undefined)).toBe(undefined)
    expect(output.parse(undefined)).toBe(undefined)
  })

  test('returns non-optional zod schema if defined is true (partial)', () => {
    const schema = nul()
    const output = schemaZodFormatter(schema, { partial: true, defined: true })
    const expected = z.null()

    const assert: A.Equals<typeof output, typeof expected> = 1
    assert

    expect(expected).toBeInstanceOf(z.ZodNull)
    expect(output).toBeInstanceOf(z.ZodNull)

    expect(() => expected.parse(undefined)).toThrow()
    expect(() => output.parse(undefined)).toThrow()
  })

  test('returns non-optional zod schema if defined is true (optional)', () => {
    const schema = nul().optional()
    const output = schemaZodFormatter(schema, { defined: true })
    const expected = z.null()

    const assert: A.Equals<typeof output, typeof expected> = 1
    assert

    expect(expected).toBeInstanceOf(z.ZodNull)
    expect(output).toBeInstanceOf(z.ZodNull)

    expect(() => expected.parse(undefined)).toThrow()
    expect(() => output.parse(undefined)).toThrow()
  })
})
