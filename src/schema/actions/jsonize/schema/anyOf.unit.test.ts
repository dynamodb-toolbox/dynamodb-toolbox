import { jsonizedAttrParser } from './attribute.js'
import type { JSONizedAttr } from './attribute.js'

describe('jsonize - anyOf schema', () => {
  test('accepts valid anyOf definition', () => {
    const jsonizedAnyOfAttr: JSONizedAttr = {
      type: 'anyOf',
      elements: [{ type: 'string' }, { type: 'number' }]
    }

    expect(jsonizedAttrParser.validate(jsonizedAnyOfAttr)).toBe(true)
  })

  test('rejects anyOf with invalid element attribute', () => {
    const jsonizedAnyOfAttr: JSONizedAttr = {
      type: 'anyOf',
      elements: [
        {
          // @ts-expect-error
          type: 'invalid'
        },
        { type: 'number' }
      ]
    }

    expect(jsonizedAttrParser.validate(jsonizedAnyOfAttr)).toBe(false)
  })

  test('rejects anyOf with invalid element constraint', () => {
    const jsonizedAnyOfAttr: JSONizedAttr = {
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

    expect(jsonizedAttrParser.validate(jsonizedAnyOfAttr)).toBe(false)
  })

  test('accepts anyOf with valid default value', () => {
    const jsonizedAnyOfAttr: JSONizedAttr = {
      type: 'anyOf',
      elements: [{ type: 'string' }, { type: 'number' }],
      defaults: { put: { defaulterId: 'value', value: 'string' } }
    }

    expect(jsonizedAttrParser.validate(jsonizedAnyOfAttr)).toBe(true)
  })

  test.todo('rejects anyOf with invalid default value', () => {
    const jsonAnyOfAttr: JSONizedAttr = {
      type: 'anyOf',
      elements: [{ type: 'string' }, { type: 'number' }],
      defaults: { put: { defaulterId: 'value', value: 42 } }
    }

    expect(jsonizedAttrParser.validate(jsonAnyOfAttr)).toBe(false)
  })
})
