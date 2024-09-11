import type { $AttributeNestedState } from '~/attributes/index.js'
import type { JSONizedAttr } from '~/schema/actions/jsonize/index.js'

import { fromJSONAnyAttr } from './any.js'
import { fromJSONAnyOfAttr } from './anyOf.js'
import { fromJSONListAttr } from './list.js'
import { fromJSONMapAttr } from './map.js'
import { fromJSONPrimitiveAttr } from './primitive.js'
import { fromJSONRecordAttr } from './record.js'
import { fromJSONSetAttr } from './set.js'

export const fromJSONAttr = (jsonizedAttr: JSONizedAttr): $AttributeNestedState => {
  switch (jsonizedAttr.type) {
    case 'any':
      return fromJSONAnyAttr(jsonizedAttr)
    case 'null':
    case 'boolean':
    case 'number':
    case 'string':
    case 'binary':
      return fromJSONPrimitiveAttr(jsonizedAttr)
    case 'set':
      return fromJSONSetAttr(jsonizedAttr)
    case 'list':
      return fromJSONListAttr(jsonizedAttr)
    case 'map':
      return fromJSONMapAttr(jsonizedAttr)
    case 'record':
      return fromJSONRecordAttr(jsonizedAttr)
    case 'anyOf':
      return fromJSONAnyOfAttr(jsonizedAttr)
  }
}
