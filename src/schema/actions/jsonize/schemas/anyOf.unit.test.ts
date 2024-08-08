import { jsonAttrParser } from './attribute.js'
import type { JSONizedAttr } from './attribute.js'

describe('jsonize - anyOf schema', () => {
  test('accepts valid anyOf definition', () => {
    const jsonAnyOfAttr: JSONizedAttr = {
      type: 'anyOf',
      elements: [{ type: 'string' }, { type: 'number' }]
    }

    expect(jsonAttrParser.validate(jsonAnyOfAttr)).toBe(true)
  })

  test('rejects anyOf with invalid element attribute', () => {
    const jsonAnyOfAttr: JSONizedAttr = {
      type: 'anyOf',
      elements: [
        {
          // @ts-expect-error
          type: 'invalid'
        },
        { type: 'number' }
      ]
    }

    expect(jsonAttrParser.validate(jsonAnyOfAttr)).toBe(false)
  })

  test('rejects anyOf with invalid element constraint', () => {
    const jsonAnyOfAttr: JSONizedAttr = {
      type: 'anyOf',
      elements: [
        {
          type: 'string',
          // @ts-expect-error
          required: 'always'
        },
        { type: 'number' }
      ]
    }

    expect(jsonAttrParser.validate(jsonAnyOfAttr)).toBe(false)
  })

  test('accepts anyOf with valid default value', () => {
    const jsonAnyOfAttr: JSONizedAttr = {
      type: 'anyOf',
      elements: [{ type: 'string' }, { type: 'number' }],
      defaults: { put: { defaulterType: 'value', value: 'string' } }
    }

    expect(jsonAttrParser.validate(jsonAnyOfAttr)).toBe(true)
  })

  test.todo('rejects anyOf with invalid default value', () => {
    const jsonAnyOfAttr: JSONizedAttr = {
      type: 'anyOf',
      elements: [{ type: 'string' }, { type: 'number' }],
      defaults: { put: { defaulterType: 'value', value: 42 } }
    }

    expect(jsonAttrParser.validate(jsonAnyOfAttr)).toBe(false)
  })
})
