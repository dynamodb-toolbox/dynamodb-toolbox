import { DynamoDBToolboxError } from 'v1/errors'
import {
  $keys,
  $elements,
  $transform,
  freezeRecordAttribute,
  record,
  string,
  $type
} from 'v1/schema'
import { prefix } from 'v1/transformers'

import { parseRecordAttributeClonedInput } from './record'
import * as parseAttributeClonedInputModule from './attribute'
import * as parsePrimitiveClonedInputModule from './primitive'

const parsePrimitiveClonedInputMock = jest
  .spyOn(parsePrimitiveClonedInputModule, 'parsePrimitiveAttributeClonedInput')
  // @ts-expect-error
  .mockImplementation((_, input) => input)
const parseAttributeClonedInputMock = jest
  .spyOn(parseAttributeClonedInputModule, 'parseAttributeClonedInput')
  // @ts-expect-error
  .mockImplementation((_, input) => input)

const recordAttr = freezeRecordAttribute(record(string(), string()), 'path')

describe('parseRecordAttributeClonedInput', () => {
  beforeEach(() => {
    parsePrimitiveClonedInputMock.mockClear()
    parseAttributeClonedInputMock.mockClear()
  })

  it('throws an error if input is not a record', () => {
    const invalidCall = () => parseRecordAttributeClonedInput(recordAttr, ['foo', 'bar'])

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
    )

    expect(parsedValues).toStrictEqual({ [$type]: 'record', foo: 'foo1', bar: 'bar1' })
    expect(parsePrimitiveClonedInputMock).toHaveBeenCalledTimes(2)
    expect(parsePrimitiveClonedInputMock).toHaveBeenCalledWith(recordAttr.keys, 'foo')
    expect(parsePrimitiveClonedInputMock).toHaveBeenCalledWith(recordAttr.keys, 'bar')
    expect(parseAttributeClonedInputMock).toHaveBeenCalledTimes(2)
    expect(parseAttributeClonedInputMock).toHaveBeenCalledWith(recordAttr.elements, 'foo1', options)
    expect(parseAttributeClonedInputMock).toHaveBeenCalledWith(recordAttr.elements, 'bar1', options)
  })

  it('keeps transformer if one is present (keys)', () => {
    const transformer = prefix('foo')
    const recordAttr2 = freezeRecordAttribute(
      record(string().transform(transformer), string()),
      'path'
    )

    const parsedValues = parseRecordAttributeClonedInput(recordAttr2, { foo: 'foo' })

    expect(parsedValues).toStrictEqual({
      [$type]: 'record',
      [$transform]: { [$keys]: transformer },
      foo: 'foo'
    })
  })

  it('keeps transformer if one is present (elements)', () => {
    const transformer = prefix('foo')
    const recordAttr2 = freezeRecordAttribute(
      record(string(), string().transform(transformer)),
      'path'
    )

    const parsedValues = parseRecordAttributeClonedInput(recordAttr2, { foo: 'foo' })

    expect(parsedValues).toStrictEqual({
      [$type]: 'record',
      [$transform]: { [$elements]: transformer },
      foo: 'foo'
    })
  })
})
