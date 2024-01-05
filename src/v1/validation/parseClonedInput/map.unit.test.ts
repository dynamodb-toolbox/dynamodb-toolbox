import { DynamoDBToolboxError } from 'v1/errors'
import { freezeMapAttribute, map, string } from 'v1/schema'

import { parseMapAttributeClonedInput } from './map'
import * as parseAttributeClonedInputModule from './attribute'

const parseAttributeClonedInput = jest.spyOn(
  parseAttributeClonedInputModule,
  'parseAttributeClonedInput'
)

const mapAttr = freezeMapAttribute(map({ foo: string(), bar: string() }), 'path')

describe('parseMapAttributeClonedInput', () => {
  beforeEach(() => {
    parseAttributeClonedInput.mockClear()
  })

  it('throws an error if input is not a map', () => {
    const parser = parseMapAttributeClonedInput(mapAttr, ['foo', 'bar'])

    const clonedState = parser.next()
    expect(clonedState.done).toBe(false)
    expect(clonedState.value).toStrictEqual(['foo', 'bar'])

    const invalidCall = () => {
      const parser = parseMapAttributeClonedInput(mapAttr, ['foo', 'bar'])
      parser.next()
      parser.next()
    }

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

    const clonedState = parser.next()
    expect(clonedState.done).toBe(false)
    expect(clonedState.value).toStrictEqual({ foo: 'foo', bar: 'bar' })

    expect(parseAttributeClonedInput).toHaveBeenCalledTimes(2)
    expect(parseAttributeClonedInput).toHaveBeenCalledWith(mapAttr.attributes.foo, 'foo', options)
    expect(parseAttributeClonedInput).toHaveBeenCalledWith(mapAttr.attributes.bar, 'bar', options)

    const parsedState = parser.next()
    expect(parsedState.done).toBe(false)
    expect(parsedState.value).toStrictEqual({ foo: 'foo', bar: 'bar' })

    const collapsedState = parser.next()
    expect(collapsedState.done).toBe(true)
    expect(collapsedState.value).toStrictEqual({ foo: 'foo', bar: 'bar' })
  })
})
