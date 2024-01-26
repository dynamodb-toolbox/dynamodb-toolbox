import { DynamoDBToolboxError } from 'v1/errors'
import { set, string } from 'v1/schema'

import { parseSetAttributeClonedInput } from './set'
import * as parseAttributeClonedInputModule from './attribute'

const parseAttributeClonedInput = jest.spyOn(
  parseAttributeClonedInputModule,
  'parseAttributeClonedInput'
)

const setAttr = set(string()).freeze('path')

describe('parseSetAttributeClonedInput', () => {
  beforeEach(() => {
    parseAttributeClonedInput.mockClear()
  })

  it('throws an error if input is not a set', () => {
    const invalidCall = () =>
      parseSetAttributeClonedInput(setAttr, { foo: 'bar' }, { fill: false }).next()

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(expect.objectContaining({ code: 'parsing.invalidAttributeInput' }))
  })

  it('applies parseAttributeClonesInput on input elements otherwise (and pass options)', () => {
    const options = { some: 'options' }
    const parser = parseSetAttributeClonedInput(
      setAttr,
      new Set(['foo', 'bar']),
      // @ts-expect-error we don't really care about the type here
      options
    )

    const defaultedState = parser.next()
    expect(defaultedState.done).toBe(false)
    expect(defaultedState.value).toStrictEqual(new Set(['foo', 'bar']))

    expect(parseAttributeClonedInput).toHaveBeenCalledTimes(2)
    expect(parseAttributeClonedInput).toHaveBeenCalledWith(setAttr.elements, 'foo', options)
    expect(parseAttributeClonedInput).toHaveBeenCalledWith(setAttr.elements, 'bar', options)

    const linkedState = parser.next()
    expect(linkedState.done).toBe(false)
    expect(linkedState.value).toStrictEqual(new Set(['foo', 'bar']))

    const parsedState = parser.next()
    expect(parsedState.done).toBe(false)
    expect(parsedState.value).toStrictEqual(new Set(['foo', 'bar']))

    const collapsedState = parser.next()
    expect(collapsedState.done).toBe(true)
    expect(collapsedState.value).toStrictEqual(new Set(['foo', 'bar']))
  })
})
