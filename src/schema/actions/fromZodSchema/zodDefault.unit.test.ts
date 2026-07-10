import type { A } from 'ts-toolbelt'
import { z } from 'zod'

import { AnySchema_, any } from '~/schema/index.js'

import { fromZodSchema } from './fromZodSchema.js'

const VALUE = { foo: 'bar' }

describe('fromZodSchema > zodDefault', () => {
  test('returns defaulted schema', () => {
    const schema = z.custom().default(VALUE)
    const output = fromZodSchema(schema)
    const expected = any().default(VALUE)

    const assert: A.Equals<typeof output, typeof expected> = 1
    assert

    expect(output).toBeInstanceOf(AnySchema_)
    expect(output.props.putDefault).toStrictEqual(VALUE)
  })
})
