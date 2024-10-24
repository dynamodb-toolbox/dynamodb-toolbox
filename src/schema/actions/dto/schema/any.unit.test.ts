import { attributeDTOParser } from './attribute.js'
import type { IAttributeDTO } from './attribute.js'

describe('DTO - any schema', () => {
  test('accepts valid anyOf definition', () => {
    const anyAttrDTO: IAttributeDTO = { type: 'any' }

    expect(attributeDTOParser.validate(anyAttrDTO)).toBe(true)
  })

  test('accepts anyOf with any default value', () => {
    const anyAttrDTO: IAttributeDTO = {
      type: 'any',
      defaults: { put: { defaulterId: 'value', value: 'string' } }
    }

    expect(attributeDTOParser.validate(anyAttrDTO)).toBe(true)
  })
})
