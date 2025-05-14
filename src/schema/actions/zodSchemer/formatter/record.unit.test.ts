import type { A } from 'ts-toolbelt'
import { z } from 'zod'
import { zerialize } from 'zodex'

import { map, number, record, string } from '~/schema/index.js'
import { prefix } from '~/transformers/prefix.js'

import { compileKeysTransformer } from './record.js'
import { schemaZodFormatter } from './schema.js'

describe('zodSchemer > formatter > record', () => {
  test('returns record zod schema', () => {
    const schema = record(string(), map({ num: number() }))
    const output = schemaZodFormatter(schema)
    const expected = z.record(z.string(), z.object({ num: z.number() }))

    const assert: A.Equals<typeof output, typeof expected> = 1
    assert

    expect(zerialize(output)).toStrictEqual(zerialize(expected))
  })

  test('returns object zod schema if keys are enum', () => {
    const schema = record(string().enum('foo'), number())
    const output = schemaZodFormatter(schema)
    const expected = z.object({ foo: z.number() })

    const assert: A.Equals<typeof output, typeof expected> = 1
    assert

    expect(zerialize(output)).toStrictEqual(zerialize(expected))
  })

  test('returns object zod effects if keys are enum & transformed', () => {
    const transformer = prefix('_', { delimiter: '' })
    const schema = record(string().enum('foo').transform(transformer), number())
    const output = schemaZodFormatter(schema)
    const expectedSchema = z.object({ foo: z.number() })
    const expectedEffect = z.preprocess(compileKeysTransformer(schema), expectedSchema)

    const assert: A.Equals<
      typeof output,
      // NOTE: I couldn't find a way to pass an input type to an effect so I have to re-define one here
      z.ZodEffects<typeof expectedSchema, z.output<typeof expectedSchema>, { _foo: number }>
    > = 1
    assert

    expect(zerialize(output)).toStrictEqual(zerialize(expectedEffect))
  })

  test('returns object zod schema if keys are enum & transformed but transform is false', () => {
    const transformer = prefix('_', { delimiter: '' })
    const schema = record(string().enum('foo').transform(transformer), number())
    const output = schemaZodFormatter(schema, { transform: false })
    const expected = z.object({ foo: z.number() })

    const assert: A.Equals<typeof output, typeof expected> = 1
    assert

    expect(zerialize(output)).toStrictEqual(zerialize(expected))
  })

  test('returns record zod schema with effects as keys if keys are transformed & non-enum', () => {
    const transformer = prefix('_', { delimiter: '' })
    const schema = record(string().transform(transformer), number())
    const output = schemaZodFormatter(schema)
    const expected = z.record(
      z.preprocess(arg => transformer.decode(arg as any), z.string()),
      z.number()
    )

    const assert: A.Equals<
      typeof output,
      // NOTE: I couldn't find a way to pass an input type to an effect so I have to re-define one here
      z.ZodRecord<z.ZodEffects<z.ZodString, string, `_${string}`>, z.ZodNumber>
    > = 1
    assert

    expect(zerialize(output)).toStrictEqual(zerialize(expected))
  })

  test('returns record zod schema with string as keys if keys are transformed & non-enum but transform is false', () => {
    const transformer = prefix('_', { delimiter: '' })
    const schema = record(string().transform(transformer), number())
    const output = schemaZodFormatter(schema, { transform: false })
    const expected = z.record(z.string(), z.number())

    const assert: A.Equals<typeof output, typeof expected> = 1
    assert

    expect(zerialize(output)).toStrictEqual(zerialize(expected))
  })

  test('returns record zod schema if keys are enum but record is partial', () => {
    const schema = record(string().enum('foo', 'bar'), number()).partial()
    const output = schemaZodFormatter(schema)
    const expected = z.record(z.enum(['foo', 'bar']), z.number())

    const assert: A.Equals<typeof output, typeof expected> = 1
    assert

    expect(zerialize(output)).toStrictEqual(zerialize(expected))
  })

  test('returns optional zod schema', () => {
    const schema = record(string(), map({ num: number() })).optional()
    const output = schemaZodFormatter(schema)
    const expected = z.record(z.string(), z.object({ num: z.number() })).optional()

    const assert: A.Equals<typeof output, typeof expected> = 1
    assert

    expect(zerialize(output)).toStrictEqual(zerialize(expected))
  })

  test('returns optional & partial zod schema if partial is true', () => {
    const schema = record(string(), map({ num: number() }))
    const output = schemaZodFormatter(schema, { partial: true })
    const expected = z.record(z.string(), z.object({ num: z.number() }).partial()).optional()

    const assert: A.Equals<typeof output, typeof expected> = 1
    assert

    expect(zerialize(output)).toStrictEqual(zerialize(expected))
  })

  test('returns non-optional & partial zod schema if partial is true but defined is true', () => {
    const schema = record(string(), map({ num: number() }))
    const output = schemaZodFormatter(schema, { partial: true, defined: true })
    const expected = z.record(z.string(), z.object({ num: z.number() }).partial())

    const assert: A.Equals<typeof output, typeof expected> = 1
    assert

    expect(zerialize(output)).toStrictEqual(zerialize(expected))
  })
})
