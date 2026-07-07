import type { A } from 'ts-toolbelt'
import { z } from 'zod'

import { AnySchema_, any } from '~/schema/index.js'

import { fromZodSchema } from './fromZodSchema.js'

describe('fromZodSchema > zodOptional', () => {
  test('returns optional schema', () => {
    const schema = z.custom().optional()
    const output = fromZodSchema(schema)
    const expected = any().optional()

    const assert: A.Equals<typeof output, typeof expected> = 1
    assert

    expect(output).toBeInstanceOf(AnySchema_)
    expect(output.props.required).toBe('never')
  })
})
