import type { A } from 'ts-toolbelt'
import { z } from 'zod'

import {
  AnyOfSchema_,
  NumberSchema_,
  StringSchema_,
  anyOf,
  number,
  string
} from '~/schema/index.js'

import { fromZodSchema } from './fromZodSchema.js'

describe('fromZodSchema > union', () => {
  test('returns an anyOf schema', () => {
    const schema = z.union([z.string(), z.number()])
    const output = fromZodSchema(schema)
    const expected = anyOf(string(), number())

    const assert: A.Equals<typeof output, typeof expected> = 1
    assert

    expect(output).toBeInstanceOf(AnyOfSchema_)
    expect(output.elements).toHaveLength(2)
    expect(output.elements[0]).toBeInstanceOf(StringSchema_)
    expect(output.elements[1]).toBeInstanceOf(NumberSchema_)
  })
})
