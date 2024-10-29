import { record, string } from '~/attributes/index.js'
import { DynamoDBToolboxError } from '~/errors/index.js'
import { prefix } from '~/transformers/prefix.js'

import * as attrFormatterModule from './attribute.js'
import { recordAttrFormatter } from './record.js'

// @ts-ignore
const attrFormatter = vi.spyOn(attrFormatterModule, 'attrFormatter')

const _record = record(
  string().transform(prefix('_', { delimiter: '' })),
  string().transform(prefix('_', { delimiter: '' }))
).freeze('path')

describe('recordAttrFormatter', () => {
  beforeEach(() => {
    attrFormatter.mockClear()
  })

  test('throws an error if input is not a map', () => {
    const invalidCall = () => recordAttrFormatter(_record, ['foo', 'bar']).next()

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(expect.objectContaining({ code: 'formatter.invalidAttribute' }))
  })

  test('applies attrFormatter on input properties otherwise (and pass options)', () => {
    const options = { some: 'options' }
    const formatter = recordAttrFormatter(
      _record,
      { _f: '_foo', _b: '_bar' },
      // @ts-expect-error we don't really care about the type here
      options
    )

    const { value: transformedValue } = formatter.next()
    expect(transformedValue).toStrictEqual({ f: 'foo', b: 'bar' })

    expect(attrFormatter).toHaveBeenCalledTimes(4)
    expect(attrFormatter).toHaveBeenCalledWith(_record.keys, '_f', { transform: true })
    expect(attrFormatter).toHaveBeenCalledWith(_record.elements, '_foo', options)
    expect(attrFormatter).toHaveBeenCalledWith(_record.keys, '_b', { transform: true })
    expect(attrFormatter).toHaveBeenCalledWith(_record.elements, '_bar', options)

    const { done, value: formattedValue } = formatter.next()
    expect(done).toBe(true)
    expect(formattedValue).toStrictEqual({ f: 'foo', b: 'bar' })
  })

  test('filters attributes if provided', () => {
    const options = { attributes: ['.f'] }
    const formatter = recordAttrFormatter(_record, { _f: '_foo', _b: '_bar' }, options)

    const { value: transformedValue } = formatter.next()
    expect(transformedValue).toStrictEqual({ f: 'foo' })

    expect(attrFormatter).toHaveBeenCalledTimes(3)
    expect(attrFormatter).toHaveBeenCalledWith(_record.keys, '_f', { transform: true })
    expect(attrFormatter).toHaveBeenCalledWith(_record.elements, '_foo', {
      ...options,
      attributes: undefined
    })
    expect(attrFormatter).toHaveBeenCalledWith(_record.keys, '_b', { transform: true })

    const { done, value: formattedValue } = formatter.next()
    expect(done).toBe(true)
    expect(formattedValue).toStrictEqual({ f: 'foo' })
  })

  test('does not transform item if transformed is false', () => {
    const options = { transform: false }
    const formatter = recordAttrFormatter(_record, { f: 'foo', b: 'bar' }, options)

    const { done, value: formattedValue } = formatter.next()
    expect(done).toBe(true)
    expect(formattedValue).toStrictEqual({ f: 'foo', b: 'bar' })

    expect(attrFormatter).toHaveBeenCalledTimes(4)
    expect(attrFormatter).toHaveBeenCalledWith(_record.keys, 'f', options)
    expect(attrFormatter).toHaveBeenCalledWith(_record.elements, 'foo', options)
    expect(attrFormatter).toHaveBeenCalledWith(_record.keys, 'b', options)
    expect(attrFormatter).toHaveBeenCalledWith(_record.elements, 'bar', options)
  })

  // TODO: Apply validation
})
