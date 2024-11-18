import { list, string } from '~/attributes/index.js'
import { DynamoDBToolboxError } from '~/errors/index.js'

import * as attrParserModule from './attribute.js'
import { listAttrParser } from './list.js'

// @ts-ignore
const attrParser = vi.spyOn(attrParserModule, 'attrParser')

const listAttr = list(string()).freeze('path')

describe('listAttrParser', () => {
  beforeEach(() => {
    attrParser.mockClear()
  })

  test('throws an error if input is not a list', () => {
    const invalidCall = () => listAttrParser(listAttr, { foo: 'bar' }, { fill: false }).next()

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(expect.objectContaining({ code: 'parsing.invalidAttributeInput' }))
  })

  test('applies attrParser on input elements otherwise (and pass options)', () => {
    const options = { valuePath: ['root'] }
    const parser = listAttrParser(listAttr, ['foo', 'bar'], options)

    const { value: defaultedValue } = parser.next()
    expect(defaultedValue).toStrictEqual(['foo', 'bar'])

    expect(attrParser).toHaveBeenCalledTimes(2)
    expect(attrParser).toHaveBeenCalledWith(listAttr.elements, 'foo', {
      ...options,
      valuePath: ['root', 0],
      defined: false
    })
    expect(attrParser).toHaveBeenCalledWith(listAttr.elements, 'bar', {
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
    const listA = list(string())
      .validate(input => input.includes('foo'))
      .freeze()

    const { value: parsed } = listAttrParser(listA, ['foo', 'bar'], { fill: false }).next()
    expect(parsed).toStrictEqual(['foo', 'bar'])

    const invalidCallA = () =>
      listAttrParser(listA, ['bar'], { fill: false, valuePath: ['root'] }).next()

    expect(invalidCallA).toThrow(DynamoDBToolboxError)
    expect(invalidCallA).toThrow(
      expect.objectContaining({
        code: 'parsing.customValidationFailed',
        message: "Custom validation for attribute 'root' failed."
      })
    )

    const listB = list(string())
      .validate(input => (input.includes('foo') ? true : 'Oh no...'))
      .freeze()

    const invalidCallB = () =>
      listAttrParser(listB, ['bar'], { fill: false, valuePath: ['root'] }).next()

    expect(invalidCallB).toThrow(DynamoDBToolboxError)
    expect(invalidCallB).toThrow(
      expect.objectContaining({
        code: 'parsing.customValidationFailed',
        message: "Custom validation for attribute 'root' failed with message: Oh no...."
      })
    )
  })
})
