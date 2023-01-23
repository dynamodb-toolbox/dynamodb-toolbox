import type { O } from 'ts-toolbelt'

import type {
  _Item,
  _Attribute,
  ResolvedAttribute,
  _AnyAttribute,
  _PrimitiveAttribute,
  _SetAttribute,
  _ListAttribute,
  _MapAttribute,
  AtLeastOnce,
  OnlyOnce,
  Always,
  ComputedDefault
} from 'v1/item'
import type { $attributes, $required, $open, $default } from 'v1/item/attributes/constants/symbols'
import type { _AttributePutItem } from './attribute'

export type _ItemPutItem<_ITEM extends _Item> = O.Required<
  O.Partial<
    {
      // Keep all attributes
      [KEY in keyof _ITEM[$attributes]]: _AttributePutItem<_ITEM[$attributes][KEY]>
    }
  >,
  // Enforce Required attributes
  | O.SelectKeys<_ITEM[$attributes], { [$required]: AtLeastOnce | OnlyOnce | Always }>
  // Enforce attributes that have hard default
  | O.FilterKeys<_ITEM[$attributes], { [$default]: undefined | ComputedDefault }>
> & // Add Record<string, ResolvedAttribute> if map is open
  (_ITEM extends { [$open]: true } ? Record<string, ResolvedAttribute> : {})
