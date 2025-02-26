import type {
  AnyOfSchema,
  AnySchema,
  AttrSchema,
  ListSchema,
  MapSchema,
  PrimitiveSchema,
  RecordSchema,
  SetSchema
} from '~/attributes/index.js'

import type { FormattedAnyOfJSONSchema } from './anyOf.js'
import { getFormattedAnyOfAttrJSONSchema } from './anyOf.js'
import type { FormattedListJSONSchema } from './list.js'
import { getFormattedListAttrJSONSchema } from './list.js'
import type { FormattedMapJSONSchema } from './map.js'
import { getFormattedMapAttrJSONSchema } from './map.js'
import type { FormattedPrimitiveJSONSchema } from './primitive.js'
import { getFormattedPrimitiveAttrJSONSchema } from './primitive.js'
import type { FormattedRecordJSONSchema } from './record.js'
import { getFormattedRecordAttrJSONSchema } from './record.js'
import type { FormattedSetJSONSchema } from './set.js'
import { getFormattedSetAttrJSONSchema } from './set.js'

export type FormattedAttrJSONSchema<ATTRIBUTE extends AttrSchema> = AttrSchema extends ATTRIBUTE
  ? Record<string, unknown>
  :
      | (ATTRIBUTE extends AnySchema ? {} : never)
      | (ATTRIBUTE extends PrimitiveSchema ? FormattedPrimitiveJSONSchema<ATTRIBUTE> : never)
      | (ATTRIBUTE extends SetSchema ? FormattedSetJSONSchema<ATTRIBUTE> : never)
      | (ATTRIBUTE extends ListSchema ? FormattedListJSONSchema<ATTRIBUTE> : never)
      | (ATTRIBUTE extends MapSchema ? FormattedMapJSONSchema<ATTRIBUTE> : never)
      | (ATTRIBUTE extends RecordSchema ? FormattedRecordJSONSchema<ATTRIBUTE> : never)
      | (ATTRIBUTE extends AnyOfSchema ? FormattedAnyOfJSONSchema<ATTRIBUTE> : never)

export const getFormattedAttrJSONSchema = <ATTRIBUTE extends AttrSchema>(
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
