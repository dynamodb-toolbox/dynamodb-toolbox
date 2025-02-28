import type { PrimitiveSchema } from '~/schema/index.js'
import { isBigInt } from '~/utils/validation/isBigInt.js'

import type { PrimitiveSchemaDTO } from '../types.js'
import { getDefaultsDTO, isTransformerWithDTO } from './utils.js'

/**
 * @debt feature "handle defaults, links & validators DTOs"
 */
export const getPrimitiveSchemaDTO = (schema: PrimitiveSchema): PrimitiveSchemaDTO => {
  const defaultsDTO = getDefaultsDTO(schema)

  const { props } = schema
  const { required, hidden, key, savedAs, transform } = props

  const attrDTO = {
    type: schema.type,
    ...(required !== undefined && required !== 'atLeastOnce' ? { required } : {}),
    ...(hidden !== undefined && hidden !== false ? { hidden } : {}),
    ...(key !== undefined && key !== false ? { key } : {}),
    ...(savedAs !== undefined ? { savedAs } : {}),
    ...(transform !== undefined
      ? {
          transform: isTransformerWithDTO(transform)
            ? transform.toJSON()
            : { transformerId: 'custom' }
        }
      : {}),
    ...defaultsDTO
    // We need to cast as `.enum` is not coupled to `.type`
  } as PrimitiveSchemaDTO

  if (props.enum) {
    switch (schema.type) {
      case 'binary': {
        const textDecoder = new TextDecoder('utf8')
        // @ts-ignore type inference can be improved here
        attrDTO.enum = (props.enum as Uint8Array[]).map(value => btoa(textDecoder.decode(value)))
        break
      }
      case 'number': {
        // @ts-ignore type inference can be improved here
        attrDTO.enum = props.enum.map(value => (isBigInt(value) ? value.toString() : value))
        break
      }
      default:
        // @ts-ignore type inference can be improved here
        attrDTO.enum = props.enum
    }
  }

  return attrDTO
}
