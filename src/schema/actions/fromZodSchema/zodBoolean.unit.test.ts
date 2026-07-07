import type { A } from 'ts-toolbelt'
import { z } from 'zod'

import { BooleanSchema_, boolean } from '~/schema/index.js'

import { fromZodSchema } from './fromZodSchema.js'

describe('fromZodSchema > zodBoolean', () => {
  test('returns boolean zod schema', () => {
    const schema = z.boolean()
    const output = fromZodSchema(schema)
    const expected = boolean()

    const assert: A.Equals<typeof output, typeof expected> = 1
    assert

    expect(output).toBeInstanceOf(BooleanSchema_)
  })
})
