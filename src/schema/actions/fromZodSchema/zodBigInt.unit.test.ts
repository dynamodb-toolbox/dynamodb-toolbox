import type { A } from 'ts-toolbelt'
import { z } from 'zod'

import { NumberSchema_, number } from '~/schema/index.js'

import { fromZodSchema } from './fromZodSchema.js'

describe('fromZodSchema > zodBigInt', () => {
  test('returns big number schema', () => {
    const schema = z.bigint()
    const output = fromZodSchema(schema)
    const expected = number().big()

    const assert: A.Equals<typeof output, typeof expected> = 1
    assert

    expect(output).toBeInstanceOf(NumberSchema_)
    expect(output.props.big).toBe(true)
  })
})
