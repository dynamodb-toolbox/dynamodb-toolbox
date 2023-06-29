import type { O } from 'ts-toolbelt'

import type { RecordAttribute, ResolvePrimitiveAttribute } from 'v1/schema'
import type { FormattedAttribute } from './attribute'
import type { MatchKeys } from './utils'
import type { FormattedItemOptions } from './utils'

export type FormattedRecordAttribute<
  RECORD_ATTRIBUTE extends RecordAttribute,
  OPTIONS extends FormattedItemOptions = FormattedItemOptions,
  MATCHING_KEYS extends string = MatchKeys<
    ResolvePrimitiveAttribute<RECORD_ATTRIBUTE['keys']>,
    '.',
    OPTIONS['attributes']
  >
> =
  // Possible in case of anyOf subSchema
  [MATCHING_KEYS] extends [never]
    ? never
    : {
        [KEY in MATCHING_KEYS]?: FormattedAttribute<
          RECORD_ATTRIBUTE['elements'],
          O.Update<
            OPTIONS,
            'attributes',
            MATCHING_KEYS extends infer FILTERED_KEY
              ? FILTERED_KEY extends string
                ? `.${FILTERED_KEY}` extends OPTIONS['attributes']
                  ? string
                  : OPTIONS['attributes'] extends `.${FILTERED_KEY}${infer CHILDREN_FILTERED_ATTRIBUTES}`
                  ? CHILDREN_FILTERED_ATTRIBUTES
                  : never
                : never
              : never
          >
        >
      }
