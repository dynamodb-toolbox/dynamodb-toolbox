import { DynamoDBToolboxError } from '~/errors/index.js'
import { set, string } from '~/schema/attributes/index.js'

import { setAttrParser } from './set.js'
import * as attrParserModule from './attribute.js'

// @ts-ignore
const attrParser = vi.spyOn(attrParserModule, 'attrParser')

const setAttr = set(string()).freeze('path')

describe('parseSetAttributeClonedInput', () => {
  beforeEach(() => {
    attrParser.mockClear()
  })

  test('throws an error if input is not a set', () => {
    const invalidCall = () => setAttrParser(setAttr, { foo: 'bar' }, { fill: false }).next()

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(expect.objectContaining({ code: 'parsing.invalidAttributeInput' }))
  })

  test('applies parseAttributeClonesInput on input elements otherwise (and pass options)', () => {
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
})
