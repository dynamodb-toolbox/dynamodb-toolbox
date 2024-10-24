import { attributeDTOParser } from './attribute.js'
import type { IAttributeDTO } from './attribute.js'

describe('DTO - primitive schema', () => {
  test('accepts valid primitive definition', () => {
    const strAttrDTO: IAttributeDTO = { type: 'string' }

    expect(attributeDTOParser.validate(strAttrDTO)).toBe(true)
  })

  test('rejects invalid enum', () => {
    const strAttrDTO: IAttributeDTO = {
      type: 'string',
      // @ts-expect-error
      enum: ['foo', 'bar', 42]
    }

    expect(attributeDTOParser.validate(strAttrDTO)).toBe(false)
  })

  test('accepts primitive with valid default value', () => {
    const strAttrDTO: IAttributeDTO = {
      type: 'string',
      defaults: { put: { defaulterId: 'value', value: 'foo' } }
    }

    expect(attributeDTOParser.validate(strAttrDTO)).toBe(true)
  })

  test.todo('rejects primitive with invalid default value', () => {
    const strAttrDTO: IAttributeDTO = {
      type: 'string',
      defaults: { put: { defaulterId: 'value', value: 42 } }
    }

    expect(attributeDTOParser.validate(strAttrDTO)).toBe(false)
  })
})
