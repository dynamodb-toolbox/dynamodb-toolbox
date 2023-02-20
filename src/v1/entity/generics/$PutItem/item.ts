import type { O } from 'ts-toolbelt'

import type {
  $Item,
  AtLeastOnce,
  OnlyOnce,
  Always,
  ComputedDefault,
  $attributes,
  $required,
  $default
} from 'v1/item'

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
>
