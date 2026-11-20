import * as mini from 'zod/v4/mini'
import type { A } from 'ts-toolbelt'
import { z } from 'zod/v4'

import { DynamoDBToolboxError } from '~/errors/index.js'
import { Parser } from '~/schema/actions/parse/index.js'
import { AnySchema_, StringSchema_, any, string } from '~/schema/index.js'

import { fromZodSchema } from './fromZodSchema.js'

describe('fromZodSchema(v4)', () => {
  test('converts zod mini schemas', () => {
    const output = fromZodSchema(mini.string())
    const expected = string()

    const assert: A.Equals<typeof output, typeof expected> = 1
    assert

    expect(output).toBeInstanceOf(StringSchema_)
  })

  test('carries the whole meta store', () => {
    const output = fromZodSchema(z.string().meta({ title: 'Title', id: 'foo' }))

    expect((output.props as { meta?: unknown }).meta).toStrictEqual({ title: 'Title', id: 'foo' })
  })

  test('maps refinements to a validator', () => {
    const output = fromZodSchema(z.string().refine(value => value === 'foo', 'Must be foo'))

    expect(output).toBeInstanceOf(StringSchema_)
    // putValidator is an anonymous fn
    expect((output.props as { putValidator?: unknown }).putValidator).toStrictEqual(
      expect.any(Function)
    )
    expect(output.build(Parser).parse('foo')).toBe('foo')
    // zod's own issue messages are what the DDB-TB error reports
    expect(() => output.build(Parser).parse('bar')).toThrow(
      expect.objectContaining({
        code: 'parsing.customValidationFailed',
        payload: { received: 'bar', validationResult: 'Must be foo' }
      })
    )
  })

  test('maps checks to a validator', () => {
    const output = fromZodSchema(z.string().min(2))

    expect(output.build(Parser).parse('foo')).toBe('foo')
    expect(() => output.build(Parser).parse('f')).toThrow(DynamoDBToolboxError)
  })

  test('maps the refinements of a nested schema', () => {
    const output = fromZodSchema(z.object({ foo: z.string().min(2) }))

    expect(output.build(Parser).parse({ foo: 'bar' })).toStrictEqual({ foo: 'bar' })
    expect(() => output.build(Parser).parse({ foo: 'b' })).toThrow(DynamoDBToolboxError)
  })

  test('maps the refinements of a container itself', () => {
    const output = fromZodSchema(
      z.object({ foo: z.string(), bar: z.string() }).refine(({ foo, bar }) => foo === bar)
    )

    expect(output.build(Parser).parse({ foo: 'a', bar: 'a' })).toStrictEqual({ foo: 'a', bar: 'a' })
    expect(() => output.build(Parser).parse({ foo: 'a', bar: 'b' })).toThrow(DynamoDBToolboxError)
  })

  test('leaves a schema with no check unvalidated', () => {
    const output = fromZodSchema(z.string())

    expect((output.props as { putValidator?: unknown }).putValidator).toBeUndefined()
  })

  test('degrades unsupported schemas to casted any schemas', () => {
    const output = fromZodSchema(z.date())
    const expected = any().castAs<Date>()

    const assert: A.Equals<typeof output, typeof expected> = 1
    assert

    expect(output).toBeInstanceOf(AnySchema_)
  })
})
