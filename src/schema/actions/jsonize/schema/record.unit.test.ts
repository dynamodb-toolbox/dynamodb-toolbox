import { jsonizedAttrParser } from './attribute.js'
import type { JSONizedAttr } from './attribute.js'

describe('jsonize - record schema', () => {
  test('accepts valid record definition', () => {
    const jsonizedRecordAttr: JSONizedAttr = {
      type: 'record',
      keys: { type: 'string' },
      elements: { type: 'string' }
    }

    expect(jsonizedAttrParser.validate(jsonizedRecordAttr)).toBe(true)
  })

  test('rejects record with invalid keys', () => {
    const jsonizedRecordAttr: JSONizedAttr = {
      type: 'record',
      keys: {
        // @ts-expect-error
        type: 'number'
      },
      elements: { type: 'string' }
    }

    expect(jsonizedAttrParser.validate(jsonizedRecordAttr)).toBe(false)
  })

  test('rejects record with invalid elements attribute', () => {
    const jsonizedRecordAttr: JSONizedAttr = {
      type: 'record',
      keys: { type: 'string' },
      elements: {
        // @ts-expect-error
        type: 'invalid'
      }
    }

    expect(jsonizedAttrParser.validate(jsonizedRecordAttr)).toBe(false)
  })

  test('rejects record with invalid element constraint', () => {
    const jsonizedRecordAttr: JSONizedAttr = {
      type: 'record',
      keys: { type: 'string' },
      elements: {
        type: 'string',
        // @ts-expect-error
        required: 'always'
      }
    }

    expect(jsonizedAttrParser.validate(jsonizedRecordAttr)).toBe(false)
  })

  test('accepts record with valid default value', () => {
    const jsonizedRecordAttr: JSONizedAttr = {
      type: 'record',
      keys: { type: 'string' },
      elements: { type: 'string' },
      defaults: {
        put: {
          defaulterId: 'value',
          value: { str: 'string' }
        }
      }
    }

    expect(jsonizedAttrParser.validate(jsonizedRecordAttr)).toBe(true)
  })

  test.todo('rejects record with invalid default value', () => {
    const jsonizedRecordAttr: JSONizedAttr = {
      type: 'record',
      keys: { type: 'string' },
      elements: { type: 'string' },
      defaults: {
        put: {
          defaulterId: 'value',
          value: { num: 42 }
        }
      }
    }

    expect(jsonizedAttrParser.validate(jsonizedRecordAttr)).toBe(false)
  })
})
