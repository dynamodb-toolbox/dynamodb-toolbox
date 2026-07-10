import type { A } from 'ts-toolbelt'
import { z } from 'zod'

import { ListSchema_, StringSchema, list, string } from '~/schema/index.js'

import { fromZodSchema } from './fromZodSchema.js'

describe('fromZodSchema > zodArray', () => {
  test('returns a list', () => {
    const schema = z.array(z.string())
    const output = fromZodSchema(schema)
    const expected = list(string())

    const assert: A.Equals<typeof output, typeof expected> = 1
    assert

    expect(output).toBeInstanceOf(ListSchema_)
    expect(output.elements).toBeInstanceOf(StringSchema)
  })
})
