import { DynamoDBToolboxError } from 'v1/errors'
import { freezeSetAttribute, set, string } from 'v1/schema'

import { parseSetAttributeClonedInput } from './set'
import * as parseAttributeClonedInputModule from './attribute'

const parseAttributeClonedInputMock = jest
  .spyOn(parseAttributeClonedInputModule, 'parseAttributeClonedInput')
  // @ts-expect-error
  .mockImplementation((_, input) => ({ next: () => ({ value: input, done: true }) }))

const setAttr = freezeSetAttribute(set(string()), 'path')

describe('parseSetAttributeClonedInput', () => {
  beforeEach(() => {
    parseAttributeClonedInputMock.mockClear()
  })

  it('throws an error if input is not a set', () => {
    const invalidCall = () => parseSetAttributeClonedInput(setAttr, { foo: 'bar' }).next()

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(expect.objectContaining({ code: 'parsing.invalidAttributeInput' }))
  })

  it('applies parseAttributeClonesInput on input elements otherwise (and pass options)', () => {
    const options = { some: 'options' }
    const parsedValues = parseSetAttributeClonedInput(
      setAttr,
      new Set(['foo', 'bar']),
      // @ts-expect-error we don't really care about the type here
      options
    ).next().value

    expect(new Set(parsedValues)).toStrictEqual(new Set(['foo', 'bar']))
    expect(parseAttributeClonedInputMock).toHaveBeenCalledTimes(2)
    expect(parseAttributeClonedInputMock).toHaveBeenCalledWith(setAttr.elements, 'foo', options)
    expect(parseAttributeClonedInputMock).toHaveBeenCalledWith(setAttr.elements, 'bar', options)
  })
})
