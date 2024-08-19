import { jsonizedAttrParser } from './attribute.js'
import type { JSONizedAttr } from './attribute.js'

describe('jsonize - any schema', () => {
  test('accepts valid anyOf definition', () => {
    const jsonizedAnyAttr: JSONizedAttr = { type: 'any' }

    expect(jsonizedAttrParser.validate(jsonizedAnyAttr)).toBe(true)
  })

  test('accepts anyOf with any default value', () => {
    const jsonizedAnyAttr: JSONizedAttr = {
      type: 'any',
      defaults: { put: { defaulterId: 'value', value: 'string' } }
    }

    expect(jsonizedAttrParser.validate(jsonizedAnyAttr)).toBe(true)
  })
})
