import { jsonAttrParser } from './attribute.js'
import type { JSONizedAttr } from './attribute.js'

describe('jsonize - map schema', () => {
  test('accepts valid map definition', () => {
    const jsonMapAttr: JSONizedAttr = {
      type: 'map',
      attributes: { str: { type: 'string' }, num: { type: 'number' } }
    }

    expect(jsonAttrParser.validate(jsonMapAttr)).toBe(true)
  })

  test('rejects map with invalid element attribute', () => {
    const jsonMapAttr: JSONizedAttr = {
      type: 'map',
      attributes: {
        str: {
          // @ts-expect-error
          type: 'invalid'
        },
        num: { type: 'number' }
      }
    }

    expect(jsonAttrParser.validate(jsonMapAttr)).toBe(false)
  })

  test('rejects map with invalid element constraint', () => {
    const jsonMapAttr: JSONizedAttr = {
      type: 'map',
      attributes: {
        str: { type: 'string' },
        num: { type: 'number', savedAs: 'str' }
      }
    }

    expect(jsonAttrParser.validate(jsonMapAttr)).toBe(false)
  })

  test('accepts map with valid default value', () => {
    const jsonMapAttr: JSONizedAttr = {
      type: 'map',
      attributes: { str: { type: 'string' }, num: { type: 'number' } },
      defaults: {
        put: {
          defaulterId: 'value',
          value: { str: 'string', num: 42 }
        }
      }
    }

    expect(jsonAttrParser.validate(jsonMapAttr)).toBe(true)
  })

  test.todo('rejects map with invalid default value', () => {
    const jsonMapAttr: JSONizedAttr = {
      type: 'map',
      attributes: { str: { type: 'string' }, num: { type: 'number' } },
      defaults: {
        put: {
          defaulterId: 'value',
          value: { str: 'string', num: '42' }
        }
      }
    }

    expect(jsonAttrParser.validate(jsonMapAttr)).toBe(false)
  })
})
