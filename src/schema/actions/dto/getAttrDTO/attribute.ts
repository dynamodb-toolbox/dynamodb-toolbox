import type { AttrSchema } from '~/attributes/index.js'

import type { AttributeDTO } from '../types.js'
import { getAnyAttrDTO } from './any.js'
import { getAnyOfAttrDTO } from './anyOf.js'
import { getItemSchemaDTO } from './item.js'
import { getListAttrDTO } from './list.js'
import { getMapAttrDTO } from './map.js'
import { getPrimitiveAttrDTO } from './primitive.js'
import { getRecordAttrDTO } from './record.js'
import { getSetAttrDTO } from './set.js'

export const getAttrDTO = (schema: AttrSchema): AttributeDTO => {
  /**
   * @debt feature "handle defaults, links & validators"
   */
  switch (schema.type) {
    case 'any':
      return getAnyAttrDTO(schema)
    case 'null':
    case 'boolean':
    case 'number':
    case 'string':
    case 'binary':
      return getPrimitiveAttrDTO(schema)
    case 'set':
      return getSetAttrDTO(schema)
    case 'list':
      return getListAttrDTO(schema)
    case 'map':
      return getMapAttrDTO(schema)
    case 'record':
      return getRecordAttrDTO(schema)
    case 'anyOf':
      return getAnyOfAttrDTO(schema)
    case 'item':
      return getItemSchemaDTO(schema)
  }
}
