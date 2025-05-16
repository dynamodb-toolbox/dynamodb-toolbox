import type { A } from 'ts-toolbelt'
import { z } from 'zod'

import { map, number, record, string } from '~/schema/index.js'
import { prefix } from '~/transformers/prefix.js'

import { compileKeysDecoder } from './record.js'
import { schemaZodFormatter } from './schema.js'

const VALUE = { foo: 42 }

describe('zodSchemer > formatter > record', () => {
  test('returns record zod schema', () => {
    const schema = record(string(), number())
    const output = schemaZodFormatter(schema)
    const expected = z.record(z.string(), z.number())

    const assert: A.Equals<typeof output, typeof expected> = 1
    assert

    expect(expected).toBeInstanceOf(z.ZodRecord)
    expect(expected.keySchema).toBeInstanceOf(z.ZodString)
    expect(expected.valueSchema).toBeInstanceOf(z.ZodNumber)
    expect(output).toBeInstanceOf(z.ZodRecord)
    expect(output.keySchema).toBeInstanceOf(z.ZodString)
    expect(output.valueSchema).toBeInstanceOf(z.ZodNumber)

    expect(expected.parse(VALUE)).toStrictEqual(VALUE)
    expect(output.parse(VALUE)).toStrictEqual(VALUE)

    expect(() => expected.parse(undefined)).toThrow()
    expect(() => output.parse(undefined)).toThrow()
  })

  test('returns object zod schema if keys are enum', () => {
    const schema = record(string().enum('foo'), number())
    const output = schemaZodFormatter(schema)
    const expected = z.object({ foo: z.number() })

    const assert: A.Equals<typeof output, typeof expected> = 1
    assert

    expect(expected).toBeInstanceOf(z.ZodObject)
    expect(expected.shape.foo).toBeInstanceOf(z.ZodNumber)
    expect(output).toBeInstanceOf(z.ZodObject)
    expect(output.shape.foo).toBeInstanceOf(z.ZodNumber)

    expect(expected.parse(VALUE)).toStrictEqual(VALUE)
    expect(output.parse(VALUE)).toStrictEqual(VALUE)

    expect(() => expected.parse(undefined)).toThrow()
    expect(() => output.parse(undefined)).toThrow()
  })

  test('returns record zod schema if keys are enum but record is partial', () => {
    const schema = record(string().enum('foo', 'bar'), number()).partial()
    const output = schemaZodFormatter(schema)
    const expected = z.record(z.enum(['foo', 'bar']), z.number())

    const assert: A.Equals<typeof output, typeof expected> = 1
    assert

    expect(expected).toBeInstanceOf(z.ZodRecord)
    expect(expected.keySchema).toBeInstanceOf(z.ZodEnum)
    expect(expected.keySchema.options).toStrictEqual(['foo', 'bar'])
    expect(expected.valueSchema).toBeInstanceOf(z.ZodNumber)
    expect(output).toBeInstanceOf(z.ZodRecord)
    expect(output.keySchema).toBeInstanceOf(z.ZodEnum)
    expect(output.keySchema.options).toStrictEqual(['foo', 'bar'])
    expect(output.valueSchema).toBeInstanceOf(z.ZodNumber)
  })

  describe('optionality', () => {
    test('returns optional zod schema', () => {
      const schema = record(string(), number()).optional()
      const output = schemaZodFormatter(schema)
      const expected = z.record(z.string(), z.number()).optional()

      const assert: A.Equals<typeof output, typeof expected> = 1
      assert

      expect(expected).toBeInstanceOf(z.ZodOptional)
      expect(expected.unwrap()).toBeInstanceOf(z.ZodRecord)
      expect(expected.unwrap().keySchema).toBeInstanceOf(z.ZodString)
      expect(expected.unwrap().valueSchema).toBeInstanceOf(z.ZodNumber)
      expect(output).toBeInstanceOf(z.ZodOptional)
      expect(output.unwrap()).toBeInstanceOf(z.ZodRecord)
      expect(output.unwrap().keySchema).toBeInstanceOf(z.ZodString)
      expect(output.unwrap().valueSchema).toBeInstanceOf(z.ZodNumber)

      expect(expected.parse(undefined)).toStrictEqual(undefined)
      expect(output.parse(undefined)).toStrictEqual(undefined)
    })

    test('returns non-optional zod schema if defined is true', () => {
      const schema = record(string(), number()).optional()
      const output = schemaZodFormatter(schema, { defined: true })
      const expected = z.record(z.string(), z.number())

      const assert: A.Equals<typeof output, typeof expected> = 1
      assert

      expect(expected).toBeInstanceOf(z.ZodRecord)
      expect(expected.keySchema).toBeInstanceOf(z.ZodString)
      expect(expected.valueSchema).toBeInstanceOf(z.ZodNumber)
      expect(output).toBeInstanceOf(z.ZodRecord)
      expect(output.keySchema).toBeInstanceOf(z.ZodString)
      expect(output.valueSchema).toBeInstanceOf(z.ZodNumber)

      expect(() => expected.parse(undefined)).toThrow()
      expect(() => output.parse(undefined)).toThrow()
    })
  })

  describe('encoding/decoding', () => {
    test('returns object zod effects if keys are enum & transformed', () => {
      const transformer = prefix('_', { delimiter: '' })
      const schema = record(string().enum('foo').transform(transformer), number())
      const output = schemaZodFormatter(schema)
      const expectedSchema = z.object({ foo: z.number() })
      const expectedEffect = z.preprocess(compileKeysDecoder(schema), expectedSchema)

      const assert: A.Equals<
        typeof output,
        // NOTE: I couldn't find a way to pass an input type to an effect so I have to re-define one here
        z.ZodEffects<typeof expectedSchema, z.output<typeof expectedSchema>, { _foo: number }>
      > = 1
      assert

      expect(expectedEffect).toBeInstanceOf(z.ZodEffects)
      expect(expectedEffect.innerType()).toBeInstanceOf(z.ZodObject)
      expect(expectedEffect.innerType().shape.foo).toBeInstanceOf(z.ZodNumber)
      expect(output).toBeInstanceOf(z.ZodEffects)
      expect(output.innerType()).toBeInstanceOf(z.ZodObject)
      expect(output.innerType().shape.foo).toBeInstanceOf(z.ZodNumber)

      const RENAMED_VALUE = { _foo: 42 }

      expect(expectedEffect.parse(RENAMED_VALUE)).toStrictEqual(VALUE)
      expect(output.parse(RENAMED_VALUE)).toStrictEqual(VALUE)
    })

    test('returns object zod schema if keys are enum & transformed but transform is false', () => {
      const transformer = prefix('_', { delimiter: '' })
      const schema = record(string().enum('foo').transform(transformer), number())
      const output = schemaZodFormatter(schema, { transform: false })
      const expected = z.object({ foo: z.number() })

      const assert: A.Equals<typeof output, typeof expected> = 1
      assert

      expect(expected).toBeInstanceOf(z.ZodObject)
      expect(expected.shape.foo).toBeInstanceOf(z.ZodNumber)
      expect(output).toBeInstanceOf(z.ZodObject)
      expect(output.shape.foo).toBeInstanceOf(z.ZodNumber)

      expect(expected.parse(VALUE)).toStrictEqual(VALUE)
      expect(output.parse(VALUE)).toStrictEqual(VALUE)
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

      expect(expected).toBeInstanceOf(z.ZodRecord)
      expect(expected.keySchema).toBeInstanceOf(z.ZodEffects)
      expect(expected.keySchema.innerType()).toBeInstanceOf(z.ZodString)
      expect(expected.valueSchema).toBeInstanceOf(z.ZodNumber)
      expect(output).toBeInstanceOf(z.ZodRecord)
      expect(output.keySchema).toBeInstanceOf(z.ZodEffects)
      expect(output.keySchema.innerType()).toBeInstanceOf(z.ZodString)

      expect(output.valueSchema).toBeInstanceOf(z.ZodNumber)

      const RENAMED_VALUE = { _foo: 42 }

      expect(expected.parse(RENAMED_VALUE)).toStrictEqual(VALUE)
      expect(output.parse(RENAMED_VALUE)).toStrictEqual(VALUE)
    })

    test('returns record zod schema with string as keys if keys are transformed & non-enum but transform is false', () => {
      const transformer = prefix('_', { delimiter: '' })
      const schema = record(string().transform(transformer), number())
      const output = schemaZodFormatter(schema, { transform: false })
      const expected = z.record(z.string(), z.number())

      const assert: A.Equals<typeof output, typeof expected> = 1
      assert

      expect(expected).toBeInstanceOf(z.ZodRecord)
      expect(expected.keySchema).toBeInstanceOf(z.ZodString)
      expect(expected.valueSchema).toBeInstanceOf(z.ZodNumber)
      expect(output).toBeInstanceOf(z.ZodRecord)
      expect(output.keySchema).toBeInstanceOf(z.ZodString)
      expect(output.valueSchema).toBeInstanceOf(z.ZodNumber)
    })
  })

  describe('partiality', () => {
    test('returns optional & partial zod schema if partial is true', () => {
      const schema = record(string(), map({ foo: number() }))
      const output = schemaZodFormatter(schema, { partial: true })
      const expected = z.record(z.string(), z.object({ foo: z.number() }).partial()).optional()

      const assert: A.Equals<typeof output, typeof expected> = 1
      assert

      expect(expected).toBeInstanceOf(z.ZodOptional)
      expect(expected.unwrap()).toBeInstanceOf(z.ZodRecord)
      expect(expected.unwrap().keySchema).toBeInstanceOf(z.ZodString)
      expect(expected.unwrap().valueSchema).toBeInstanceOf(z.ZodObject)
      expect(expected.unwrap().valueSchema.shape.foo).toBeInstanceOf(z.ZodOptional)
      expect(expected.unwrap().valueSchema.shape.foo.unwrap()).toBeInstanceOf(z.ZodNumber)
      expect(output).toBeInstanceOf(z.ZodOptional)
      expect(output.unwrap()).toBeInstanceOf(z.ZodRecord)
      expect(output.unwrap().keySchema).toBeInstanceOf(z.ZodString)
      expect(output.unwrap().valueSchema).toBeInstanceOf(z.ZodObject)
      expect(output.unwrap().valueSchema.shape.foo).toBeInstanceOf(z.ZodOptional)
      expect(output.unwrap().valueSchema.shape.foo.unwrap()).toBeInstanceOf(z.ZodNumber)

      expect(expected.parse(undefined)).toStrictEqual(undefined)
      expect(output.parse(undefined)).toStrictEqual(undefined)
    })

    test('returns non-optional & partial zod schema if partial and defined are true', () => {
      const schema = record(string(), map({ foo: number() }))
      const output = schemaZodFormatter(schema, { partial: true, defined: true })
      const expected = z.record(z.string(), z.object({ foo: z.number() }).partial())

      const assert: A.Equals<typeof output, typeof expected> = 1
      assert

      expect(expected).toBeInstanceOf(z.ZodRecord)
      expect(expected.keySchema).toBeInstanceOf(z.ZodString)
      expect(expected.valueSchema).toBeInstanceOf(z.ZodObject)
      expect(expected.valueSchema.shape.foo).toBeInstanceOf(z.ZodOptional)
      expect(expected.valueSchema.shape.foo.unwrap()).toBeInstanceOf(z.ZodNumber)
      expect(output).toBeInstanceOf(z.ZodRecord)
      expect(output.keySchema).toBeInstanceOf(z.ZodString)
      expect(output.valueSchema).toBeInstanceOf(z.ZodObject)
      expect(output.valueSchema.shape.foo).toBeInstanceOf(z.ZodOptional)
      expect(output.valueSchema.shape.foo.unwrap()).toBeInstanceOf(z.ZodNumber)

      expect(() => expected.parse(undefined)).toThrow()
      expect(() => output.parse(undefined)).toThrow()
    })
  })
})
