import type { AttrSchema } from '~/attributes/index.js'

import type { AttributeDTO } from '../types.js'
import { getAnyAttrDTO } from './any.js'
import { getAnyOfAttrDTO } from './anyOf.js'
import { getListAttrDTO } from './list.js'
import { getMapAttrDTO } from './map.js'
import { getPrimitiveAttrDTO } from './primitive.js'
import { getRecordAttrDTO } from './record.js'
import { getSetAttrDTO } from './set.js'

export const getAttrDTO = (attr: AttrSchema): AttributeDTO => {
  /**
   * @debt feature "handle defaults, links & validators"
   */
  switch (attr.type) {
    case 'any':
      return getAnyAttrDTO(attr)
    case 'null':
    case 'boolean':
    case 'number':
    case 'string':
    case 'binary':
      return getPrimitiveAttrDTO(attr)
    case 'set':
      return getSetAttrDTO(attr)
    case 'list':
      return getListAttrDTO(attr)
    case 'map':
      return getMapAttrDTO(attr)
    case 'record':
      return getRecordAttrDTO(attr)
    case 'anyOf':
      return getAnyOfAttrDTO(attr)
  }
}
