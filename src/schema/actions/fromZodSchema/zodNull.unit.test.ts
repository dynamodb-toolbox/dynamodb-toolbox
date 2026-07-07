import type { A } from 'ts-toolbelt'
import { z } from 'zod'

import { NullSchema_, nul } from '~/schema/index.js'

import { fromZodSchema } from './fromZodSchema.js'

describe('fromZodSchema > zodNull', () => {
  test('returns nul schema', () => {
    const schema = z.null()
    const output = fromZodSchema(schema)
    const expected = nul()

    const assert: A.Equals<typeof output, typeof expected> = 1
    assert

    expect(output).toBeInstanceOf(NullSchema_)
  })
})
