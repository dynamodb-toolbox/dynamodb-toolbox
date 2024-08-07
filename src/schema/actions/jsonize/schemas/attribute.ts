import { anyOf } from '~/attributes/anyOf/index.js'
import type { FreezeAttribute } from '~/attributes/freeze.js'
import type { FormattedValue } from '~/schema/actions/format/index.js'
import type { Overwrite } from '~/types/overwrite.js'

import { jsonAnyAttrSchema } from './any.js'
import { jsonAnyOfAttrSchema } from './anyOf.js'
import { jsonListAttrSchema } from './list.js'
import { jsonMapAttrSchema } from './map.js'
import {
  jsonBinaryAttrSchema,
  jsonBooleanAttrSchema,
  jsonNullAttrSchema,
  jsonNumberAttrSchema,
  jsonStringAttrSchema
} from './primitive.js'
import { jsonRecordAttrSchema } from './record.js'
import { setAttrJSONRepresentationSchema } from './set.js'

export const jsonAttrSchema = anyOf(
  jsonAnyAttrSchema,
  jsonNullAttrSchema,
  jsonBooleanAttrSchema,
  jsonNumberAttrSchema,
  jsonStringAttrSchema,
  jsonBinaryAttrSchema,
  setAttrJSONRepresentationSchema,
  jsonListAttrSchema,
  jsonMapAttrSchema,
  jsonRecordAttrSchema,
  jsonAnyOfAttrSchema
)

export type JSONizedAttr =
  FormattedValue<FreezeAttribute<typeof jsonAttrSchema>> extends infer TYPE
    ? TYPE extends { type: 'list' }
      ? Overwrite<TYPE, { elements: JSONizedAttr }>
      : TYPE extends { type: 'map' }
        ? Overwrite<TYPE, { attributes: Record<string, JSONizedAttr> }>
        : TYPE extends { type: 'record' }
          ? Overwrite<TYPE, { elements: JSONizedAttr }>
          : TYPE extends { type: 'anyOf' }
            ? Overwrite<TYPE, { elements: JSONizedAttr[] }>
            : TYPE
    : never
