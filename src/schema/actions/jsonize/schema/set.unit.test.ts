import { jsonizedAttrParser } from './attribute.js'
import type { JSONizedAttr } from './attribute.js'

describe('jsonize - set schema', () => {
  test('accepts valid set definition', () => {
    const jsonizedSetAttr: JSONizedAttr = {
      type: 'set',
      elements: { type: 'string' }
    }

    expect(jsonizedAttrParser.validate(jsonizedSetAttr)).toBe(true)
  })

  test('rejects invalid enum', () => {
    const jsonizedSetAttr: JSONizedAttr = {
      type: 'set',
      elements: {
        type: 'string',
        // @ts-expect-error
        enum: ['foo', 'bar', 42]
      }
    }

    expect(jsonizedAttrParser.validate(jsonizedSetAttr)).toBe(false)
  })

  test('accepts set with valid default value', () => {
    const jsonizedSetAttr: JSONizedAttr = {
      type: 'set',
      elements: { type: 'string' },
      defaults: { put: { defaulterId: 'value', value: ['foo', 'bar'] } }
    }

    expect(jsonizedAttrParser.validate(jsonizedSetAttr)).toBe(true)
  })

  test.todo('rejects set with invalid default value', () => {
    const jsonizedSetAttr: JSONizedAttr = {
      type: 'set',
      elements: { type: 'string' },
      defaults: { put: { defaulterId: 'value', value: ['foo', 'bar', 42] } }
    }

    expect(jsonizedAttrParser.validate(jsonizedSetAttr)).toBe(false)
  })
})
