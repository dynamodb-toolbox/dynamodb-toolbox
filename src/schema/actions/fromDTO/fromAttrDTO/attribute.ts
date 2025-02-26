import type { AttrSchema } from '~/attributes/index.js'
import type { AttributeDTO } from '~/schema/actions/dto/index.js'

import { fromJSONAnyAttr } from './any.js'
import { fromJSONAnyOfAttr } from './anyOf.js'
import { fromListAttrDTO } from './list.js'
import { fromJSONMapAttr } from './map.js'
import { fromJSONPrimitiveAttr } from './primitive.js'
import { fromJSONRecordAttr } from './record.js'
import { fromJSONSetAttr } from './set.js'

export const fromAttrDTO = (attrDTO: AttributeDTO): AttrSchema => {
  switch (attrDTO.type) {
    case 'any':
      return fromJSONAnyAttr(attrDTO)
    case 'null':
    case 'boolean':
    case 'number':
    case 'string':
    case 'binary':
      return fromJSONPrimitiveAttr(attrDTO)
    case 'set':
      return fromJSONSetAttr(attrDTO)
    case 'list':
      return fromListAttrDTO(attrDTO)
    case 'map':
      return fromJSONMapAttr(attrDTO)
    case 'record':
      return fromJSONRecordAttr(attrDTO)
    case 'anyOf':
      return fromJSONAnyOfAttr(attrDTO)
  }
}
