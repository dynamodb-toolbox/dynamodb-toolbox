import { DynamoDBToolboxError } from '~/errors/index.js'
import { list, string } from '~/schema/index.js'

import * as attrParserModule from './attribute.js'
import { listSchemaParser } from './list.js'

// @ts-ignore
const attrParser = vi.spyOn(attrParserModule, 'attrParser')

const listSchema = list(string())

describe('listSchemaParser', () => {
  beforeEach(() => {
    attrParser.mockClear()
  })

  test('throws an error if input is not a list', () => {
    const invalidCall = () => listSchemaParser(listSchema, { foo: 'bar' }, { fill: false }).next()

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(expect.objectContaining({ code: 'parsing.invalidAttributeInput' }))
  })

  test('applies attrParser on input elements otherwise (and pass options)', () => {
    const options = { valuePath: ['root'] }
    const parser = listSchemaParser(listSchema, ['foo', 'bar'], options)

    const { value: defaultedValue } = parser.next()
    expect(defaultedValue).toStrictEqual(['foo', 'bar'])

    expect(attrParser).toHaveBeenCalledTimes(2)
    expect(attrParser).toHaveBeenCalledWith(listSchema.elements, 'foo', {
      ...options,
      valuePath: ['root', 0],
      defined: false
    })
    expect(attrParser).toHaveBeenCalledWith(listSchema.elements, 'bar', {
      ...options,
      valuePath: ['root', 1],
      defined: false
    })

    const { value: linkedValue } = parser.next()
    expect(linkedValue).toStrictEqual(['foo', 'bar'])

    const { value: parsedValue } = parser.next()
    expect(parsedValue).toStrictEqual(['foo', 'bar'])

    const { done, value: transformedValue } = parser.next()
    expect(done).toBe(true)
    expect(transformedValue).toStrictEqual(['foo', 'bar'])
  })

  test('applies validation if any', () => {
    const listA = list(string()).validate(input => input.includes('foo'))

    const { value: parsed } = listSchemaParser(listA, ['foo', 'bar'], { fill: false }).next()
    expect(parsed).toStrictEqual(['foo', 'bar'])

    const invalidCallA = () =>
      listSchemaParser(listA, ['bar'], { fill: false, valuePath: ['root'] }).next()

    expect(invalidCallA).toThrow(DynamoDBToolboxError)
    expect(invalidCallA).toThrow(
      expect.objectContaining({
        code: 'parsing.customValidationFailed',
        message: "Custom validation for attribute 'root' failed."
      })
    )

    const listB = list(string()).validate(input => (input.includes('foo') ? true : 'Oh no...'))

    const invalidCallB = () =>
      listSchemaParser(listB, ['bar'], { fill: false, valuePath: ['root'] }).next()

    expect(invalidCallB).toThrow(DynamoDBToolboxError)
    expect(invalidCallB).toThrow(
      expect.objectContaining({
        code: 'parsing.customValidationFailed',
        message: "Custom validation for attribute 'root' failed with message: Oh no...."
      })
    )
  })
})
