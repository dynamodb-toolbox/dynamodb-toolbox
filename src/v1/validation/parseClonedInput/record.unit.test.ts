import { DynamoDBToolboxError } from 'v1/errors'
import { freezeRecordAttribute, record, string } from 'v1/schema'

import { parseRecordAttributeClonedInput } from './record'
import * as parseAttributeClonedInputModule from './attribute'
import * as parsePrimitiveClonedInputModule from './primitive'

const parsePrimitiveClonedInputMock = jest
  .spyOn(parsePrimitiveClonedInputModule, 'parsePrimitiveAttributeClonedInput')
  // @ts-expect-error
  .mockImplementation((_, input) => ({ next: () => ({ value: input, done: true }) }))
const parseAttributeClonedInputMock = jest
  .spyOn(parseAttributeClonedInputModule, 'parseAttributeClonedInput')
  // @ts-expect-error
  .mockImplementation((_, input) => ({ next: () => ({ value: input, done: true }) }))

const recordAttr = freezeRecordAttribute(record(string(), string()), 'path')

describe('parseRecordAttributeClonedInput', () => {
  beforeEach(() => {
    parsePrimitiveClonedInputMock.mockClear()
    parseAttributeClonedInputMock.mockClear()
  })

  it('throws an error if input is not a record', () => {
    const invalidCall = () => parseRecordAttributeClonedInput(recordAttr, ['foo', 'bar']).next()

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(expect.objectContaining({ code: 'parsing.invalidAttributeInput' }))
  })

  it('applies parseAttributeClonesInput on input properties otherwise (and pass options)', () => {
    const options = { some: 'options' }
    const parsedValues = parseRecordAttributeClonedInput(
      recordAttr,
      { foo: 'foo1', bar: 'bar1' },
      // @ts-expect-error we don't really care about the type here
      options
    ).next().value

    expect(parsedValues).toStrictEqual({ foo: 'foo1', bar: 'bar1' })
    expect(parsePrimitiveClonedInputMock).toHaveBeenCalledTimes(2)
    expect(parsePrimitiveClonedInputMock).toHaveBeenCalledWith(recordAttr.keys, 'foo', options)
    expect(parsePrimitiveClonedInputMock).toHaveBeenCalledWith(recordAttr.keys, 'bar', options)
    expect(parseAttributeClonedInputMock).toHaveBeenCalledTimes(2)
    expect(parseAttributeClonedInputMock).toHaveBeenCalledWith(recordAttr.elements, 'foo1', options)
    expect(parseAttributeClonedInputMock).toHaveBeenCalledWith(recordAttr.elements, 'bar1', options)
  })
})
