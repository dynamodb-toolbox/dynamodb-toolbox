import { any } from '~/attributes/index.js'
import { jsonStringify } from '~/transformers/jsonStringify.js'

import { getAnyAttrDTO } from './any.js'

describe('getAnyAttrDTO', () => {
  test('correctly exports attribute', () => {
    const attr = any()

    expect(getAnyAttrDTO(attr)).toStrictEqual({ type: 'any' })
  })

  test('correctly exports required attribute', () => {
    const attr = any().required('always')

    expect(getAnyAttrDTO(attr)).toStrictEqual({ type: 'any', required: 'always' })
  })

  test('correctly exports key attribute', () => {
    const attr = any().key()

    expect(getAnyAttrDTO(attr)).toStrictEqual({
      type: 'any',
      required: 'always',
      key: true
    })
  })

  test('correctly exports hidden attribute', () => {
    const attr = any().hidden()

    expect(getAnyAttrDTO(attr)).toStrictEqual({ type: 'any', hidden: true })
  })

  test('correctly exports renamed attribute', () => {
    const attr = any().savedAs('foo')

    expect(getAnyAttrDTO(attr)).toStrictEqual({ type: 'any', savedAs: 'foo' })
  })

  test('correctly exports transformed attribute (with transformer DTO)', () => {
    const attr = any().transform(jsonStringify({ space: 2 }))

    expect(getAnyAttrDTO(attr)).toStrictEqual({
      type: 'any',
      transform: { transformerId: 'jsonStringify', space: 2 }
    })
  })

  test('correctly exports transformed attribute (custom transformer)', () => {
    const attr = any().transform({ encode: () => 'a', decode: () => 'b' })

    expect(getAnyAttrDTO(attr)).toStrictEqual({
      type: 'any',
      transform: { transformerId: 'custom' }
    })
  })

  test('correctly exports defaulted attribute', () => {
    const attr = any().default('foo')

    expect(getAnyAttrDTO(attr)).toStrictEqual({
      type: 'any',
      putDefault: { defaulterId: 'value', value: 'foo' }
    })
  })

  test('correctly exports defaulted attribute (custom default)', () => {
    const attr = any().default(() => 'foo')

    expect(getAnyAttrDTO(attr)).toStrictEqual({
      type: 'any',
      putDefault: { defaulterId: 'custom' }
    })
  })
})
