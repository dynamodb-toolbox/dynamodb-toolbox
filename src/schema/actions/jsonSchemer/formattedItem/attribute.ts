import type {
  AnyAttribute,
  AnyOfAttribute,
  Attribute,
  ListAttribute,
  MapAttribute,
  PrimitiveAttribute,
  RecordAttribute,
  SetAttribute
} from '~/attributes/index.js'

import type { FormattedAnyOfAttrJSONSchema } from './anyOf.js'
import { getFormattedAnyOfAttrJSONSchema } from './anyOf.js'
import type { FormattedListAttrJSONSchema } from './list.js'
import { getFormattedListAttrJSONSchema } from './list.js'
import type { FormattedMapAttrJSONSchema } from './map.js'
import { getFormattedMapAttrJSONSchema } from './map.js'
import type { FormattedPrimitiveAttrJSONSchema } from './primitive.js'
import { getFormattedPrimitiveAttrJSONSchema } from './primitive.js'
import type { FormattedRecordAttrJSONSchema } from './record.js'
import { getFormattedRecordAttrJSONSchema } from './record.js'
import type { FormattedSetAttrJSONSchema } from './set.js'
import { getFormattedSetAttrJSONSchema } from './set.js'

export type FormattedAttrJSONSchema<ATTRIBUTE extends Attribute> = Attribute extends ATTRIBUTE
  ? Record<string, unknown>
  :
      | (ATTRIBUTE extends AnyAttribute ? {} : never)
      | (ATTRIBUTE extends PrimitiveAttribute ? FormattedPrimitiveAttrJSONSchema<ATTRIBUTE> : never)
      | (ATTRIBUTE extends SetAttribute ? FormattedSetAttrJSONSchema<ATTRIBUTE> : never)
      | (ATTRIBUTE extends ListAttribute ? FormattedListAttrJSONSchema<ATTRIBUTE> : never)
      | (ATTRIBUTE extends MapAttribute ? FormattedMapAttrJSONSchema<ATTRIBUTE> : never)
      | (ATTRIBUTE extends RecordAttribute ? FormattedRecordAttrJSONSchema<ATTRIBUTE> : never)
      | (ATTRIBUTE extends AnyOfAttribute ? FormattedAnyOfAttrJSONSchema<ATTRIBUTE> : never)

export const getFormattedAttrJSONSchema = <ATTRIBUTE extends Attribute>(
  attr: ATTRIBUTE
): FormattedAttrJSONSchema<ATTRIBUTE> => {
  type Response = FormattedAttrJSONSchema<ATTRIBUTE>

  switch (attr.type) {
    case 'any':
      return {} as Response
    case 'null':
    case 'boolean':
    case 'number':
    case 'string':
    case 'binary':
      return getFormattedPrimitiveAttrJSONSchema(attr) as Response
    case 'set':
      return getFormattedSetAttrJSONSchema(attr) as Response
    case 'list':
      return getFormattedListAttrJSONSchema(attr) as Response
    case 'map':
      return getFormattedMapAttrJSONSchema(attr) as Response
    case 'record':
      return getFormattedRecordAttrJSONSchema(attr) as Response
    case 'anyOf':
      return getFormattedAnyOfAttrJSONSchema(attr) as Response
  }
}
