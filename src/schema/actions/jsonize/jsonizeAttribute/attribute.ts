import type { Attribute } from '~/attributes/index.js'

import type { JSONizedAttr } from '../schemas/index.js'
import { jsonizeAnyAttribute } from './any.js'
import { jsonizeAnyOfAttribute } from './anyOf.js'
import { jsonizeListAttribute } from './list.js'
import { jsonizeMapAttribute } from './map.js'
import { jsonizePrimitiveAttribute } from './primitive.js'
import { jsonizeRecordAttribute } from './record.js'
import { jsonizeSetAttribute } from './set.js'

export const jsonizeAttribute = (attr: Attribute): JSONizedAttr => {
  /**
   * @debt feature "handle defaults, links & validators"
   */
  switch (attr.type) {
    case 'any':
      return jsonizeAnyAttribute(attr)
    case 'null':
    case 'boolean':
    case 'number':
    case 'string':
    case 'binary':
      return jsonizePrimitiveAttribute(attr)
    case 'set':
      return jsonizeSetAttribute(attr)
    case 'list':
      return jsonizeListAttribute(attr)
    case 'map':
      return jsonizeMapAttribute(attr)
    case 'record':
      return jsonizeRecordAttribute(attr)
    case 'anyOf':
      return jsonizeAnyOfAttribute(attr)
  }
}
