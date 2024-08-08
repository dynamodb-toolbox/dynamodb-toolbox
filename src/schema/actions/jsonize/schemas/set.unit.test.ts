import { jsonAttrParser } from './attribute.js'
import type { JSONizedAttr } from './attribute.js'

describe('jsonize - set schema', () => {
  test('accepts valid set definition', () => {
    const jsonSetAttr: JSONizedAttr = {
      type: 'set',
      elements: { type: 'string' }
    }

    expect(jsonAttrParser.validate(jsonSetAttr)).toBe(true)
  })

  test('rejects invalid enum', () => {
    const jsonSetAttr: JSONizedAttr = {
      type: 'set',
      elements: {
        type: 'string',
        // @ts-expect-error
        enum: ['foo', 'bar', 42]
      }
    }

    expect(jsonAttrParser.validate(jsonSetAttr)).toBe(false)
  })

  test('accepts set with valid default value', () => {
    const jsonSetAttr: JSONizedAttr = {
      type: 'set',
      elements: { type: 'string' },
      defaults: { put: { defaulterType: 'value', value: ['foo', 'bar'] } }
    }

    expect(jsonAttrParser.validate(jsonSetAttr)).toBe(true)
  })

  test.todo('rejects set with invalid default value', () => {
    const jsonSetAttr: JSONizedAttr = {
      type: 'set',
      elements: { type: 'string' },
      defaults: { put: { defaulterType: 'value', value: ['foo', 'bar', 42] } }
    }

    expect(jsonAttrParser.validate(jsonSetAttr)).toBe(false)
  })
})
