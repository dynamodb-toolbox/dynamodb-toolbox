import { attributeDTOParser } from './attribute.js'
import type { IAttributeDTO } from './attribute.js'

describe('DTO - map schema', () => {
  test('accepts valid map definition', () => {
    const mapAttrDTO: IAttributeDTO = {
      type: 'map',
      attributes: { str: { type: 'string' }, num: { type: 'number' } }
    }

    expect(attributeDTOParser.validate(mapAttrDTO)).toBe(true)
  })

  test('rejects map with invalid element attribute', () => {
    const mapAttrDTO: IAttributeDTO = {
      type: 'map',
      attributes: {
        str: {
          // @ts-expect-error
          type: 'invalid'
        },
        num: { type: 'number' }
      }
    }

    expect(attributeDTOParser.validate(mapAttrDTO)).toBe(false)
  })

  test('rejects map with invalid element constraint', () => {
    const mapAttrDTO: IAttributeDTO = {
      type: 'map',
      attributes: {
        str: { type: 'string' },
        num: { type: 'number', savedAs: 'str' }
      }
    }

    expect(attributeDTOParser.validate(mapAttrDTO)).toBe(false)
  })

  test('accepts map with valid default value', () => {
    const mapAttrDTO: IAttributeDTO = {
      type: 'map',
      attributes: { str: { type: 'string' }, num: { type: 'number' } },
      defaults: {
        put: {
          defaulterId: 'value',
          value: { str: 'string', num: 42 }
        }
      }
    }

    expect(attributeDTOParser.validate(mapAttrDTO)).toBe(true)
  })

  test.todo('rejects map with invalid default value', () => {
    const mapAttrDTO: IAttributeDTO = {
      type: 'map',
      attributes: { str: { type: 'string' }, num: { type: 'number' } },
      defaults: {
        put: {
          defaulterId: 'value',
          value: { str: 'string', num: '42' }
        }
      }
    }

    expect(attributeDTOParser.validate(mapAttrDTO)).toBe(false)
  })
})
