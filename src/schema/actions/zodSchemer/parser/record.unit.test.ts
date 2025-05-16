import type { A } from 'ts-toolbelt'
import { z } from 'zod'

import { number, record, string } from '~/schema/index.js'
import { prefix } from '~/transformers/prefix.js'

import { compileKeysEncoder } from './record.js'
import { schemaZodParser } from './schema.js'

const VALUE = { foo: 42 }

describe('zodSchemer > parser > record', () => {
  test('returns record zod schema', () => {
    const schema = record(string(), number())
    const output = schemaZodParser(schema)
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
    const output = schemaZodParser(schema)
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
    const output = schemaZodParser(schema)
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

  test('returns optional zod schema', () => {
    const schema = record(string(), number()).optional()
    const output = schemaZodParser(schema)
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

    expect(expected.parse(VALUE)).toStrictEqual(VALUE)
    expect(output.parse(VALUE)).toStrictEqual(VALUE)

    expect(expected.parse(undefined)).toStrictEqual(undefined)
    expect(output.parse(undefined)).toStrictEqual(undefined)
  })

  describe('defaults', () => {
    test('returns defaulted zod schema', () => {
      const schema = record(string(), number()).default(VALUE)
      const output = schemaZodParser(schema)
      const expected = z.record(z.string(), z.number()).default(VALUE)

      const assert: A.Equals<typeof output, typeof expected> = 1
      assert

      expect(expected).toBeInstanceOf(z.ZodDefault)
      expect(expected.removeDefault()).toBeInstanceOf(z.ZodRecord)
      expect(expected.removeDefault().keySchema).toBeInstanceOf(z.ZodString)
      expect(expected.removeDefault().valueSchema).toBeInstanceOf(z.ZodNumber)
      expect(output).toBeInstanceOf(z.ZodDefault)
      expect(output.removeDefault()).toBeInstanceOf(z.ZodRecord)
      expect(output.removeDefault().keySchema).toBeInstanceOf(z.ZodString)
      expect(output.removeDefault().valueSchema).toBeInstanceOf(z.ZodNumber)

      expect(expected.parse(undefined)).toStrictEqual(VALUE)
      expect(output.parse(undefined)).toStrictEqual(VALUE)
    })

    test('returns defaulted zod schema (key)', () => {
      const schema = record(string(), number()).key().default(VALUE)
      const output = schemaZodParser(schema)
      const expected = z.record(z.string(), z.number()).default(VALUE)

      const assert: A.Equals<typeof output, typeof expected> = 1
      assert

      expect(expected).toBeInstanceOf(z.ZodDefault)
      expect(expected.removeDefault()).toBeInstanceOf(z.ZodRecord)
      expect(expected.removeDefault().keySchema).toBeInstanceOf(z.ZodString)
      expect(expected.removeDefault().valueSchema).toBeInstanceOf(z.ZodNumber)
      expect(output).toBeInstanceOf(z.ZodDefault)
      expect(output.removeDefault()).toBeInstanceOf(z.ZodRecord)
      expect(output.removeDefault().keySchema).toBeInstanceOf(z.ZodString)
      expect(output.removeDefault().valueSchema).toBeInstanceOf(z.ZodNumber)

      expect(expected.parse(undefined)).toStrictEqual(VALUE)
      expect(output.parse(undefined)).toStrictEqual(VALUE)
    })

    test('returns non-defaulted zod schema if fill is false', () => {
      const schema = record(string(), number()).key().default(VALUE)
      const output = schemaZodParser(schema, { fill: false })
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

  test('returns object zod effects if keys are enum & transformed', () => {
    const transformer = prefix('_', { delimiter: '' })
    const schema = record(string().enum('foo').transform(transformer), number())
    const output = schemaZodParser(schema)
    const expectedSchema = z.object({ foo: z.number() })
    const expectedEffect = expectedSchema.transform(compileKeysEncoder(schema))

    const assert: A.Equals<
      typeof output,
      // NOTE: I couldn't find a way to pass an input type to an effect so I have to re-define one here
      z.ZodEffects<typeof expectedSchema, { _foo: number }, z.input<typeof expectedSchema>>
    > = 1
    assert

    expect(expectedEffect).toBeInstanceOf(z.ZodEffects)
    expect(expectedEffect.innerType()).toBeInstanceOf(z.ZodObject)
    expect(expectedEffect.innerType().shape.foo).toBeInstanceOf(z.ZodNumber)
    expect(output).toBeInstanceOf(z.ZodEffects)
    expect(output.innerType()).toBeInstanceOf(z.ZodObject)
    expect(output.innerType().shape.foo).toBeInstanceOf(z.ZodNumber)

    const RENAMED_VALUE = { _foo: 42 }

    expect(expectedEffect.parse(VALUE)).toStrictEqual(RENAMED_VALUE)
    expect(output.parse(VALUE)).toStrictEqual(RENAMED_VALUE)
  })

  test('returns object zod schema if keys are enum & transformed but transform is false', () => {
    const transformer = prefix('_', { delimiter: '' })
    const schema = record(string().enum('foo').transform(transformer), number())
    const output = schemaZodParser(schema, { transform: false })
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
    const output = schemaZodParser(schema)
    const expected = z.record(
      z.string().transform(arg => transformer.encode(arg as any)),
      z.number()
    )

    const assert: A.Equals<
      typeof output,
      // NOTE: I couldn't find a way to pass an input type to an effect so I have to re-define one here
      z.ZodRecord<z.ZodEffects<z.ZodString, `_${string}`, string>, z.ZodNumber>
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

    expect(expected.parse(VALUE)).toStrictEqual(RENAMED_VALUE)
    expect(output.parse(VALUE)).toStrictEqual(RENAMED_VALUE)
  })

  test('returns record zod schema with string as keys if keys are transformed & non-enum but transform is false', () => {
    const transformer = prefix('_', { delimiter: '' })
    const schema = record(string().transform(transformer), number())
    const output = schemaZodParser(schema, { transform: false })
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
  })

  test('returns non-optional zod schema if defined is true', () => {
    const schema = record(string(), number()).optional()
    const output = schemaZodParser(schema, { defined: true })
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
