import { anyOf } from '~/attributes/anyOf/index.js'
import type { AnyOfAttributeElementConstraints } from '~/attributes/anyOf/types.js'
import type { ListAttributeElementConstraints } from '~/attributes/list/types.js'
import type { RecordAttributeElementConstraints } from '~/attributes/record/types.js'
import type { FormattedValue } from '~/schema/actions/format/index.js'
import { Parser } from '~/schema/actions/parse/index.js'
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

export const $jsonAttrSchema = anyOf(
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

export const jsonAttrSchema = $jsonAttrSchema.freeze()
export const jsonAttrParser = new Parser(jsonAttrSchema)

export type JSONizedAttr =
  FormattedValue<typeof jsonAttrSchema> extends infer TYPE
    ? TYPE extends { type: 'list' }
      ? Overwrite<TYPE, { elements: JSONizedAttr & Partial<ListAttributeElementConstraints> }>
      : TYPE extends { type: 'map' }
        ? Overwrite<TYPE, { attributes: Record<string, JSONizedAttr> }>
        : TYPE extends { type: 'record' }
          ? Overwrite<TYPE, { elements: JSONizedAttr & Partial<RecordAttributeElementConstraints> }>
          : TYPE extends { type: 'anyOf' }
            ? Overwrite<
                TYPE,
                { elements: (JSONizedAttr & Partial<AnyOfAttributeElementConstraints>)[] }
              >
            : TYPE
    : never
