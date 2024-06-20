import { DynamoDBToolboxError } from '~/errors/index.js'
import { record, string } from '~/schema/attributes/index.js'

import * as attrParserModule from './attribute.js'
import { recordAttributeParser } from './record.js'

// @ts-ignore
const attrParser = vi.spyOn(attrParserModule, 'attrParser')

const recordAttr = record(string(), string()).freeze('path')

describe('parseRecordAttributeClonedInput', () => {
  beforeEach(() => {
    attrParser.mockClear()
  })

  test('throws an error if input is not a record', () => {
    const invalidCall = () =>
      recordAttributeParser(recordAttr, ['foo', 'bar'], { fill: false }).next()

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(expect.objectContaining({ code: 'parsing.invalidAttributeInput' }))
  })

  test('applies parseAttributeClonesInput on input properties otherwise (and pass options)', () => {
    const options = { some: 'options' }
    const parser = recordAttributeParser(
      recordAttr,
      { foo: 'foo1', bar: 'bar1' },
      // @ts-expect-error we don't really care about the type here
      options
    )

    const defaultedState = parser.next()
    expect(defaultedState.done).toBe(false)
    expect(defaultedState.value).toStrictEqual({ foo: 'foo1', bar: 'bar1' })

    expect(attrParser).toHaveBeenCalledTimes(4)
    expect(attrParser).toHaveBeenCalledWith(recordAttr.keys, 'foo', options)
    expect(attrParser).toHaveBeenCalledWith(recordAttr.keys, 'bar', options)
    expect(attrParser).toHaveBeenCalledWith(recordAttr.elements, 'foo1', options)
    expect(attrParser).toHaveBeenCalledWith(recordAttr.elements, 'bar1', options)

    const linkedState = parser.next()
    expect(linkedState.done).toBe(false)
    expect(linkedState.value).toStrictEqual({ foo: 'foo1', bar: 'bar1' })

    const parsedState = parser.next()
    expect(parsedState.done).toBe(false)
    expect(parsedState.value).toStrictEqual({ foo: 'foo1', bar: 'bar1' })

    const transformedState = parser.next()
    expect(transformedState.done).toBe(true)
    expect(transformedState.value).toStrictEqual({ foo: 'foo1', bar: 'bar1' })
  })
})
