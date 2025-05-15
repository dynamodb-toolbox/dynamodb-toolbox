import { z } from 'zod'
import { zerialize } from 'zodex'

import { binary } from '~/schema/index.js'

import { schemaZodFormatter } from './schema.js'

describe('zodSchemer > formatter > binary', () => {
  test('returns instanceof zod schema', () => {
    const schema = binary()
    const output = schemaZodFormatter(schema)
    const expected = z.instanceof(Uint8Array)

    // NOTE: Cannot test this atm because Uint8Array is generic in latest TS versions
    // const assert: A.Contains<typeof output, typeof expected> = 1
    // assert

    // `instanceof` is not supported by zodex
    expect(zerialize(output as any)).toStrictEqual(zerialize(expected as any))
  })

  test('returns optional zod schema', () => {
    const schema = binary().optional()
    const output = schemaZodFormatter(schema)
    const expected = z.instanceof(Uint8Array).optional()

    // NOTE: Cannot test this atm because Uint8Array is generic in latest TS versions
    // const assert: A.Contains<typeof output, typeof expected> = 1
    // assert

    // `instanceof` is not supported by zodex
    expect(zerialize(output as any)).toStrictEqual(zerialize(expected as any))
  })

  test('returns zod effect if transform is set', () => {
    const transformer = {
      encode: (decoded: Uint8Array) => Buffer.from(decoded).toString('base64'),
      decode: (encoded: string) => new Uint8Array(Buffer.from(encoded, 'base64'))
    }
    const schema = binary().transform(transformer)
    const output = schemaZodFormatter(schema)
    const expectedSchema = z.instanceof(Uint8Array)
    const expectedEffect = z.preprocess(arg => transformer.decode(arg as any), expectedSchema)

    // NOTE: Cannot test this atm because Uint8Array is generic in latest TS versions
    // const assert: A.Equals<
    //   typeof output,
    //   // NOTE: I couldn't find a way to pass an input type to an effect so I have to re-define one here
    //   z.ZodEffects<typeof expectedSchema, z.output<typeof expectedSchema>, string>
    // > = 1
    // assert

    expect(output.parse('AQ==')).toBeInstanceOf(Uint8Array)
    expect([...output.parse('AQ==')]).toStrictEqual([1])
    expect(expectedEffect.parse('AQ==')).toBeInstanceOf(Uint8Array)
    expect([...expectedEffect.parse('AQ==')]).toStrictEqual([1])
  })

  test('returns untransformed zod schema if transform is set but transform is false', () => {
    const transformer = {
      encode: (decoded: Uint8Array) => Buffer.from(decoded).toString('base64'),
      decode: (encoded: string) => new Uint8Array(Buffer.from(encoded, 'base64'))
    }
    const schema = binary().transform(transformer)
    const output = schemaZodFormatter(schema, { transform: false })
    const expected = z.instanceof(Uint8Array)

    // NOTE: Cannot test this atm because Uint8Array is generic in latest TS versions
    // const assert: A.Equals<typeof output, typeof expected> = 1
    // assert

    expect([...output.parse(new Uint8Array([1]))]).toStrictEqual([1])
    expect([...expected.parse(new Uint8Array([1]))]).toStrictEqual([1])
  })

  test('returns optional zod schema if partial is true', () => {
    const schema = binary()
    const output = schemaZodFormatter(schema, { partial: true })
    const expected = z.instanceof(Uint8Array).optional()

    // NOTE: Cannot test this atm because Uint8Array is generic in latest TS versions
    // const assert: A.Contains<typeof output, typeof expected> = 1
    // assert

    // `instanceof` is not supported by zodex
    expect(zerialize(output as any)).toStrictEqual(zerialize(expected as any))
  })

  test('returns non-optional zod schema if partial is true but defined is true', () => {
    const schema = binary()
    const output = schemaZodFormatter(schema, { partial: true, defined: true })
    const expected = z.instanceof(Uint8Array)

    // NOTE: Cannot test this atm because Uint8Array is generic in latest TS versions
    // const assert: A.Contains<typeof output, typeof expected> = 1
    // assert

    // `instanceof` is not supported by zodex
    expect(zerialize(output as any)).toStrictEqual(zerialize(expected as any))
  })
})
