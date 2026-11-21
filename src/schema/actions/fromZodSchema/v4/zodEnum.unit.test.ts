import type { A } from 'ts-toolbelt'
import { z } from 'zod/v4'

import { DynamoDBToolboxError } from '~/errors/index.js'
import { NumberSchema_, StringSchema_ } from '~/schema/index.js'

import { fromZodSchema } from './fromZodSchema.js'

enum NumericEnum {
  foo = 1,
  bar = 2
}

enum MixedEnum {
  foo = 'foo',
  bar = 2
}

describe('fromZodSchema(v4) > zodEnum', () => {
  test('returns string enum', () => {
    const output = fromZodSchema(z.enum(['foo', 'bar']))

    const assert: A.Equals<typeof output.props.enum, ('foo' | 'bar')[]> = 1
    assert

    expect(output).toBeInstanceOf(StringSchema_)
    expect(output.props.enum).toStrictEqual(['foo', 'bar'])
  })

  test('returns number enum from a numeric native enum', () => {
    const output = fromZodSchema(z.enum(NumericEnum))

    expect(output).toBeInstanceOf(NumberSchema_)
    expect(output.props.enum).toStrictEqual([NumericEnum.foo, NumericEnum.bar])
  })

  test('maps a description to meta.description', () => {
    const output = fromZodSchema(z.enum(['foo', 'bar']).describe('Desc'))

    expect((output.props as { meta?: unknown }).meta).toStrictEqual({ description: 'Desc' })
  })

  test('throws if the enum mixes strings and numbers', () => {
    const invalidCall = () => fromZodSchema(z.enum(MixedEnum))

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(expect.objectContaining({ code: 'fromZodSchema.unrecognizedEnum' }))
  })

  test('throws if the enum is empty', () => {
    const invalidCall = () => fromZodSchema(z.enum([]))

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(expect.objectContaining({ code: 'fromZodSchema.unrecognizedEnum' }))
  })
})
