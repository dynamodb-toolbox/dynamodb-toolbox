import { jsonizedAttrParser } from './attribute.js'
import type { JSONizedAttr } from './attribute.js'

describe('jsonize - primitive schema', () => {
  test('accepts valid primitive definition', () => {
    const jsonizedStrAttr: JSONizedAttr = { type: 'string' }

    expect(jsonizedAttrParser.validate(jsonizedStrAttr)).toBe(true)
  })

  test('rejects invalid enum', () => {
    const jsonizedStrAttr: JSONizedAttr = {
      type: 'string',
      // @ts-expect-error
      enum: ['foo', 'bar', 42]
    }

    expect(jsonizedAttrParser.validate(jsonizedStrAttr)).toBe(false)
  })

  test('accepts primitive with valid default value', () => {
    const jsonizedStrAttr: JSONizedAttr = {
      type: 'string',
      defaults: { put: { defaulterId: 'value', value: 'foo' } }
    }

    expect(jsonizedAttrParser.validate(jsonizedStrAttr)).toBe(true)
  })

  test.todo('rejects primitive with invalid default value', () => {
    const jsonizedStrAttr: JSONizedAttr = {
      type: 'string',
      defaults: { put: { defaulterId: 'value', value: 42 } }
    }

    expect(jsonizedAttrParser.validate(jsonizedStrAttr)).toBe(false)
  })
})
