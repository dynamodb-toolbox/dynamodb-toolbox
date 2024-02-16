import { DynamoDBToolboxError } from 'v1/errors'
import { list, string } from 'v1/schema'

import { listAttrWorkflow } from './list'
import * as attrWorkflowModule from './attribute'

// @ts-ignore
const attrWorkflow = jest.spyOn(attrWorkflowModule, 'attrWorkflow')

const listAttr = list(string()).freeze('path')

describe('parseListAttributeClonedInput', () => {
  beforeEach(() => {
    attrWorkflow.mockClear()
  })

  it('throws an error if input is not a list', () => {
    const invalidCall = () => listAttrWorkflow(listAttr, { foo: 'bar' }, { fill: false }).next()

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(expect.objectContaining({ code: 'parsing.invalidAttributeInput' }))
  })

  it('applies parseAttributeClonesInput on input elements otherwise (and pass options)', () => {
    const options = { some: 'options' }
    const parser = listAttrWorkflow(
      listAttr,
      ['foo', 'bar'],
      // @ts-expect-error we don't really care about the type here
      options
    )

    const defaultedState = parser.next()
    expect(defaultedState.done).toBe(false)
    expect(defaultedState.value).toStrictEqual(['foo', 'bar'])

    expect(attrWorkflow).toHaveBeenCalledTimes(2)
    expect(attrWorkflow).toHaveBeenCalledWith(listAttr.elements, 'foo', options)
    expect(attrWorkflow).toHaveBeenCalledWith(listAttr.elements, 'bar', options)

    const linkedState = parser.next()
    expect(linkedState.done).toBe(false)
    expect(linkedState.value).toStrictEqual(['foo', 'bar'])

    const parsedState = parser.next()
    expect(parsedState.done).toBe(false)
    expect(parsedState.value).toStrictEqual(['foo', 'bar'])

    const transformedState = parser.next()
    expect(transformedState.done).toBe(true)
    expect(transformedState.value).toStrictEqual(['foo', 'bar'])
  })
})
