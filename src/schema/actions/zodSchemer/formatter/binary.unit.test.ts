import type { A } from 'ts-toolbelt'
import { z } from 'zod'

import { binary } from '~/schema/index.js'

import { schemaZodFormatter } from './schema.js'

const BINARY = new Uint8Array([1])
const ENCODED = 'AQ=='

describe('zodSchemer > formatter > binary', () => {
  test('returns instanceof zod schema', () => {
    const schema = binary()
    const output = schemaZodFormatter(schema)
    const expected = z.instanceof(Uint8Array)

    // NOTE: Cannot use A.Equals this because of divergence between Uint8Array & Uint8ArrayConstructor types in latest TS versions
    const assert: A.Contains<typeof expected, typeof output> = 1
    assert

    expect(expected).toBeInstanceOf(z.ZodType)
    expect(output).toBeInstanceOf(z.ZodType)

    expect(expected.parse(BINARY)).toBe(BINARY)
    expect(output.parse(BINARY)).toBe(BINARY)

    expect(() => expected.parse(undefined)).toThrow()
    expect(() => output.parse(undefined)).toThrow()
  })

  describe('optionality', () => {
    test('returns optional zod schema', () => {
      const schema = binary().optional()
      const output = schemaZodFormatter(schema)
      const expected = z.instanceof(Uint8Array).optional()

      // NOTE: Cannot use A.Equals this because of divergence between Uint8Array & Uint8ArrayConstructor types in latest TS versions
      const assert: A.Contains<typeof expected, typeof output> = 1
      assert

      expect(expected).toBeInstanceOf(z.ZodOptional)
      expect(output).toBeInstanceOf(z.ZodOptional)
      expect(expected.unwrap()).toBeInstanceOf(z.ZodType)
      expect(output.unwrap()).toBeInstanceOf(z.ZodType)

      expect(expected.parse(undefined)).toBe(undefined)
      expect(output.parse(undefined)).toBe(undefined)
    })

    test('returns non-optional zod schema defined is true', () => {
      const schema = binary().optional()
      const output = schemaZodFormatter(schema, { defined: true })
      const expected = z.instanceof(Uint8Array)

      // NOTE: Cannot use A.Equals this because of divergence between Uint8Array & Uint8ArrayConstructor types in latest TS versions
      const assert: A.Contains<typeof expected, typeof output> = 1
      assert

      expect(expected).toBeInstanceOf(z.ZodType)
      expect(output).toBeInstanceOf(z.ZodType)

      expect(() => expected.parse(undefined)).toThrow()
      expect(() => output.parse(undefined)).toThrow()
    })
  })

  describe('validation', () => {
    test('returns zod effect if validate is set', () => {
      const isNotEmpty = (input: Uint8Array): boolean => input.length > 0
      const schema = binary().validate(isNotEmpty)
      const output = schemaZodFormatter(schema)
      const expected = z.instanceof(Uint8Array).refine(isNotEmpty)

      // NOTE: Cannot use A.Equals this because of divergence between Uint8Array & Uint8ArrayConstructor types in latest TS versions
      const assert: A.Contains<typeof expected, typeof output> = 1
      assert

      expect(expected).toBeInstanceOf(z.ZodEffects)
      expect(expected.innerType()).toBeInstanceOf(z.ZodType)
      expect(output).toBeInstanceOf(z.ZodEffects)
      expect(output.innerType()).toBeInstanceOf(z.ZodType)

      expect(() => expected.parse(new Uint8Array())).toThrow()
      expect(() => output.parse(new Uint8Array())).toThrow()
    })
  })

  describe('encoding/decoding', () => {
    test('returns zod effect if transform is set', () => {
      const transformer = {
        encode: (decoded: Uint8Array) => Buffer.from(decoded).toString('base64'),
        decode: (encoded: string) => new Uint8Array(Buffer.from(encoded, 'base64'))
      }
      const schema = binary().transform(transformer)
      const output = schemaZodFormatter(schema)
      const expectedSchema = z.instanceof(Uint8Array)
      const expectedEffect = z.preprocess(arg => transformer.decode(arg as any), expectedSchema)

      // NOTE: Cannot use A.Equals this because of divergence between Uint8Array & Uint8ArrayConstructor types in latest TS versions
      const assert: A.Contains<
        // NOTE: I couldn't find a way to pass an input type to an effect so I have to re-define one here
        z.ZodEffects<typeof expectedSchema, z.output<typeof expectedSchema>, string>,
        typeof output
      > = 1
      assert

      expect(expectedEffect).toBeInstanceOf(z.ZodEffects)
      expect(expectedEffect.innerType()).toBeInstanceOf(z.ZodType)
      expect(output).toBeInstanceOf(z.ZodEffects)
      expect(output.innerType()).toBeInstanceOf(z.ZodType)

      expect(expectedEffect.parse(ENCODED)).toBeInstanceOf(Uint8Array)
      expect([...expectedEffect.parse(ENCODED)]).toStrictEqual([...BINARY])
      expect(output.parse(ENCODED)).toBeInstanceOf(Uint8Array)
      expect([...output.parse(ENCODED)]).toStrictEqual([...BINARY])
    })

    test('returns untransformed zod schema if transform is set but transform is false', () => {
      const transformer = {
        encode: (decoded: Uint8Array) => Buffer.from(decoded).toString('base64'),
        decode: (encoded: string) => new Uint8Array(Buffer.from(encoded, 'base64'))
      }
      const schema = binary().transform(transformer)
      const output = schemaZodFormatter(schema, { transform: false })
      const expected = z.instanceof(Uint8Array)

      // NOTE: Cannot use A.Equals this because of divergence between Uint8Array & Uint8ArrayConstructor types in latest TS versions
      const assert: A.Contains<typeof expected, typeof output> = 1
      assert

      expect(expected).toBeInstanceOf(z.ZodType)
      expect(output).toBeInstanceOf(z.ZodType)

      expect(expected.parse(BINARY)).toBe(BINARY)
      expect(output.parse(BINARY)).toBe(BINARY)
    })
  })

  describe('partiality', () => {
    test('returns optional zod schema if partial is true', () => {
      const schema = binary()
      const output = schemaZodFormatter(schema, { partial: true })
      const expected = z.instanceof(Uint8Array).optional()

      // NOTE: Cannot use A.Equals this because of divergence between Uint8Array & Uint8ArrayConstructor types in latest TS versions
      const assert: A.Contains<typeof expected, typeof output> = 1
      assert

      expect(expected).toBeInstanceOf(z.ZodOptional)
      expect(output).toBeInstanceOf(z.ZodOptional)
      expect(expected.unwrap()).toBeInstanceOf(z.ZodType)
      expect(output.unwrap()).toBeInstanceOf(z.ZodType)

      expect(expected.parse(undefined)).toBe(undefined)
      expect(output.parse(undefined)).toBe(undefined)
    })

    test('returns non-optional zod schema if partial and defined are true', () => {
      const schema = binary()
      const output = schemaZodFormatter(schema, { partial: true, defined: true })
      const expected = z.instanceof(Uint8Array)

      // NOTE: Cannot use A.Equals this because of divergence between Uint8Array & Uint8ArrayConstructor types in latest TS versions
      const assert: A.Contains<typeof expected, typeof output> = 1
      assert

      expect(expected).toBeInstanceOf(z.ZodType)
      expect(output).toBeInstanceOf(z.ZodType)

      expect(() => expected.parse(undefined)).toThrow()
      expect(() => output.parse(undefined)).toThrow()
    })
  })
})
