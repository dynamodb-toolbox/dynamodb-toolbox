import type { O } from 'ts-toolbelt'
import type { Schema, AtLeastOnce, Always, MapAttribute } from 'v1/schema'
import type { If } from 'v1/types/if'

import type { FormattedValue } from './FormattedValue'
import type { MatchKeys } from './MatchKeys'
import type { FormattedValueOptions } from './FormattedValueOptions'

export type FormattedMapValue<
  SCHEMA extends Schema | MapAttribute,
  OPTIONS extends FormattedValueOptions = FormattedValueOptions,
  KEY_PREFIX extends string = SCHEMA extends Schema
    ? ''
    : SCHEMA extends MapAttribute
    ? '.'
    : never,
  MATCHING_KEYS extends string = MatchKeys<
    Extract<keyof SCHEMA['attributes'], string>,
    KEY_PREFIX,
    OPTIONS['attributes'][number]
  >
> =
  // Possible in case of anyOf subSchema
  [MATCHING_KEYS] extends [never]
    ? never
    : O.Required<
        Partial<
          {
            // Keep only non-hidden attributes
            [KEY in O.SelectKeys<
              // Pick only filtered keys
              O.Pick<SCHEMA['attributes'], MATCHING_KEYS>,
              { hidden: false }
            >]: FormattedValue<
              SCHEMA['attributes'][KEY],
              O.Update<
                OPTIONS,
                'attributes',
                `${KEY_PREFIX}${KEY}` extends OPTIONS['attributes'][number]
                  ? string[]
                  : OPTIONS['attributes'][number] extends `${KEY_PREFIX}${KEY}${infer CHILDREN_FILTERED_ATTRIBUTES}`
                  ? CHILDREN_FILTERED_ATTRIBUTES[]
                  : never
              >
            >
          }
        >,
        // Do not enforce any attribute if partial is true
        If<
          OPTIONS['partial'],
          never,
          // Enforce Required attributes
          O.SelectKeys<SCHEMA['attributes'], { required: AtLeastOnce | Always }>
        >
      >
