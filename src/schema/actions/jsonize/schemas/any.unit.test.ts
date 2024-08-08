import { jsonAttrParser } from './attribute.js'
import type { JSONizedAttr } from './attribute.js'

describe('jsonize - any schema', () => {
  test('accepts valid anyOf definition', () => {
    const jsonAnyAttr: JSONizedAttr = { type: 'any' }

    expect(jsonAttrParser.validate(jsonAnyAttr)).toBe(true)
  })

  test('accepts anyOf with any default value', () => {
    const jsonAnyAttr: JSONizedAttr = {
      type: 'any',
      defaults: { put: { defaulterType: 'value', value: 'string' } }
    }

    expect(jsonAttrParser.validate(jsonAnyAttr)).toBe(true)
  })
})
