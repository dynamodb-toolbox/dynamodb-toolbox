import type {
  BinaryAttribute,
  NumberAttribute,
  PrimitiveAttribute,
  PrimitiveAttributeType,
  StringAttribute
} from '~/attributes/index.js'
import { $transformerId } from '~/attributes/primitive/constants.js'
import { PRIMITIVE_DEFAULT_OPTIONS } from '~/attributes/primitive/options.js'
import type { JSONizableTransformer } from '~/attributes/primitive/types.js'
import { isEmpty } from '~/utils/isEmpty.js'
import { isObject } from '~/utils/validation/isObject.js'

import type { JSONizedAttr } from '../schema/index.js'
import { jsonizeDefaults } from './utils.js'

const isJSONizableTransformer = (transformer: unknown): transformer is JSONizableTransformer =>
  isObject(transformer) && $transformerId in transformer && 'jsonize' in transformer

/**
 * @debt feature "handle JSONizable defaults, links & validators"
 */
export const jsonizePrimitiveAttribute = (
  attr: PrimitiveAttribute | NumberAttribute | StringAttribute | BinaryAttribute
): JSONizedAttr => {
  const jsonizedDefaults = jsonizeDefaults(attr)

  const jsonizedAttr = {
    type: attr.type,
    ...(attr.required !== PRIMITIVE_DEFAULT_OPTIONS.required ? { required: attr.required } : {}),
    ...(attr.hidden !== PRIMITIVE_DEFAULT_OPTIONS.hidden ? { hidden: attr.hidden } : {}),
    ...(attr.key !== PRIMITIVE_DEFAULT_OPTIONS.key ? { key: attr.key } : {}),
    ...(attr.savedAs !== undefined ? { savedAs: attr.savedAs } : {}),
    ...(attr.transform !== undefined
      ? {
          transform: isJSONizableTransformer(attr.transform)
            ? attr.transform.jsonize()
            : { transformerId: 'custom' }
        }
      : {}),
    ...(!isEmpty(jsonizedDefaults) ? { defaults: jsonizedDefaults } : {})
    // We need to cast as `.enum` is not coupled to `.type`
  } as Extract<JSONizedAttr, { type: PrimitiveAttributeType | 'number' | 'string' }>

  if (attr.enum) {
    if (attr.type === 'binary') {
      const textDecoder = new TextDecoder('utf8')
      jsonizedAttr.enum = (attr.enum as Uint8Array[]).map(value => btoa(textDecoder.decode(value)))
    } else {
      jsonizedAttr.enum = attr.enum as string[] | number[] | boolean[] | null[]
    }
  }

  return jsonizedAttr
}
