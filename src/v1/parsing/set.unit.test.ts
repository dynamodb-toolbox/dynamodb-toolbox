import { DynamoDBToolboxError } from 'v1/errors'
import { set, string } from 'v1/schema'

import { setAttributeParser } from './set'
import * as attributeParserModule from './attribute'

const attributeParser = jest.spyOn(attributeParserModule, 'attributeParser')

const setAttr = set(string()).freeze('path')

describe('parseSetAttributeClonedInput', () => {
  beforeEach(() => {
    attributeParser.mockClear()
  })

  it('throws an error if input is not a set', () => {
    const invalidCall = () => setAttributeParser(setAttr, { foo: 'bar' }, { fill: false }).next()

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(expect.objectContaining({ code: 'parsing.invalidAttributeInput' }))
  })

  it('applies parseAttributeClonesInput on input elements otherwise (and pass options)', () => {
    const options = { some: 'options' }
    const parser = setAttributeParser(
      setAttr,
      new Set(['foo', 'bar']),
      // @ts-expect-error we don't really care about the type here
      options
    )

    const defaultedState = parser.next()
    expect(defaultedState.done).toBe(false)
    expect(defaultedState.value).toStrictEqual(new Set(['foo', 'bar']))

    expect(attributeParser).toHaveBeenCalledTimes(2)
    expect(attributeParser).toHaveBeenCalledWith(setAttr.elements, 'foo', options)
    expect(attributeParser).toHaveBeenCalledWith(setAttr.elements, 'bar', options)

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
})
