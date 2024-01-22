import { DynamoDBToolboxError } from 'v1/errors'
import { list, string } from 'v1/schema'

import { parseListAttributeClonedInput } from './list'
import * as parseAttributeClonedInputModule from './attribute'

const parseAttributeClonedInput = jest.spyOn(
  parseAttributeClonedInputModule,
  'parseAttributeClonedInput'
)

const listAttr = list(string()).freeze('path')

describe('parseListAttributeClonedInput', () => {
  beforeEach(() => {
    parseAttributeClonedInput.mockClear()
  })

  it('throws an error if input is not a list', () => {
    const invalidCall = () =>
      parseListAttributeClonedInput(listAttr, { foo: 'bar' }, { clone: false }).next()

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(expect.objectContaining({ code: 'parsing.invalidAttributeInput' }))
  })

  it('applies parseAttributeClonesInput on input elements otherwise (and pass options)', () => {
    const options = { some: 'options' }
    const parser = parseListAttributeClonedInput(
      listAttr,
      ['foo', 'bar'],
      // @ts-expect-error we don't really care about the type here
      options
    )

    const clonedState = parser.next()
    expect(clonedState.done).toBe(false)
    expect(clonedState.value).toStrictEqual(['foo', 'bar'])

    expect(parseAttributeClonedInput).toHaveBeenCalledTimes(2)
    expect(parseAttributeClonedInput).toHaveBeenCalledWith(listAttr.elements, 'foo', options)
    expect(parseAttributeClonedInput).toHaveBeenCalledWith(listAttr.elements, 'bar', options)

    const linkedState = parser.next()
    expect(linkedState.done).toBe(false)
    expect(linkedState.value).toStrictEqual(['foo', 'bar'])

    const parsedState = parser.next()
    expect(parsedState.done).toBe(false)
    expect(parsedState.value).toStrictEqual(['foo', 'bar'])

    const collapsedState = parser.next()
    expect(collapsedState.done).toBe(true)
    expect(collapsedState.value).toStrictEqual(['foo', 'bar'])
  })
})
