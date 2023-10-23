import type { O } from 'ts-toolbelt'
import type { Schema, AtLeastOnce, Always, MapAttribute } from 'v1/schema'
import type { If } from 'v1/types/if'

import type { FormattedAttribute } from './attribute'
import type { MatchKeys } from './utils'
import type { FormattedItemOptions } from './utils'

export type FormattedMapAttribute<
  SCHEMA extends Schema | MapAttribute,
  OPTIONS extends FormattedItemOptions = FormattedItemOptions,
  KEY_PREFIX extends string = SCHEMA extends Schema
    ? ''
    : SCHEMA extends MapAttribute
    ? '.'
    : never,
  MATCHING_KEYS extends string = MatchKeys<
    Extract<keyof SCHEMA['attributes'], string>,
    KEY_PREFIX,
    OPTIONS['attributes']
  >
> =
  // Possible in case of anyOf subSchema
  [MATCHING_KEYS] extends [never]
    ? never
    : O.Required<
        O.Partial<
          {
            // Keep only non-hidden attributes
            [KEY in O.SelectKeys<
              // Pick only filtered keys
              O.Pick<SCHEMA['attributes'], MATCHING_KEYS>,
              { hidden: false }
            >]: FormattedAttribute<
              SCHEMA['attributes'][KEY],
              O.Update<
                OPTIONS,
                'attributes',
                `${KEY_PREFIX}${KEY}` extends OPTIONS['attributes']
                  ? string
                  : OPTIONS['attributes'] extends `${KEY_PREFIX}${KEY}${infer CHILDREN_FILTERED_ATTRIBUTES}`
                  ? CHILDREN_FILTERED_ATTRIBUTES
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
