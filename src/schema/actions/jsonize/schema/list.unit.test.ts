import { jsonizedAttrParser } from './attribute.js'
import type { JSONizedAttr } from './attribute.js'

describe('jsonize - list schema', () => {
  test('accepts valid list definition', () => {
    const jsonizedListAttr: JSONizedAttr = {
      type: 'list',
      elements: { type: 'string' }
    }

    expect(jsonizedAttrParser.validate(jsonizedListAttr)).toBe(true)
  })

  test('rejects list with invalid element attribute', () => {
    const jsonizedListAttr: JSONizedAttr = {
      type: 'list',
      elements: {
        // @ts-expect-error
        type: 'invalid'
      }
    }

    expect(jsonizedAttrParser.validate(jsonizedListAttr)).toBe(false)
  })

  test('rejects list with invalid element constraint', () => {
    const jsonizedListAttr: JSONizedAttr = {
      type: 'list',
      elements: {
        type: 'string',
        // @ts-expect-error
        required: 'always'
      }
    }

    expect(jsonizedAttrParser.validate(jsonizedListAttr)).toBe(false)
  })

  test('accepts list with valid default value', () => {
    const jsonizedListAttr: JSONizedAttr = {
      type: 'list',
      elements: { type: 'string' },
      defaults: { put: { defaulterId: 'value', value: 'string' } }
    }

    expect(jsonizedAttrParser.validate(jsonizedListAttr)).toBe(true)
  })

  test.todo('rejects list with invalid default value', () => {
    const jsonizedListAttr: JSONizedAttr = {
      type: 'list',
      elements: { type: 'string' },
      defaults: { put: { defaulterId: 'value', value: 42 } }
    }

    expect(jsonizedAttrParser.validate(jsonizedListAttr)).toBe(false)
  })
})
