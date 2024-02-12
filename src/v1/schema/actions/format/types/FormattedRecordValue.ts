import type { O } from 'ts-toolbelt'

import type { RecordAttribute, ResolvePrimitiveAttribute } from 'v1/schema'

import type { FormattedValue } from './FormattedValue'
import type { MatchKeys } from './MatchKeys'
import type { FormattedValueOptions } from './FormattedValueOptions'

export type FormattedRecordValue<
  RECORD_ATTRIBUTE extends RecordAttribute,
  OPTIONS extends FormattedValueOptions = FormattedValueOptions,
  MATCHING_KEYS extends string = MatchKeys<
    ResolvePrimitiveAttribute<RECORD_ATTRIBUTE['keys']>,
    '.',
    OPTIONS['attributes'][number]
  >
> =
  // Possible in case of anyOf subSchema
  [MATCHING_KEYS] extends [never]
    ? never
    : {
        [KEY in MATCHING_KEYS]?: FormattedValue<
          RECORD_ATTRIBUTE['elements'],
          O.Update<
            OPTIONS,
            'attributes',
            MATCHING_KEYS extends infer FILTERED_KEY
              ? FILTERED_KEY extends string
                ? `.${FILTERED_KEY}` extends OPTIONS['attributes'][number]
                  ? string[]
                  : OPTIONS['attributes'][number] extends `.${FILTERED_KEY}${infer CHILDREN_FILTERED_ATTRIBUTES}`
                  ? CHILDREN_FILTERED_ATTRIBUTES[]
                  : never
                : never
              : never
          >
        >
      }
