import { attributeDTOParser } from './attribute.js'
import type { IAttributeDTO } from './attribute.js'

describe('DTO - set schema', () => {
  test('accepts valid set definition', () => {
    const setAttrDTO: IAttributeDTO = {
      type: 'set',
      elements: { type: 'string' }
    }

    expect(attributeDTOParser.validate(setAttrDTO)).toBe(true)
  })

  test('rejects invalid enum', () => {
    const setAttrDTO: IAttributeDTO = {
      type: 'set',
      elements: {
        type: 'string',
        // @ts-expect-error
        enum: [false, 42]
      }
    }

    expect(attributeDTOParser.validate(setAttrDTO)).toBe(false)
  })

  test('accepts set with valid default value', () => {
    const setAttrDTO: IAttributeDTO = {
      type: 'set',
      elements: { type: 'string' },
      defaults: { put: { defaulterId: 'value', value: ['foo', 'bar'] } }
    }

    expect(attributeDTOParser.validate(setAttrDTO)).toBe(true)
  })

  test.todo('rejects set with invalid default value', () => {
    const setAttrDTO: IAttributeDTO = {
      type: 'set',
      elements: { type: 'string' },
      defaults: { put: { defaulterId: 'value', value: ['foo', 'bar', 42] } }
    }

    expect(attributeDTOParser.validate(setAttrDTO)).toBe(false)
  })
})
