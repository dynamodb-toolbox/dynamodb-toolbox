import type { PrimitiveAttributeType } from '~/attributes/index.js'
import { $transformerId } from '~/attributes/primitive/constants.js'
import type { PrimitiveAttribute } from '~/attributes/primitive/index.js'
import { PRIMITIVE_DEFAULT_OPTIONS } from '~/attributes/primitive/options.js'
import type { JSONizableTransformer } from '~/attributes/primitive/types.js'
import { isObject } from '~/utils/validation/isObject.js'

import type { JSONizedAttr } from '../schemas/index.js'

const isJSONizableTransformer = (transformer: unknown): transformer is JSONizableTransformer =>
  isObject(transformer) && $transformerId in transformer && 'jsonize' in transformer

/**
 * @debt feature "handle defaults, links & validators"
 */
export const jsonizePrimitiveAttribute = (attr: PrimitiveAttribute): JSONizedAttr =>
  ({
    type: attr.type,
    ...(attr.required !== PRIMITIVE_DEFAULT_OPTIONS.required ? { required: attr.required } : {}),
    ...(attr.hidden !== PRIMITIVE_DEFAULT_OPTIONS.hidden ? { hidden: attr.hidden } : {}),
    ...(attr.key !== PRIMITIVE_DEFAULT_OPTIONS.key ? { key: attr.key } : {}),
    ...(attr.enum !== undefined ? { enum: attr.enum } : {}),
    ...(attr.savedAs !== undefined ? { savedAs: attr.savedAs } : {}),
    ...(attr.transform !== undefined
      ? {
          transform: isJSONizableTransformer(attr.transform)
            ? attr.transform.jsonize()
            : { transformerId: 'custom' }
        }
      : {})
    // We need to cast as `.enum` is not coupled to `.type`
  }) as Extract<JSONizedAttr, { type: PrimitiveAttributeType }>
