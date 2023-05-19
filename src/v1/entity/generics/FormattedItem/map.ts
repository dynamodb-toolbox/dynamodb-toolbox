import type { O } from 'ts-toolbelt'
import type { Item, AtLeastOnce, OnlyOnce, Always, MapAttribute, ComputedDefault } from 'v1/item'

import type { FormattedAttribute } from './attribute'
import type { MatchKeys } from './utils'

export type FormattedMapAttribute<
  MAP_ATTRIBUTE extends Item | MapAttribute,
  FILTERED_ATTRIBUTES extends string,
  KEY_PREFIX extends string = MAP_ATTRIBUTE extends Item
    ? ''
    : MAP_ATTRIBUTE extends MapAttribute
    ? '.'
    : never,
  MATCHING_KEYS extends string = MatchKeys<
    Extract<keyof MAP_ATTRIBUTE['attributes'], string>,
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
              O.Pick<MAP_ATTRIBUTE['attributes'], MATCHING_KEYS>,
              { hidden: false }
            >]: FormattedAttribute<
              MAP_ATTRIBUTE['attributes'][KEY],
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
        | O.SelectKeys<MAP_ATTRIBUTE['attributes'], { required: AtLeastOnce | OnlyOnce | Always }>
        // Enforce attributes that have defined hard default
        | O.FilterKeys<MAP_ATTRIBUTE['attributes'], { default: undefined | ComputedDefault }>
      >
