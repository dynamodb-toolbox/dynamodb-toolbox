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
    const options = { some: 'options' }
    const parser = listAttrParser(
      listAttr,
      ['foo', 'bar'],
      // @ts-expect-error we don't really care about the type here
      options
    )

    const defaultedState = parser.next()
    expect(defaultedState.done).toBe(false)
    expect(defaultedState.value).toStrictEqual(['foo', 'bar'])

    expect(attrParser).toHaveBeenCalledTimes(2)
    expect(attrParser).toHaveBeenCalledWith(listAttr.elements, 'foo', {
      ...options,
      defined: false
    })
    expect(attrParser).toHaveBeenCalledWith(listAttr.elements, 'bar', {
      ...options,
      defined: false
    })

    const linkedState = parser.next()
    expect(linkedState.done).toBe(false)
    expect(linkedState.value).toStrictEqual(['foo', 'bar'])

    const parsedState = parser.next()
    expect(parsedState.done).toBe(false)
    expect(parsedState.value).toStrictEqual(['foo', 'bar'])

    const transformedState = parser.next()
    expect(transformedState.done).toBe(true)
    expect(transformedState.value).toStrictEqual(['foo', 'bar'])
  })

  test('applies validation if any', () => {
    const listA = list(string())
      .validate(input => input.includes('foo'))
      .freeze('root')

    const { value: parsed } = listAttrParser(listA, ['foo', 'bar'], { fill: false }).next()
    expect(parsed).toStrictEqual(['foo', 'bar'])

    const invalidCallA = () => listAttrParser(listA, ['bar'], { fill: false }).next()

    expect(invalidCallA).toThrow(DynamoDBToolboxError)
    expect(invalidCallA).toThrow(
      expect.objectContaining({
        code: 'parsing.customValidationFailed',
        message: "Custom validation for attribute 'root' failed."
      })
    )

    const listB = list(string())
      .validate(input => (input.includes('foo') ? true : 'Oh no...'))
      .freeze('root')

    const invalidCallB = () => listAttrParser(listB, ['bar'], { fill: false }).next()

    expect(invalidCallB).toThrow(DynamoDBToolboxError)
    expect(invalidCallB).toThrow(
      expect.objectContaining({
        code: 'parsing.customValidationFailed',
        message: "Custom validation for attribute 'root' failed with message: Oh no...."
      })
    )
  })
})
