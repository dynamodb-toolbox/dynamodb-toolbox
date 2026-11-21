import type { A } from 'ts-toolbelt'
import { z } from 'zod/v4'

import { DynamoDBToolboxError } from '~/errors/index.js'
import {
  NumberSchema_,
  RecordSchema_,
  StringSchema_,
  number,
  record,
  string
} from '~/schema/index.js'

import { fromZodSchema } from './fromZodSchema.js'

enum NumericEnum {
  foo = 1,
  bar = 2
}

describe('fromZodSchema(v4) > zodRecord', () => {
  test('returns record schema', () => {
    const schema = z.record(z.string(), z.number())
    const output = fromZodSchema(schema)
    const expected = record(string(), number())

    const assert: A.Equals<typeof output, typeof expected> = 1
    assert

    expect(output).toBeInstanceOf(RecordSchema_)
    expect(output.keys).toBeInstanceOf(StringSchema_)
    expect(output.elements).toBeInstanceOf(NumberSchema_)
  })

  test('returns record schema with enum keys if keys are enum', () => {
    const output = fromZodSchema(z.record(z.enum(['foo', 'bar']), z.number()))

    expect(output).toBeInstanceOf(RecordSchema_)
    expect(output.keys).toBeInstanceOf(StringSchema_)
    expect(output.keys.props.enum).toStrictEqual(['foo', 'bar'])
    expect(output.elements).toBeInstanceOf(NumberSchema_)
  })

  test('throws if keys are not strings', () => {
    const invalidCall = () => fromZodSchema(z.record(z.number(), z.string()))

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(
      expect.objectContaining({ code: 'fromZodSchema.unsupportedRecordKeyType' })
    )
  })

  test('throws if keys are a numeric enum', () => {
    const invalidCall = () => fromZodSchema(z.record(z.enum(NumericEnum), z.string()))

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(
      expect.objectContaining({ code: 'fromZodSchema.unsupportedRecordKeyType' })
    )
  })

  test('throws if keys are defaulted', () => {
    const invalidCall = () => fromZodSchema(z.record(z.string().default('foo'), z.string()))

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(
      expect.objectContaining({ code: 'fromZodSchema.unsupportedRecordKeyType' })
    )
  })

  test('maps a description to meta.description', () => {
    const output = fromZodSchema(z.record(z.string(), z.string()).describe('Desc'))

    expect((output.props as { meta?: unknown }).meta).toStrictEqual({ description: 'Desc' })
  })
})
