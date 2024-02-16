import { DynamoDBToolboxError } from 'v1/errors'
import { map, string } from 'v1/schema'

import { mapAttributeParser } from './map'
import * as attrWorkflowModule from './attribute'

// @ts-ignore
const attrWorkflow = jest.spyOn(attrWorkflowModule, 'attrWorkflow')

const mapAttr = map({ foo: string(), bar: string() }).freeze('path')

describe('parseMapAttributeClonedInput', () => {
  beforeEach(() => {
    attrWorkflow.mockClear()
  })

  it('throws an error if input is not a map', () => {
    const invalidCall = () => mapAttributeParser(mapAttr, ['foo', 'bar'], { fill: false }).next()

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(expect.objectContaining({ code: 'parsing.invalidAttributeInput' }))
  })

  it('applies parseAttributeClonesInput on input properties otherwise (and pass options)', () => {
    const options = { some: 'options' }
    const parser = mapAttributeParser(
      mapAttr,
      { foo: 'foo', bar: 'bar' },
      // @ts-expect-error we don't really care about the type here
      options
    )

    const defaultedState = parser.next()
    expect(defaultedState.done).toBe(false)
    expect(defaultedState.value).toStrictEqual({ foo: 'foo', bar: 'bar' })

    expect(attrWorkflow).toHaveBeenCalledTimes(2)
    expect(attrWorkflow).toHaveBeenCalledWith(mapAttr.attributes.foo, 'foo', options)
    expect(attrWorkflow).toHaveBeenCalledWith(mapAttr.attributes.bar, 'bar', options)

    const linkedState = parser.next()
    expect(linkedState.done).toBe(false)
    expect(linkedState.value).toStrictEqual({ foo: 'foo', bar: 'bar' })

    const parsedState = parser.next()
    expect(parsedState.done).toBe(false)
    expect(parsedState.value).toStrictEqual({ foo: 'foo', bar: 'bar' })

    const transformedState = parser.next()
    expect(transformedState.done).toBe(true)
    expect(transformedState.value).toStrictEqual({ foo: 'foo', bar: 'bar' })
  })
})
