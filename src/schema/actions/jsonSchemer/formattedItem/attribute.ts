import type {
  AnyOfSchema,
  AnySchema,
  AttrSchema,
  ItemSchema,
  ListSchema,
  MapSchema,
  PrimitiveSchema,
  RecordSchema,
  SetSchema
} from '~/attributes/index.js'

import type { FormattedAnyOfJSONSchema } from './anyOf.js'
import { getFormattedAnyOfJSONSchema } from './anyOf.js'
import type { FormattedItemJSONSchema } from './item.js'
import { getFormattedItemJSONSchema } from './item.js'
import type { FormattedListJSONSchema } from './list.js'
import { getFormattedListJSONSchema } from './list.js'
import type { FormattedMapJSONSchema } from './map.js'
import { getFormattedMapAttrJSONSchema } from './map.js'
import type { FormattedPrimitiveJSONSchema } from './primitive.js'
import { getFormattedPrimitiveJSONSchema } from './primitive.js'
import type { FormattedRecordJSONSchema } from './record.js'
import { getFormattedRecordAttrJSONSchema } from './record.js'
import type { FormattedSetJSONSchema } from './set.js'
import { getFormattedSetJSONSchema } from './set.js'

export type FormattedValueJSONSchema<SCHEMA extends AttrSchema> = AttrSchema extends SCHEMA
  ? Record<string, unknown>
  :
      | (SCHEMA extends AnySchema ? {} : never)
      | (SCHEMA extends PrimitiveSchema ? FormattedPrimitiveJSONSchema<SCHEMA> : never)
      | (SCHEMA extends SetSchema ? FormattedSetJSONSchema<SCHEMA> : never)
      | (SCHEMA extends ListSchema ? FormattedListJSONSchema<SCHEMA> : never)
      | (SCHEMA extends MapSchema ? FormattedMapJSONSchema<SCHEMA> : never)
      | (SCHEMA extends RecordSchema ? FormattedRecordJSONSchema<SCHEMA> : never)
      | (SCHEMA extends AnyOfSchema ? FormattedAnyOfJSONSchema<SCHEMA> : never)
      | (SCHEMA extends ItemSchema ? FormattedItemJSONSchema<SCHEMA> : never)

export const getFormattedValueJSONSchema = <VALUE extends AttrSchema>(
  attr: VALUE
): FormattedValueJSONSchema<VALUE> => {
  type Response = FormattedValueJSONSchema<VALUE>

  switch (attr.type) {
    case 'any':
      return {} as Response
    case 'null':
    case 'boolean':
    case 'number':
    case 'string':
    case 'binary':
      return getFormattedPrimitiveJSONSchema(attr) as Response
    case 'set':
      return getFormattedSetJSONSchema(attr) as Response
    case 'list':
      return getFormattedListJSONSchema(attr) as Response
    case 'map':
      return getFormattedMapAttrJSONSchema(attr) as Response
    case 'record':
      return getFormattedRecordAttrJSONSchema(attr) as Response
    case 'anyOf':
      return getFormattedAnyOfJSONSchema(attr) as Response
    case 'item':
      return getFormattedItemJSONSchema(attr) as Response
  }
}
