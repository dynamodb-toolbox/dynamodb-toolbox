import type { A } from 'ts-toolbelt'
import { z } from 'zod'

import { Parser } from '~/schema/actions/parse/index.js'
import { AnySchema_, StringSchema_, any, string } from '~/schema/index.js'

import { fromZodSchema } from './fromZodSchema.js'

describe('fromZodSchema > zodEffects', () => {
  test('returns validated schema if zodEffects is a refinment', () => {
    const validator = (candidate: unknown) => candidate === 'hello'
    const schema = z.custom().refine(validator)
    const output = fromZodSchema(schema)
    const expected = any().validate(validator)

    const assert: A.Equals<typeof output, typeof expected> = 1
    assert

    expect(output).toBeInstanceOf(AnySchema_)
    expect(output.props.putValidator).toStrictEqual(expect.any(Function)) // putValidator is an anonymous fn
  })

  test('returns non-transformed schema if zodEffects is a transform', () => {
    const schema = z.string().transform(value => value.trim())
    const output = fromZodSchema(schema)
    const expected = string().validate(() => true)

    const assert: A.Equals<typeof output, typeof expected> = 1
    assert

    expect(output).toBeInstanceOf(StringSchema_)
    expect(output.props.putValidator).toBeUndefined()

    expect(output.build(Parser).parse(' foo ')).toBe(' foo ')
  })
})
