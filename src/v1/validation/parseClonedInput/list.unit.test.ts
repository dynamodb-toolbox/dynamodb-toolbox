import { DynamoDBToolboxError } from 'v1/errors'
import { $transform, freezeListAttribute, list, string } from 'v1/schema'
import { prefix } from 'v1/transformers'

import { parseListAttributeClonedInput } from './list'
import * as parseAttributeClonedInputModule from './attribute'

const parseAttributeClonedInputMock = jest
  .spyOn(parseAttributeClonedInputModule, 'parseAttributeClonedInput')
  // @ts-expect-error
  .mockImplementation((_, input) => input)

const listAttr = freezeListAttribute(list(string()), 'path')

describe('parseListAttributeClonedInput', () => {
  beforeEach(() => {
    parseAttributeClonedInputMock.mockClear()
  })

  it('throws an error if input is not a list', () => {
    const invalidCall = () => parseListAttributeClonedInput(listAttr, { foo: 'bar' })

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(expect.objectContaining({ code: 'parsing.invalidAttributeInput' }))
  })

  it('applies parseAttributeClonesInput on input elements otherwise (and pass options)', () => {
    const options = { some: 'options' }
    const parsedValues = parseListAttributeClonedInput(
      listAttr,
      ['foo', 'bar'],
      // @ts-expect-error we don't really care about the type here
      options
    )

    expect(parsedValues).toStrictEqual(['foo', 'bar'])
    expect(parseAttributeClonedInputMock).toHaveBeenCalledTimes(2)
    expect(parseAttributeClonedInputMock).toHaveBeenCalledWith(listAttr.elements, 'foo', options)
    expect(parseAttributeClonedInputMock).toHaveBeenCalledWith(listAttr.elements, 'bar', options)
  })

  it('keeps transformer if one is present', () => {
    const transformer = prefix('foo')
    const listAttr2 = freezeListAttribute(list(string().transform(transformer)), 'path')

    const parsedValues = parseListAttributeClonedInput(listAttr2, ['foo', 'bar'])

    expect([...parsedValues]).toStrictEqual(['foo', 'bar'])
    expect(parsedValues[$transform]).toStrictEqual(transformer)
  })
})
