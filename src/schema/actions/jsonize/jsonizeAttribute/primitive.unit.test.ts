import { string } from '~/attributes/index.js'
import { prefix } from '~/transformers/prefix.js'

import { jsonizePrimitiveAttribute } from './primitive'

describe('jsonizePrimitiveAttribute', () => {
  test('correctly exports attribute', () => {
    const attr = string().freeze()

    expect(jsonizePrimitiveAttribute(attr)).toStrictEqual({ type: 'string' })
  })

  test('correctly exports required attribute', () => {
    const attr = string().required('always').freeze()

    expect(jsonizePrimitiveAttribute(attr)).toStrictEqual({ type: 'string', required: 'always' })
  })

  test('correctly exports key attribute', () => {
    const attr = string().key().freeze()

    expect(jsonizePrimitiveAttribute(attr)).toStrictEqual({
      type: 'string',
      required: 'always',
      key: true
    })
  })

  test('correctly exports hidden attribute', () => {
    const attr = string().hidden().freeze()

    expect(jsonizePrimitiveAttribute(attr)).toStrictEqual({ type: 'string', hidden: true })
  })

  test('correctly exports renamed attribute', () => {
    const attr = string().savedAs('foo').freeze()

    expect(jsonizePrimitiveAttribute(attr)).toStrictEqual({ type: 'string', savedAs: 'foo' })
  })

  test('correctly exports transformed attribute (JSONizable transformer)', () => {
    const attr = string().transform(prefix('PREFIX')).freeze()

    expect(jsonizePrimitiveAttribute(attr)).toStrictEqual({
      type: 'string',
      transform: { transformerId: 'prefix', delimiter: '#', prefix: 'PREFIX' }
    })
  })

  test('correctly exports transformed attribute (custom transformer)', () => {
    const attr = string()
      .transform({ parse: () => 'a', format: () => 'b' })
      .freeze()

    expect(jsonizePrimitiveAttribute(attr)).toStrictEqual({
      type: 'string',
      transform: { transformerId: 'custom' }
    })
  })
})
