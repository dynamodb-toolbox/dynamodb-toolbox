import { DynamoDBToolboxError } from '~/errors/index.js'
import { list, string } from '~/schema/attributes/index.js'

import { listAttrParser } from './list.js'
import * as attrParserModule from './attribute.js'

// @ts-ignore
const attrParser = vi.spyOn(attrParserModule, 'attrParser')

const listAttr = list(string()).freeze('path')

describe('parseListAttributeClonedInput', () => {
  beforeEach(() => {
    attrParser.mockClear()
  })

  test('throws an error if input is not a list', () => {
    const invalidCall = () => listAttrParser(listAttr, { foo: 'bar' }, { fill: false }).next()

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(expect.objectContaining({ code: 'parsing.invalidAttributeInput' }))
  })

  test('applies parseAttributeClonesInput on input elements otherwise (and pass options)', () => {
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
    expect(attrParser).toHaveBeenCalledWith(listAttr.elements, 'foo', options)
    expect(attrParser).toHaveBeenCalledWith(listAttr.elements, 'bar', options)

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
