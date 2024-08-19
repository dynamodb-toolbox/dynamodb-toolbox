import { jsonizedAttrParser } from './attribute.js'
import type { JSONizedAttr } from './attribute.js'

describe('jsonize - map schema', () => {
  test('accepts valid map definition', () => {
    const jsonizedMapAttr: JSONizedAttr = {
      type: 'map',
      attributes: { str: { type: 'string' }, num: { type: 'number' } }
    }

    expect(jsonizedAttrParser.validate(jsonizedMapAttr)).toBe(true)
  })

  test('rejects map with invalid element attribute', () => {
    const jsonizedMapAttr: JSONizedAttr = {
      type: 'map',
      attributes: {
        str: {
          // @ts-expect-error
          type: 'invalid'
        },
        num: { type: 'number' }
      }
    }

    expect(jsonizedAttrParser.validate(jsonizedMapAttr)).toBe(false)
  })

  test('rejects map with invalid element constraint', () => {
    const jsonizedMapAttr: JSONizedAttr = {
      type: 'map',
      attributes: {
        str: { type: 'string' },
        num: { type: 'number', savedAs: 'str' }
      }
    }

    expect(jsonizedAttrParser.validate(jsonizedMapAttr)).toBe(false)
  })

  test('accepts map with valid default value', () => {
    const jsonizedMapAttr: JSONizedAttr = {
      type: 'map',
      attributes: { str: { type: 'string' }, num: { type: 'number' } },
      defaults: {
        put: {
          defaulterId: 'value',
          value: { str: 'string', num: 42 }
        }
      }
    }

    expect(jsonizedAttrParser.validate(jsonizedMapAttr)).toBe(true)
  })

  test.todo('rejects map with invalid default value', () => {
    const jsonizedMapAttr: JSONizedAttr = {
      type: 'map',
      attributes: { str: { type: 'string' }, num: { type: 'number' } },
      defaults: {
        put: {
          defaulterId: 'value',
          value: { str: 'string', num: '42' }
        }
      }
    }

    expect(jsonizedAttrParser.validate(jsonizedMapAttr)).toBe(false)
  })
})
