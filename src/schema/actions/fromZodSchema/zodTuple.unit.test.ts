import type { A } from 'ts-toolbelt'
import { z } from 'zod'

import {
  NumberSchema_,
  StringSchema_,
  TupleSchema_,
  number,
  string,
  tuple
} from '~/schema/index.js'

import { fromZodSchema } from './fromZodSchema.js'

describe('fromZodSchema > zodTuple', () => {
  test('returns tuple schema', () => {
    const schema = z.tuple([z.string(), z.number()])
    const output = fromZodSchema(schema)
    const expected = tuple(string(), number())

    const assert: A.Equals<typeof output, typeof expected> = 1
    assert

    expect(output).toBeInstanceOf(TupleSchema_)
    expect(output.elements[0]).toBeInstanceOf(StringSchema_)
    expect(output.elements[1]).toBeInstanceOf(NumberSchema_)
  })
})
