import { DynamoDBToolboxError } from 'v1/errors'
import { record, string } from 'v1/schema'

import { parseRecordAttributeClonedInput } from './record'
import * as parseAttributeClonedInputModule from './attribute'

const parseAttributeClonedInput = jest.spyOn(
  parseAttributeClonedInputModule,
  'parseAttributeClonedInput'
)

const recordAttr = record(string(), string()).freeze('path')

describe('parseRecordAttributeClonedInput', () => {
  beforeEach(() => {
    parseAttributeClonedInput.mockClear()
  })

  it('throws an error if input is not a record', () => {
    const parser = parseRecordAttributeClonedInput(recordAttr, ['foo', 'bar'])

    const clonedState = parser.next()
    expect(clonedState.done).toBe(false)
    expect(clonedState.value).toStrictEqual(['foo', 'bar'])

    const invalidCall = () => {
      const parser = parseRecordAttributeClonedInput(recordAttr, ['foo', 'bar'])
      parser.next()
      parser.next()
    }

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(expect.objectContaining({ code: 'parsing.invalidAttributeInput' }))
  })

  it('applies parseAttributeClonesInput on input properties otherwise (and pass options)', () => {
    const options = { some: 'options' }
    const parser = parseRecordAttributeClonedInput(
      recordAttr,
      { foo: 'foo1', bar: 'bar1' },
      // @ts-expect-error we don't really care about the type here
      options
    )

    const clonedState = parser.next()
    expect(clonedState.done).toBe(false)
    expect(clonedState.value).toStrictEqual({ foo: 'foo1', bar: 'bar1' })

    expect(parseAttributeClonedInput).toHaveBeenCalledTimes(4)
    expect(parseAttributeClonedInput).toHaveBeenCalledWith(recordAttr.keys, 'foo', options)
    expect(parseAttributeClonedInput).toHaveBeenCalledWith(recordAttr.keys, 'bar', options)
    expect(parseAttributeClonedInput).toHaveBeenCalledWith(recordAttr.elements, 'foo1', options)
    expect(parseAttributeClonedInput).toHaveBeenCalledWith(recordAttr.elements, 'bar1', options)

    const parsedState = parser.next()
    expect(parsedState.done).toBe(false)
    expect(parsedState.value).toStrictEqual({ foo: 'foo1', bar: 'bar1' })

    const collapsedState = parser.next()
    expect(collapsedState.done).toBe(true)
    expect(collapsedState.value).toStrictEqual({ foo: 'foo1', bar: 'bar1' })
  })
})
