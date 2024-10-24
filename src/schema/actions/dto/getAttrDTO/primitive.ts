import type { PrimitiveAttribute } from '~/attributes/index.js'
import type { JSONizableTransformer } from '~/transformers/index.js'
import { isEmpty } from '~/utils/isEmpty.js'
import { isBigInt } from '~/utils/validation/isBigInt.js'
import { isObject } from '~/utils/validation/isObject.js'

import type { IAttributeDTO } from '../schema/index.js'
import { getDefaultsDTO } from './utils.js'

// TODO: use toJSON rather than jsonize
const isJSONizableTransformer = (transformer: unknown): transformer is JSONizableTransformer =>
  isObject(transformer) && 'transformerId' in transformer && 'jsonize' in transformer

/**
 * @debt feature "handle JSONizable defaults, links & validators"
 */
export const getPrimitiveAttrDTO = (attr: PrimitiveAttribute): IAttributeDTO => {
  const defaultsDTO = getDefaultsDTO(attr)

  const attrDTO = {
    type: attr.type,
    ...(attr.required !== 'atLeastOnce' ? { required: attr.required } : {}),
    ...(attr.hidden !== false ? { hidden: attr.hidden } : {}),
    ...(attr.key !== false ? { key: attr.key } : {}),
    ...(attr.savedAs !== undefined ? { savedAs: attr.savedAs } : {}),
    ...(attr.transform !== undefined
      ? {
          transform: isJSONizableTransformer(attr.transform)
            ? attr.transform.jsonize()
            : { transformerId: 'custom' }
        }
      : {}),
    ...(!isEmpty(defaultsDTO) ? { defaults: defaultsDTO } : {})
    // We need to cast as `.enum` is not coupled to `.type`
  } as Extract<IAttributeDTO, { type: 'null' | 'boolean' | 'number' | 'string' | 'binary' }>

  if (attr.enum) {
    switch (attr.type) {
      case 'binary': {
        const textDecoder = new TextDecoder('utf8')
        attrDTO.enum = (attr.enum as Uint8Array[]).map(value => btoa(textDecoder.decode(value)))
        break
      }
      case 'number': {
        attrDTO.enum = attr.enum.map(value => (isBigInt(value) ? value.toString() : value))
        break
      }
      default:
        attrDTO.enum = attr.enum
    }
  }

  return attrDTO
}
