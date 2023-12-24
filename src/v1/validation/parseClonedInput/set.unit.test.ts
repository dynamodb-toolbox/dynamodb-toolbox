import { DynamoDBToolboxError } from 'v1/errors'
import { $type, $transform, freezeSetAttribute, set, string } from 'v1/schema'
import { prefix } from 'v1/transformers'

import { parseSetAttributeClonedInput } from './set'
import * as parseAttributeClonedInputModule from './attribute'

const parseAttributeClonedInputMock = jest
  .spyOn(parseAttributeClonedInputModule, 'parseAttributeClonedInput')
  // @ts-expect-error
  .mockImplementation((_, input) => input)

const setAttr = freezeSetAttribute(set(string()), 'path')

describe('parseSetAttributeClonedInput', () => {
  beforeEach(() => {
    parseAttributeClonedInputMock.mockClear()
  })

  it('throws an error if input is not a set', () => {
    const invalidCall = () => parseSetAttributeClonedInput(setAttr, { foo: 'bar' })

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
    )

    expect(new Set(parsedValues)).toStrictEqual(new Set(['foo', 'bar']))
    expect(parsedValues[$type]).toBe('set')
    expect(parseAttributeClonedInputMock).toHaveBeenCalledTimes(2)
    expect(parseAttributeClonedInputMock).toHaveBeenCalledWith(setAttr.elements, 'foo', options)
    expect(parseAttributeClonedInputMock).toHaveBeenCalledWith(setAttr.elements, 'bar', options)
  })

  it('keeps transformer if one is present', () => {
    const transformer = prefix('foo')
    const setAttr2 = freezeSetAttribute(set(string().transform(transformer)), 'path')

    const parsedValues = parseSetAttributeClonedInput(setAttr2, new Set(['foo', 'bar']))

    expect(new Set(parsedValues)).toStrictEqual(new Set(['foo', 'bar']))
    expect(parsedValues[$transform]).toStrictEqual(transformer)
  })
})
