import type { A } from 'ts-toolbelt'
import { z } from 'zod'

import {
  NumberSchema_,
  RecordSchema_,
  StringSchema_,
  number,
  record,
  string
} from '~/schema/index.js'

import { fromZodSchema } from './fromZodSchema.js'

describe('fromZodSchema > zodRecord', () => {
  test('returns record schema', () => {
    const schema = z.record(z.string(), z.number())
    const output = fromZodSchema(schema)
    const expected = record(string(), number())

    const assert: A.Equals<typeof output, typeof expected> = 1
    assert

    expect(output).toBeInstanceOf(RecordSchema_)
    expect(output.keys).toBeInstanceOf(StringSchema_)
    expect(output.elements).toBeInstanceOf(NumberSchema_)
  })

  test('returns record schema with enum keys if keys are enum', () => {
    const schema = z.record(z.enum(['foo', 'bar']), z.number())
    const output = fromZodSchema(schema)
    const expected = record(string().enum('foo', 'bar'), number())

    const assert: A.Equals<typeof output, typeof expected> = 1
    assert

    expect(output).toBeInstanceOf(RecordSchema_)
    expect(output.keys).toBeInstanceOf(StringSchema_)
    expect(output.keys.props.enum).toStrictEqual(['foo', 'bar'])
    expect(output.elements).toBeInstanceOf(NumberSchema_)
  })
})
