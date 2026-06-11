import type {
  AnyOfSchema,
  AnySchema,
  ItemSchema,
  ListSchema,
  MapSchema,
  PrimitiveSchema,
  RecordSchema,
  Schema,
  SetSchema,
  TupleSchema
} from '~/schema/index.js'

import type { FormattedAnyOfJSONSchema } from './anyOf.js'
import { getFormattedAnyOfJSONSchema } from './anyOf.js'
import type { FormattedItemJSONSchema } from './item.js'
import { getFormattedItemJSONSchema } from './item.js'
import type { FormattedListJSONSchema } from './list.js'
import { getFormattedListJSONSchema } from './list.js'
import type { FormattedMapJSONSchema } from './map.js'
import { getFormattedMapJSONSchema } from './map.js'
import type { FormattedPrimitiveJSONSchema } from './primitive.js'
import { getFormattedPrimitiveJSONSchema } from './primitive.js'
import type { FormattedRecordJSONSchema } from './record.js'
import { getFormattedRecordJSONSchema } from './record.js'
import type { FormattedSetJSONSchema } from './set.js'
import { getFormattedSetJSONSchema } from './set.js'
import type { FormattedTupleJSONSchema } from './tuple.js'
import { getFormattedTupleJSONSchema } from './tuple.js'

export const getFormattedValueJSONSchema = <SCHEMA extends Schema>(
  schema: SCHEMA
): FormattedValueJSONSchema<SCHEMA> => {
  type RESPONSE = FormattedValueJSONSchema<SCHEMA>

  switch (schema.type) {
    case 'any':
      return {} as RESPONSE
    case 'null':
    case 'boolean':
    case 'number':
    case 'string':
    case 'binary':
      return getFormattedPrimitiveJSONSchema(schema) as RESPONSE
    case 'set':
      return getFormattedSetJSONSchema(schema) as RESPONSE
    case 'list':
      return getFormattedListJSONSchema(schema) as RESPONSE
    case 'tuple':
      return getFormattedTupleJSONSchema(schema) as RESPONSE
    case 'map':
      return getFormattedMapJSONSchema(schema) as RESPONSE
    case 'record':
      return getFormattedRecordJSONSchema(schema) as RESPONSE
    case 'anyOf':
      return getFormattedAnyOfJSONSchema(schema) as RESPONSE
    case 'item':
      return getFormattedItemJSONSchema(schema) as RESPONSE
  }
}

export type FormattedValueJSONSchema<SCHEMA extends Schema> = Schema extends SCHEMA
  ? Record<string, unknown>
  :
      | (SCHEMA extends AnySchema ? {} : never)
      | (SCHEMA extends PrimitiveSchema ? FormattedPrimitiveJSONSchema<SCHEMA> : never)
      | (SCHEMA extends SetSchema ? FormattedSetJSONSchema<SCHEMA> : never)
      | (SCHEMA extends ListSchema ? FormattedListJSONSchema<SCHEMA> : never)
      | (SCHEMA extends TupleSchema ? FormattedTupleJSONSchema<SCHEMA> : never)
      | (SCHEMA extends MapSchema ? FormattedMapJSONSchema<SCHEMA> : never)
      | (SCHEMA extends RecordSchema ? FormattedRecordJSONSchema<SCHEMA> : never)
      | (SCHEMA extends AnyOfSchema ? FormattedAnyOfJSONSchema<SCHEMA> : never)
      | (SCHEMA extends ItemSchema ? FormattedItemJSONSchema<SCHEMA> : never)

export type FormattedValueJSONSchemaRec<
  SCHEMAS extends Schema[],
  RESULTS extends unknown[] = []
> = number extends SCHEMAS['length']
  ? FormattedValueJSONSchema<SCHEMAS[number]>[]
  : SCHEMAS extends [infer SCHEMAS_HEAD, ...infer SCHEMAS_TAIL]
    ? SCHEMAS_HEAD extends Schema
      ? SCHEMAS_TAIL extends Schema[]
        ? FormattedValueJSONSchemaRec<
            SCHEMAS_TAIL,
            [...RESULTS, FormattedValueJSONSchema<SCHEMAS_HEAD>]
          >
        : never
      : never
    : RESULTS
