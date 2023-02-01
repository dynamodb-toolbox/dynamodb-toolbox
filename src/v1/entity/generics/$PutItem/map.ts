import type { O } from 'ts-toolbelt'

import type {
  ResolvedAttribute,
  $MapAttribute,
  AtLeastOnce,
  OnlyOnce,
  Always,
  ComputedDefault
} from 'v1/item'
import type {
  $attributes,
  $required,
  $open,
  $default
} from 'v1/item/attributes/constants/attributeOptions'

import type { $AttributePutItem } from './attribute'

export type $MapAttributePutItem<$MAP_ATTRIBUTE extends $MapAttribute> = $MAP_ATTRIBUTE extends {
  [$required]: 'never'
}
  ?
      | undefined
      | (O.Required<
          O.Partial<
            {
              // Keep all attributes
              [KEY in keyof $MAP_ATTRIBUTE[$attributes]]: $AttributePutItem<
                $MAP_ATTRIBUTE[$attributes][KEY]
              >
            }
          >,
          // Enforce Required attributes
          | O.SelectKeys<
              $MAP_ATTRIBUTE[$attributes],
              { [$required]: AtLeastOnce | OnlyOnce | Always }
            >
          // Enforce attributes that have hard default
          | O.FilterKeys<$MAP_ATTRIBUTE[$attributes], { [$default]: undefined | ComputedDefault }>
        > & // Add Record<string, ResolvedAttribute> if map is open
          ($MAP_ATTRIBUTE extends { [$open]: true } ? Record<string, ResolvedAttribute> : unknown))
  : O.Required<
      O.Partial<
        {
          // Keep all attributes
          [KEY in keyof $MAP_ATTRIBUTE[$attributes]]: $AttributePutItem<
            $MAP_ATTRIBUTE[$attributes][KEY]
          >
        }
      >,
      // Enforce Required attributes
      | O.SelectKeys<$MAP_ATTRIBUTE[$attributes], { [$required]: AtLeastOnce | OnlyOnce | Always }>
      // Enforce attributes that have hard default
      | O.FilterKeys<$MAP_ATTRIBUTE[$attributes], { [$default]: undefined | ComputedDefault }>
    > & // Add Record<string, ResolvedAttribute> if map is open
      ($MAP_ATTRIBUTE extends { [$open]: true } ? Record<string, ResolvedAttribute> : unknown)
