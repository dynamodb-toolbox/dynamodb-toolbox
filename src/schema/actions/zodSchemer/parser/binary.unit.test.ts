import type { A } from 'ts-toolbelt'
import { z } from 'zod'

import { binary } from '~/schema/index.js'

import { schemaZodParser } from './schema.js'

const BINARY = new Uint8Array([1])
const ENCODED = 'AQ=='

describe('zodSchemer > parser > binary', () => {
  test('returns instanceof zod schema', () => {
    const schema = binary()
    const output = schemaZodParser(schema)
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

  test('returns optional zod schema', () => {
    const schema = binary().optional()
    const output = schemaZodParser(schema)
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

  describe('defaults', () => {
    test('returns defaulted zod schema', () => {
      const schema = binary().default(BINARY)
      const output = schemaZodParser(schema)
      const expected = z.instanceof(Uint8Array).default(BINARY)

      // NOTE: Cannot use A.Equals this because of divergence between Uint8Array & Uint8ArrayConstructor types in latest TS versions
      const assert: A.Contains<typeof expected, typeof output> = 1
      assert

      expect(expected).toBeInstanceOf(z.ZodDefault)
      expect(expected.removeDefault()).toBeInstanceOf(z.ZodType)
      expect(output).toBeInstanceOf(z.ZodDefault)
      expect(output.removeDefault()).toBeInstanceOf(z.ZodType)

      expect(expected.parse(undefined)).toStrictEqual(BINARY)
      expect(output.parse(undefined)).toStrictEqual(BINARY)
    })

    test('returns defaulted zod schema (key)', () => {
      const schema = binary().key().default(BINARY)
      const output = schemaZodParser(schema)
      const expected = z.instanceof(Uint8Array).default(BINARY)

      // NOTE: Cannot use A.Equals this because of divergence between Uint8Array & Uint8ArrayConstructor types in latest TS versions
      const assert: A.Contains<typeof expected, typeof output> = 1
      assert

      expect(expected).toBeInstanceOf(z.ZodDefault)
      expect(expected.removeDefault()).toBeInstanceOf(z.ZodType)
      expect(output).toBeInstanceOf(z.ZodDefault)
      expect(output.removeDefault()).toBeInstanceOf(z.ZodType)

      expect(expected.parse(undefined)).toStrictEqual(BINARY)
      expect(output.parse(undefined)).toStrictEqual(BINARY)
    })

    test('returns non-defaulted zod schema if fill is false', () => {
      const schema = binary().default(BINARY)
      const output = schemaZodParser(schema, { fill: false })
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

  test('returns zod effect if transform is set', () => {
    const transformer = {
      encode: (decoded: Uint8Array) => Buffer.from(decoded).toString('base64'),
      decode: (encoded: string) => new Uint8Array(Buffer.from(encoded, 'base64'))
    }
    const schema = binary().transform(transformer)
    const output = schemaZodParser(schema)
    const expectedSchema = z.instanceof(Uint8Array)
    const expectedEffect = expectedSchema.transform(arg => transformer.encode(arg))

    // NOTE: Cannot use A.Equals this because of divergence between Uint8Array & Uint8ArrayConstructor types in latest TS versions
    const assert: A.Contains<
      // NOTE: I couldn't find a way to pass an input type to an effect so I have to re-define one here
      z.ZodEffects<typeof expectedSchema, string, z.input<typeof expectedSchema>>,
      typeof output
    > = 1
    assert

    expect(expectedEffect).toBeInstanceOf(z.ZodEffects)
    expect(expectedEffect.innerType()).toBeInstanceOf(z.ZodType)
    expect(output).toBeInstanceOf(z.ZodEffects)
    expect(output.innerType()).toBeInstanceOf(z.ZodType)

    expect(expectedEffect.parse(BINARY)).toBe(ENCODED)
    expect(output.parse(BINARY)).toBe(ENCODED)
  })

  test('returns untransformed zod schema if transform is set but transform is false', () => {
    const transformer = {
      encode: (decoded: Uint8Array) => Buffer.from(decoded).toString('base64'),
      decode: (encoded: string) => new Uint8Array(Buffer.from(encoded, 'base64'))
    }
    const schema = binary().transform(transformer)
    const output = schemaZodParser(schema, { transform: false })
    const expected = z.instanceof(Uint8Array)

    // NOTE: Cannot use A.Equals this because of divergence between Uint8Array & Uint8ArrayConstructor types in latest TS versions
    const assert: A.Contains<typeof expected, typeof output> = 1
    assert

    expect(expected).toBeInstanceOf(z.ZodType)
    expect(output).toBeInstanceOf(z.ZodType)

    expect(expected.parse(BINARY)).toBe(BINARY)
    expect(output.parse(BINARY)).toBe(BINARY)
  })

  test('returns non-optional zod schema if defined is true', () => {
    const schema = binary().optional()
    const output = schemaZodParser(schema, { defined: true })
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
