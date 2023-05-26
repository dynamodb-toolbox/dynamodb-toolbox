import type { RecordAttribute, ResolvePrimitiveAttribute } from 'v1/item'
import type { FormattedAttribute } from './attribute'
import type { MatchKeys } from './utils'

export type FormattedRecordAttribute<
  RECORD_ATTRIBUTE extends RecordAttribute,
  FILTERED_ATTRIBUTES extends string,
  MATCHING_KEYS extends string = MatchKeys<
    ResolvePrimitiveAttribute<RECORD_ATTRIBUTE['keys']>,
    '.',
    FILTERED_ATTRIBUTES
  >
> =
  // Possible in case of anyOf subSchema
  [MATCHING_KEYS] extends [never]
    ? never
    : {
        [KEY in MATCHING_KEYS]?: FormattedAttribute<
          RECORD_ATTRIBUTE['elements'],
          MATCHING_KEYS extends infer FILTERED_KEY
            ? FILTERED_KEY extends string
              ? `.${FILTERED_KEY}` extends FILTERED_ATTRIBUTES
                ? string
                : FILTERED_ATTRIBUTES extends `.${FILTERED_KEY}${infer CHILDREN_FILTERED_ATTRIBUTES}`
                ? CHILDREN_FILTERED_ATTRIBUTES
                : never
              : never
            : never
        >
      }
