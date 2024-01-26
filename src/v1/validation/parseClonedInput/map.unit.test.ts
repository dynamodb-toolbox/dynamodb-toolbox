import { DynamoDBToolboxError } from 'v1/errors'
import { map, string } from 'v1/schema'

import { parseMapAttributeClonedInput } from './map'
import * as parseAttributeClonedInputModule from './attribute'

const parseAttributeClonedInput = jest.spyOn(
  parseAttributeClonedInputModule,
  'parseAttributeClonedInput'
)

const mapAttr = map({ foo: string(), bar: string() }).freeze('path')

describe('parseMapAttributeClonedInput', () => {
  beforeEach(() => {
    parseAttributeClonedInput.mockClear()
  })

  it('throws an error if input is not a map', () => {
    const invalidCall = () =>
      parseMapAttributeClonedInput(mapAttr, ['foo', 'bar'], { fill: false }).next()

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(expect.objectContaining({ code: 'parsing.invalidAttributeInput' }))
  })

  it('applies parseAttributeClonesInput on input properties otherwise (and pass options)', () => {
    const options = { some: 'options' }
    const parser = parseMapAttributeClonedInput(
      mapAttr,
      { foo: 'foo', bar: 'bar' },
      // @ts-expect-error we don't really care about the type here
      options
    )

    const defaultedState = parser.next()
    expect(defaultedState.done).toBe(false)
    expect(defaultedState.value).toStrictEqual({ foo: 'foo', bar: 'bar' })

    expect(parseAttributeClonedInput).toHaveBeenCalledTimes(2)
    expect(parseAttributeClonedInput).toHaveBeenCalledWith(mapAttr.attributes.foo, 'foo', options)
    expect(parseAttributeClonedInput).toHaveBeenCalledWith(mapAttr.attributes.bar, 'bar', options)

    const linkedState = parser.next()
    expect(linkedState.done).toBe(false)
    expect(linkedState.value).toStrictEqual({ foo: 'foo', bar: 'bar' })

    const parsedState = parser.next()
    expect(parsedState.done).toBe(false)
    expect(parsedState.value).toStrictEqual({ foo: 'foo', bar: 'bar' })

    const collapsedState = parser.next()
    expect(collapsedState.done).toBe(true)
    expect(collapsedState.value).toStrictEqual({ foo: 'foo', bar: 'bar' })
  })
})
