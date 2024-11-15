import { list, string } from '~/attributes/index.js'
import { DynamoDBToolboxError } from '~/errors/index.js'

import * as attrFormatterModule from './attribute.js'
import { listAttrFormatter } from './list.js'

// @ts-ignore
const attrFormatter = vi.spyOn(attrFormatterModule, 'attrFormatter')

const listAttr = list(string()).freeze('path')

describe('listAttrFormatter', () => {
  beforeEach(() => {
    attrFormatter.mockClear()
  })

  test('throws an error if value is not a list', () => {
    const invalidCall = () => listAttrFormatter(listAttr, { foo: 'bar' }).next()

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(expect.objectContaining({ code: 'formatter.invalidAttribute' }))
  })

  test('applies attrFormatter on input elements otherwise (and pass options)', () => {
    const options = { valuePath: ['root'] }
    const formatter = listAttrFormatter(listAttr, ['foo', 'bar'], options)

    const { value: transformedValue } = formatter.next()
    expect(transformedValue).toStrictEqual(['foo', 'bar'])

    expect(attrFormatter).toHaveBeenCalledTimes(2)
    expect(attrFormatter).toHaveBeenCalledWith(listAttr.elements, 'foo', {
      ...options,
      valuePath: ['root', 0]
    })
    expect(attrFormatter).toHaveBeenCalledWith(listAttr.elements, 'bar', {
      ...options,
      valuePath: ['root', 1]
    })

    const { done, value: formattedValue } = formatter.next()
    expect(done).toBe(true)
    expect(formattedValue).toStrictEqual(['foo', 'bar'])
  })

  test('does not transform if transform is false', () => {
    const options = { transform: false }
    const formatter = listAttrFormatter(listAttr, ['foo', 'bar'], options)

    const { done, value: formattedValue } = formatter.next()
    expect(done).toBe(true)
    expect(formattedValue).toStrictEqual(['foo', 'bar'])

    expect(attrFormatter).toHaveBeenCalledTimes(2)
    expect(attrFormatter).toHaveBeenCalledWith(listAttr.elements, 'foo', {
      ...options,
      valuePath: [0]
    })
    expect(attrFormatter).toHaveBeenCalledWith(listAttr.elements, 'bar', {
      ...options,
      valuePath: [1]
    })
  })

  // TODO: Apply validation
})
