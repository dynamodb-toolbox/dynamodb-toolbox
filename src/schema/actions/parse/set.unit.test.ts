import { set, string } from '~/attributes/index.js'
import { DynamoDBToolboxError } from '~/errors/index.js'

import * as attrParserModule from './attribute.js'
import { setAttrParser } from './set.js'

// @ts-ignore
const attrParser = vi.spyOn(attrParserModule, 'attrParser')

const setAttr = set(string()).freeze('path')

describe('setAttrParser', () => {
  beforeEach(() => {
    attrParser.mockClear()
  })

  test('throws an error if input is not a set', () => {
    const invalidCall = () => setAttrParser(setAttr, { foo: 'bar' }, { fill: false }).next()

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(expect.objectContaining({ code: 'parsing.invalidAttributeInput' }))
  })

  test('applies attrParser on input elements otherwise (and pass options)', () => {
    const options = { some: 'options' }
    const parser = setAttrParser(
      setAttr,
      new Set(['foo', 'bar']),
      // @ts-expect-error we don't really care about the type here
      options
    )

    const defaultedState = parser.next()
    expect(defaultedState.done).toBe(false)
    expect(defaultedState.value).toStrictEqual(new Set(['foo', 'bar']))

    expect(attrParser).toHaveBeenCalledTimes(2)
    expect(attrParser).toHaveBeenCalledWith(setAttr.elements, 'foo', options)
    expect(attrParser).toHaveBeenCalledWith(setAttr.elements, 'bar', options)

    const linkedState = parser.next()
    expect(linkedState.done).toBe(false)
    expect(linkedState.value).toStrictEqual(new Set(['foo', 'bar']))

    const parsedState = parser.next()
    expect(parsedState.done).toBe(false)
    expect(parsedState.value).toStrictEqual(new Set(['foo', 'bar']))

    const transformedState = parser.next()
    expect(transformedState.done).toBe(true)
    expect(transformedState.value).toStrictEqual(new Set(['foo', 'bar']))
  })

  test('applies validation if any', () => {
    const setA = set(string())
      .validate(input => input.has('foo'))
      .freeze('root')

    const { value: parsed } = setAttrParser(setA, new Set(['foo', 'bar']), { fill: false }).next()
    expect(parsed).toStrictEqual(new Set(['foo', 'bar']))

    const invalidCallA = () => setAttrParser(setA, new Set(['bar']), { fill: false }).next()

    expect(invalidCallA).toThrow(DynamoDBToolboxError)
    expect(invalidCallA).toThrow(
      expect.objectContaining({
        code: 'parsing.customValidationFailed',
        message: "Custom validation for attribute 'root' failed."
      })
    )

    const setB = set(string())
      .validate(input => (input.has('foo') ? true : 'Oh no...'))
      .freeze('root')

    const invalidCallB = () => setAttrParser(setB, new Set(['bar']), { fill: false }).next()

    expect(invalidCallB).toThrow(DynamoDBToolboxError)
    expect(invalidCallB).toThrow(
      expect.objectContaining({
        code: 'parsing.customValidationFailed',
        message: "Custom validation for attribute 'root' failed with message: Oh no...."
      })
    )
  })
})
