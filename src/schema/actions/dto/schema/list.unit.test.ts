import { attributeDTOParser } from './attribute.js'
import type { IAttributeDTO } from './attribute.js'

describe('DTO - list schema', () => {
  test('accepts valid list definition', () => {
    const listAttrDTO: IAttributeDTO = {
      type: 'list',
      elements: { type: 'string' }
    }

    expect(attributeDTOParser.validate(listAttrDTO)).toBe(true)
  })

  test('rejects list with invalid element attribute', () => {
    const listAttrDTO: IAttributeDTO = {
      type: 'list',
      elements: {
        // @ts-expect-error
        type: 'invalid'
      }
    }

    expect(attributeDTOParser.validate(listAttrDTO)).toBe(false)
  })

  test('rejects list with invalid element constraint', () => {
    const listAttrDTO: IAttributeDTO = {
      type: 'list',
      elements: {
        type: 'string',
        // @ts-expect-error
        required: 'always'
      }
    }

    expect(attributeDTOParser.validate(listAttrDTO)).toBe(false)
  })

  test('accepts list with valid default value', () => {
    const listAttrDTO: IAttributeDTO = {
      type: 'list',
      elements: { type: 'string' },
      defaults: { put: { defaulterId: 'value', value: 'string' } }
    }

    expect(attributeDTOParser.validate(listAttrDTO)).toBe(true)
  })

  test.todo('rejects list with invalid default value', () => {
    const listAttrDTO: IAttributeDTO = {
      type: 'list',
      elements: { type: 'string' },
      defaults: { put: { defaulterId: 'value', value: 42 } }
    }

    expect(attributeDTOParser.validate(listAttrDTO)).toBe(false)
  })
})
