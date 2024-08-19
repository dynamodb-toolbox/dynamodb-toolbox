import { anyOf } from '~/attributes/anyOf/index.js'
import type { AnyOfAttributeElementConstraints } from '~/attributes/anyOf/types.js'
import type { ListAttributeElementConstraints } from '~/attributes/list/types.js'
import type { RecordAttributeElementConstraints } from '~/attributes/record/types.js'
import type { FormattedValue } from '~/schema/actions/format/index.js'
import { Parser } from '~/schema/actions/parse/index.js'
import type { Overwrite } from '~/types/overwrite.js'

import { jsonizedAnyAttrSchema } from './any.js'
import { jsonAnyOfAttrSchema } from './anyOf.js'
import { jsonizedListAttrSchema } from './list.js'
import { jsonizedMapAttrSchema } from './map.js'
import {
  jsonizedBinaryAttrSchema,
  jsonizedBooleanAttrSchema,
  jsonizedNullAttrSchema,
  jsonizedNumberAttrSchema,
  jsonizedStringAttrSchema
} from './primitive.js'
import { jsonizedRecordAttrSchema } from './record.js'
import { jsonizedSetAttrSchema } from './set.js'

export const $jsonizedAttrSchema = anyOf(
  jsonizedAnyAttrSchema,
  jsonizedNullAttrSchema,
  jsonizedBooleanAttrSchema,
  jsonizedNumberAttrSchema,
  jsonizedStringAttrSchema,
  jsonizedBinaryAttrSchema,
  jsonizedSetAttrSchema,
  jsonizedListAttrSchema,
  jsonizedMapAttrSchema,
  jsonizedRecordAttrSchema,
  jsonAnyOfAttrSchema
)

export const jsonizedAttrSchema = $jsonizedAttrSchema.freeze()
export const jsonizedAttrParser = new Parser(jsonizedAttrSchema)

export type JSONizedAttr =
  FormattedValue<typeof jsonizedAttrSchema> extends infer TYPE
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

export const parseJSONizedAttribute = (input: unknown): JSONizedAttr =>
  jsonizedAttrParser.parse(input) as JSONizedAttr
