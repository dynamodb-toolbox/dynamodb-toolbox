import { jsonAttrParser } from './attribute.js'
import type { JSONizedAttr } from './attribute.js'

describe('jsonize - primitive schema', () => {
  test('accepts valid primitive definition', () => {
    const jsonStrAttr: JSONizedAttr = { type: 'string' }

    expect(jsonAttrParser.validate(jsonStrAttr)).toBe(true)
  })

  test('rejects invalid enum', () => {
    const jsonStrAttr: JSONizedAttr = {
      type: 'string',
      // @ts-expect-error
      enum: ['foo', 'bar', 42]
    }

    expect(jsonAttrParser.validate(jsonStrAttr)).toBe(false)
  })

  test('accepts primitive with valid default value', () => {
    const jsonStrAttr: JSONizedAttr = {
      type: 'string',
      defaults: { put: { defaulterId: 'value', value: 'foo' } }
    }

    expect(jsonAttrParser.validate(jsonStrAttr)).toBe(true)
  })

  test.todo('rejects primitive with invalid default value', () => {
    const jsonStrAttr: JSONizedAttr = {
      type: 'string',
      defaults: { put: { defaulterId: 'value', value: 42 } }
    }

    expect(jsonAttrParser.validate(jsonStrAttr)).toBe(false)
  })
})
