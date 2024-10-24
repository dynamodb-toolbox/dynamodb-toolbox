import { attributeDTOParser } from './attribute.js'
import type { IAttributeDTO } from './attribute.js'

describe('DTO - anyOf schema', () => {
  test('accepts valid anyOf definition', () => {
    const anyOfAttrDTO: IAttributeDTO = {
      type: 'anyOf',
      elements: [{ type: 'string' }, { type: 'number' }]
    }

    expect(attributeDTOParser.validate(anyOfAttrDTO)).toBe(true)
  })

  test('rejects anyOf with invalid element attribute', () => {
    const anyOfAttrDTO: IAttributeDTO = {
      type: 'anyOf',
      elements: [
        {
          // @ts-expect-error
          type: 'invalid'
        },
        { type: 'number' }
      ]
    }

    expect(attributeDTOParser.validate(anyOfAttrDTO)).toBe(false)
  })

  test('rejects anyOf with invalid element constraint', () => {
    const anyOfAttrDTO: IAttributeDTO = {
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

    expect(attributeDTOParser.validate(anyOfAttrDTO)).toBe(false)
  })

  test('accepts anyOf with valid default value', () => {
    const anyOfAttrDTO: IAttributeDTO = {
      type: 'anyOf',
      elements: [{ type: 'string' }, { type: 'number' }],
      defaults: { put: { defaulterId: 'value', value: 'string' } }
    }

    expect(attributeDTOParser.validate(anyOfAttrDTO)).toBe(true)
  })

  test.todo('rejects anyOf with invalid default value', () => {
    const jsonAnyOfAttr: IAttributeDTO = {
      type: 'anyOf',
      elements: [{ type: 'string' }, { type: 'number' }],
      defaults: { put: { defaulterId: 'value', value: 42 } }
    }

    expect(attributeDTOParser.validate(jsonAnyOfAttr)).toBe(false)
  })
})
