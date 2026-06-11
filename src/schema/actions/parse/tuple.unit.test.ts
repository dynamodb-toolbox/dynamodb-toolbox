import { DynamoDBToolboxError } from '~/errors/index.js'
import { number, string, tuple } from '~/schema/index.js'

import * as schemaParserModule from './schema.js'
import { tupleSchemaParser } from './tuple.js'

// @ts-ignore
const schemaParser = vi.spyOn(schemaParserModule, 'schemaParser')

const tupleSchema = tuple(string(), number())

describe('tupleSchemaParser', () => {
  beforeEach(() => {
    schemaParser.mockClear()
  })

  test('throws an error if input is not a list', () => {
    const invalidCall = () => tupleSchemaParser(tupleSchema, { foo: 'bar' }, { fill: false }).next()

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(expect.objectContaining({ code: 'parsing.invalidAttributeInput' }))
  })

  test('applies schemaParser on input elements otherwise (and pass options)', () => {
    const options = { valuePath: ['root'] }
    const parser = tupleSchemaParser(tupleSchema, ['foo', 42], options)

    const { value: defaultedValue } = parser.next()
    expect(defaultedValue).toStrictEqual(['foo', 42])

    expect(schemaParser).toHaveBeenCalledTimes(2)
    expect(schemaParser).toHaveBeenCalledWith(tupleSchema.elements[0], 'foo', {
      ...options,
      valuePath: ['root', 0],
      defined: false
    })
    expect(schemaParser).toHaveBeenCalledWith(tupleSchema.elements[1], 42, {
      ...options,
      valuePath: ['root', 1],
      defined: false
    })

    const { value: linkedValue } = parser.next()
    expect(linkedValue).toStrictEqual(['foo', 42])

    const { value: parsedValue } = parser.next()
    expect(parsedValue).toStrictEqual(['foo', 42])

    const { done, value: transformedValue } = parser.next()
    expect(done).toBe(true)
    expect(transformedValue).toStrictEqual(['foo', 42])
  })

  test('applies validation if any', () => {
    const tupleA = tuple(string(), number()).validate(input => input.includes('foo'))

    const { value: parsed } = tupleSchemaParser(tupleA, ['foo', 42], { fill: false }).next()
    expect(parsed).toStrictEqual(['foo', 42])

    const invalidCallA = () =>
      tupleSchemaParser(tupleA, ['bar', 42], { fill: false, valuePath: ['root'] }).next()

    expect(invalidCallA).toThrow(DynamoDBToolboxError)
    expect(invalidCallA).toThrow(
      expect.objectContaining({
        code: 'parsing.customValidationFailed',
        message: "Custom validation for attribute 'root' failed."
      })
    )

    const tupleB = tuple(string(), number()).validate(input =>
      input.includes('foo') ? true : 'Oh no...'
    )

    const invalidCallB = () =>
      tupleSchemaParser(tupleB, ['bar', 42], { fill: false, valuePath: ['root'] }).next()

    expect(invalidCallB).toThrow(DynamoDBToolboxError)
    expect(invalidCallB).toThrow(
      expect.objectContaining({
        code: 'parsing.customValidationFailed',
        message: "Custom validation for attribute 'root' failed with message: Oh no...."
      })
    )
  })
})
