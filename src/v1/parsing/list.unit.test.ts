import { DynamoDBToolboxError } from 'v1/errors'
import { list, string } from 'v1/schema'

import { listAttributeParser } from './list'
import * as attributeParserModule from './attribute'

const attributeParser = jest.spyOn(attributeParserModule, 'attributeParser')

const listAttr = list(string()).freeze('path')

describe('parseListAttributeClonedInput', () => {
  beforeEach(() => {
    attributeParser.mockClear()
  })

  it('throws an error if input is not a list', () => {
    const invalidCall = () => listAttributeParser(listAttr, { foo: 'bar' }, { fill: false }).next()

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(expect.objectContaining({ code: 'parsing.invalidAttributeInput' }))
  })

  it('applies parseAttributeClonesInput on input elements otherwise (and pass options)', () => {
    const options = { some: 'options' }
    const parser = listAttributeParser(
      listAttr,
      ['foo', 'bar'],
      // @ts-expect-error we don't really care about the type here
      options
    )

    const defaultedState = parser.next()
    expect(defaultedState.done).toBe(false)
    expect(defaultedState.value).toStrictEqual(['foo', 'bar'])

    expect(attributeParser).toHaveBeenCalledTimes(2)
    expect(attributeParser).toHaveBeenCalledWith(listAttr.elements, 'foo', options)
    expect(attributeParser).toHaveBeenCalledWith(listAttr.elements, 'bar', options)

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
})
