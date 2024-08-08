import { jsonAttrParser } from './attribute.js'
import type { JSONizedAttr } from './attribute.js'

describe('jsonize - record schema', () => {
  test('accepts valid record definition', () => {
    const jsonRecordAttr: JSONizedAttr = {
      type: 'record',
      keys: { type: 'string' },
      elements: { type: 'string' }
    }

    expect(jsonAttrParser.validate(jsonRecordAttr)).toBe(true)
  })

  test('rejects record with invalid keys', () => {
    const jsonRecordAttr: JSONizedAttr = {
      type: 'record',
      keys: {
        // @ts-expect-error
        type: 'number'
      },
      elements: { type: 'string' }
    }

    expect(jsonAttrParser.validate(jsonRecordAttr)).toBe(false)
  })

  test('rejects record with invalid elements attribute', () => {
    const jsonRecordAttr: JSONizedAttr = {
      type: 'record',
      keys: { type: 'string' },
      elements: {
        // @ts-expect-error
        type: 'invalid'
      }
    }

    expect(jsonAttrParser.validate(jsonRecordAttr)).toBe(false)
  })

  test('rejects record with invalid element constraint', () => {
    const jsonRecordAttr: JSONizedAttr = {
      type: 'record',
      keys: { type: 'string' },
      elements: {
        type: 'string',
        // @ts-expect-error
        required: 'always'
      }
    }

    expect(jsonAttrParser.validate(jsonRecordAttr)).toBe(false)
  })

  test('accepts record with valid default value', () => {
    const jsonRecordAttr: JSONizedAttr = {
      type: 'record',
      keys: { type: 'string' },
      elements: { type: 'string' },
      defaults: {
        put: {
          defaulterType: 'value',
          value: { str: 'string' }
        }
      }
    }

    expect(jsonAttrParser.validate(jsonRecordAttr)).toBe(true)
  })

  test.todo('rejects record with invalid default value', () => {
    const jsonRecordAttr: JSONizedAttr = {
      type: 'record',
      keys: { type: 'string' },
      elements: { type: 'string' },
      defaults: {
        put: {
          defaulterType: 'value',
          value: { num: 42 }
        }
      }
    }

    expect(jsonAttrParser.validate(jsonRecordAttr)).toBe(false)
  })
})
