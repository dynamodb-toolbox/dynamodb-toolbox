import { jsonAttrParser } from './attribute.js'
import type { JSONizedAttr } from './attribute.js'

describe('jsonize - list schema', () => {
  test('accepts valid list definition', () => {
    const jsonListAttr: JSONizedAttr = {
      type: 'list',
      elements: { type: 'string' }
    }

    expect(jsonAttrParser.validate(jsonListAttr)).toBe(true)
  })

  test('rejects list with invalid element attribute', () => {
    const jsonListAttr: JSONizedAttr = {
      type: 'list',
      elements: {
        // @ts-expect-error
        type: 'invalid'
      }
    }

    expect(jsonAttrParser.validate(jsonListAttr)).toBe(false)
  })

  test('rejects list with invalid element constraint', () => {
    const jsonListAttr: JSONizedAttr = {
      type: 'list',
      elements: {
        type: 'string',
        // @ts-expect-error
        required: 'always'
      }
    }

    expect(jsonAttrParser.validate(jsonListAttr)).toBe(false)
  })

  test('accepts list with valid default value', () => {
    const jsonListAttr: JSONizedAttr = {
      type: 'list',
      elements: { type: 'string' },
      defaults: { put: { defaulterType: 'value', value: 'string' } }
    }

    expect(jsonAttrParser.validate(jsonListAttr)).toBe(true)
  })

  test.todo('rejects list with invalid default value', () => {
    const jsonListAttr: JSONizedAttr = {
      type: 'list',
      elements: { type: 'string' },
      defaults: { put: { defaulterType: 'value', value: 42 } }
    }

    expect(jsonAttrParser.validate(jsonListAttr)).toBe(false)
  })
})
