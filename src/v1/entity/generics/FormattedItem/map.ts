import type { O } from 'ts-toolbelt'
import type {
  Schema,
  AtLeastOnce,
  OnlyOnce,
  Always,
  MapAttribute,
  ComputedDefault
} from 'v1/schema'

import type { FormattedAttribute } from './attribute'
import type { MatchKeys } from './utils'

export type FormattedMapAttribute<
  SCHEMA extends Schema | MapAttribute,
  FILTERED_ATTRIBUTES extends string,
  KEY_PREFIX extends string = SCHEMA extends Schema
    ? ''
    : SCHEMA extends MapAttribute
    ? '.'
    : never,
  MATCHING_KEYS extends string = MatchKeys<
    Extract<keyof SCHEMA['attributes'], string>,
    KEY_PREFIX,
    FILTERED_ATTRIBUTES
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
              // Compute next filtered attributes
              `${KEY_PREFIX}${KEY}` extends FILTERED_ATTRIBUTES
                ? string
                : FILTERED_ATTRIBUTES extends `${KEY_PREFIX}${KEY}${infer CHILDREN_FILTERED_ATTRIBUTES}`
                ? CHILDREN_FILTERED_ATTRIBUTES
                : never
            >
          }
        >,
        // Enforce Required attributes
        | O.SelectKeys<SCHEMA['attributes'], { required: AtLeastOnce | OnlyOnce | Always }>
        // Enforce attributes that have defined hard default
        | O.FilterKeys<SCHEMA['attributes'], { default: undefined | ComputedDefault }>
      >
