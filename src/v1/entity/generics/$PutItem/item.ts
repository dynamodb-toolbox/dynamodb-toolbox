import type { O } from 'ts-toolbelt'

import type {
  $Item,
  ResolvedAttribute,
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

export type $ItemPutItem<$ITEM extends $Item> = O.Required<
  O.Partial<
    {
      // Keep all attributes
      [KEY in keyof $ITEM[$attributes]]: $AttributePutItem<$ITEM[$attributes][KEY]>
    }
  >,
  // Enforce Required attributes
  | O.SelectKeys<$ITEM[$attributes], { [$required]: AtLeastOnce | OnlyOnce | Always }>
  // Enforce attributes that have hard default
  | O.FilterKeys<$ITEM[$attributes], { [$default]: undefined | ComputedDefault }>
> & // Add Record<string, ResolvedAttribute> if map is open
  ($ITEM extends { [$open]: true } ? Record<string, ResolvedAttribute> : unknown)
