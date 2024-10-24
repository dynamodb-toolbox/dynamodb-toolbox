import { attributeDTOParser } from './attribute.js'
import type { IAttributeDTO } from './attribute.js'

describe('DTO - record schema', () => {
  test('accepts valid record definition', () => {
    const recordAttrDTO: IAttributeDTO = {
      type: 'record',
      keys: { type: 'string' },
      elements: { type: 'string' }
    }

    expect(attributeDTOParser.validate(recordAttrDTO)).toBe(true)
  })

  test('rejects record with invalid keys', () => {
    const recordAttrDTO: IAttributeDTO = {
      type: 'record',
      keys: {
        // @ts-expect-error
        type: 'number'
      },
      elements: { type: 'string' }
    }

    expect(attributeDTOParser.validate(recordAttrDTO)).toBe(false)
  })

  test('rejects record with invalid elements attribute', () => {
    const recordAttrDTO: IAttributeDTO = {
      type: 'record',
      keys: { type: 'string' },
      elements: {
        // @ts-expect-error
        type: 'invalid'
      }
    }

    expect(attributeDTOParser.validate(recordAttrDTO)).toBe(false)
  })

  test('rejects record with invalid element constraint', () => {
    const recordAttrDTO: IAttributeDTO = {
      type: 'record',
      keys: { type: 'string' },
      elements: {
        type: 'string',
        // @ts-expect-error
        required: 'always'
      }
    }

    expect(attributeDTOParser.validate(recordAttrDTO)).toBe(false)
  })

  test('accepts record with valid default value', () => {
    const recordAttrDTO: IAttributeDTO = {
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

    expect(attributeDTOParser.validate(recordAttrDTO)).toBe(true)
  })

  test.todo('rejects record with invalid default value', () => {
    const recordAttrDTO: IAttributeDTO = {
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

    expect(attributeDTOParser.validate(recordAttrDTO)).toBe(false)
  })
})
