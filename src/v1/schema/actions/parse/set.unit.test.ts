import { DynamoDBToolboxError } from 'v1/errors'
import { set, string } from 'v1/schema'

import { setAttrWorkflow } from './set'
import * as attrWorkflowModule from './attribute'

// @ts-ignore
const attrWorkflow = jest.spyOn(attrWorkflowModule, 'attrWorkflow')

const setAttr = set(string()).freeze('path')

describe('parseSetAttributeClonedInput', () => {
  beforeEach(() => {
    attrWorkflow.mockClear()
  })

  it('throws an error if input is not a set', () => {
    const invalidCall = () => setAttrWorkflow(setAttr, { foo: 'bar' }, { fill: false }).next()

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(expect.objectContaining({ code: 'parsing.invalidAttributeInput' }))
  })

  it('applies parseAttributeClonesInput on input elements otherwise (and pass options)', () => {
    const options = { some: 'options' }
    const parser = setAttrWorkflow(
      setAttr,
      new Set(['foo', 'bar']),
      // @ts-expect-error we don't really care about the type here
      options
    )

    const defaultedState = parser.next()
    expect(defaultedState.done).toBe(false)
    expect(defaultedState.value).toStrictEqual(new Set(['foo', 'bar']))

    expect(attrWorkflow).toHaveBeenCalledTimes(2)
    expect(attrWorkflow).toHaveBeenCalledWith(setAttr.elements, 'foo', options)
    expect(attrWorkflow).toHaveBeenCalledWith(setAttr.elements, 'bar', options)

    const linkedState = parser.next()
    expect(linkedState.done).toBe(false)
    expect(linkedState.value).toStrictEqual(new Set(['foo', 'bar']))

    const parsedState = parser.next()
    expect(parsedState.done).toBe(false)
    expect(parsedState.value).toStrictEqual(new Set(['foo', 'bar']))

    const transformedState = parser.next()
    expect(transformedState.done).toBe(true)
    expect(transformedState.value).toStrictEqual(new Set(['foo', 'bar']))
  })
})
