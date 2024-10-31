import type { PrimitiveAttribute } from '~/attributes/index.js'
import type { TypedTransformerWithDTO } from '~/transformers/index.js'
import { isEmpty } from '~/utils/isEmpty.js'
import { isBigInt } from '~/utils/validation/isBigInt.js'
import { isObject } from '~/utils/validation/isObject.js'

import type { PrimitiveAttrDTO } from '../types.js'
import { getDefaultsDTO } from './utils.js'

const isTransformerWithDTO = (transformer: unknown): transformer is TypedTransformerWithDTO =>
  isObject(transformer) && 'transformerId' in transformer && 'toJSON' in transformer

/**
 * @debt feature "handle defaults, links & validators DTOs"
 */
export const getPrimitiveAttrDTO = (attr: PrimitiveAttribute): PrimitiveAttrDTO => {
  const defaultsDTO = getDefaultsDTO(attr)

  const attrDTO = {
    type: attr.type,
    ...(attr.required !== 'atLeastOnce' ? { required: attr.required } : {}),
    ...(attr.hidden !== false ? { hidden: attr.hidden } : {}),
    ...(attr.key !== false ? { key: attr.key } : {}),
    ...(attr.savedAs !== undefined ? { savedAs: attr.savedAs } : {}),
    ...(attr.transform !== undefined
      ? {
          transform: isTransformerWithDTO(attr.transform)
            ? attr.transform.toJSON()
            : { transformerId: 'custom' }
        }
      : {}),
    ...(!isEmpty(defaultsDTO) ? { defaults: defaultsDTO } : {})
    // We need to cast as `.enum` is not coupled to `.type`
  } as PrimitiveAttrDTO

  if (attr.enum) {
    switch (attr.type) {
      case 'binary': {
        const textDecoder = new TextDecoder('utf8')
        // @ts-ignore type inference can be improved here (NullAttrDTO has no 'enum' prop)
        attrDTO.enum = (attr.enum as Uint8Array[]).map(value => btoa(textDecoder.decode(value)))
        break
      }
      case 'number': {
        // @ts-ignore type inference can be improved here (NullAttrDTO has no 'enum' prop)
        attrDTO.enum = attr.enum.map(value => (isBigInt(value) ? value.toString() : value))
        break
      }
      default:
        // @ts-ignore type inference can be improved here (NullAttrDTO has no 'enum' prop)
        attrDTO.enum = attr.enum
    }
  }

  return attrDTO
}
