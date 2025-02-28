import { DynamoDBToolboxError } from '~/errors/index.js'
import { set, string } from '~/schema/index.js'

import * as attrParserModule from './attribute.js'
import { setSchemaParser } from './set.js'

// @ts-ignore
const attrParser = vi.spyOn(attrParserModule, 'attrParser')

const schema = set(string())

describe('setSchemaParser', () => {
  beforeEach(() => {
    attrParser.mockClear()
  })

  test('throws an error if input is not a set', () => {
    const invalidCall = () => setSchemaParser(schema, { foo: 'bar' }, { fill: false }).next()

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(expect.objectContaining({ code: 'parsing.invalidAttributeInput' }))
  })

  test('applies attrParser on input elements otherwise (and pass options)', () => {
    const options = { valuePath: ['root'] }
    const parser = setSchemaParser(schema, new Set(['foo', 'bar']), options)

    const { value: defaultedValue } = parser.next()
    expect(defaultedValue).toStrictEqual(new Set(['foo', 'bar']))

    expect(attrParser).toHaveBeenCalledTimes(2)
    expect(attrParser).toHaveBeenCalledWith(schema.elements, 'foo', {
      ...options,
      valuePath: ['root', 0],
      defined: false
    })
    expect(attrParser).toHaveBeenCalledWith(schema.elements, 'bar', {
      ...options,
      valuePath: ['root', 1],
      defined: false
    })

    const { value: linkedValue } = parser.next()
    expect(linkedValue).toStrictEqual(new Set(['foo', 'bar']))

    const { value: parsedValue } = parser.next()
    expect(parsedValue).toStrictEqual(new Set(['foo', 'bar']))

    const { done, value: transformedValue } = parser.next()
    expect(done).toBe(true)
    expect(transformedValue).toStrictEqual(new Set(['foo', 'bar']))
  })

  test('applies validation if any', () => {
    const setA = set(string()).validate(input => input.has('foo'))

    const { value: parsedValue } = setSchemaParser(setA, new Set(['foo', 'bar']), {
      fill: false
    }).next()
    expect(parsedValue).toStrictEqual(new Set(['foo', 'bar']))

    const invalidCallA = () =>
      setSchemaParser(setA, new Set(['bar']), { fill: false, valuePath: ['root'] }).next()

    expect(invalidCallA).toThrow(DynamoDBToolboxError)
    expect(invalidCallA).toThrow(
      expect.objectContaining({
        code: 'parsing.customValidationFailed',
        message: "Custom validation for attribute 'root' failed."
      })
    )

    const setB = set(string()).validate(input => (input.has('foo') ? true : 'Oh no...'))

    const invalidCallB = () =>
      setSchemaParser(setB, new Set(['bar']), { fill: false, valuePath: ['root'] }).next()

    expect(invalidCallB).toThrow(DynamoDBToolboxError)
    expect(invalidCallB).toThrow(
      expect.objectContaining({
        code: 'parsing.customValidationFailed',
        message: "Custom validation for attribute 'root' failed with message: Oh no...."
      })
    )
  })
})
