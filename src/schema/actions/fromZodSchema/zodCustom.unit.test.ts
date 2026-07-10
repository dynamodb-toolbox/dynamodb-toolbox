import type { A } from 'ts-toolbelt'
import { z } from 'zod'

import { AnySchema_, any } from '~/schema/index.js'

import { fromZodSchema } from './fromZodSchema.js'

describe('fromZodSchema > any', () => {
  test('returns any schema', () => {
    const schema = z.custom()
    const output = fromZodSchema(schema)
    const expected = any()

    const assert: A.Equals<typeof output, typeof expected> = 1
    assert

    expect(output).toBeInstanceOf(AnySchema_)
  })

  test('returns casted any schema', () => {
    const schema = z.custom<{ foo: 'bar' }>()
    const output = fromZodSchema(schema)
    const expected = any().castAs<{ foo: 'bar' }>()

    const assert: A.Equals<typeof output, typeof expected> = 1
    assert

    expect(output).toBeInstanceOf(AnySchema_)
  })
})
