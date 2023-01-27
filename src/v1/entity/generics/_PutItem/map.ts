import type { O } from 'ts-toolbelt'

import type {
  ResolvedAttribute,
  _MapAttribute,
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

import type { _AttributePutItem } from './attribute'

export type _MapAttributePutItem<_MAP_ATTRIBUTE extends _MapAttribute> = _MAP_ATTRIBUTE extends {
  [$required]: 'never'
}
  ?
      | undefined
      | (O.Required<
          O.Partial<
            {
              // Keep all attributes
              [KEY in keyof _MAP_ATTRIBUTE[$attributes]]: _AttributePutItem<
                _MAP_ATTRIBUTE[$attributes][KEY]
              >
            }
          >,
          // Enforce Required attributes
          | O.SelectKeys<
              _MAP_ATTRIBUTE[$attributes],
              { [$required]: AtLeastOnce | OnlyOnce | Always }
            >
          // Enforce attributes that have hard default
          | O.FilterKeys<_MAP_ATTRIBUTE[$attributes], { [$default]: undefined | ComputedDefault }>
        > & // Add Record<string, ResolvedAttribute> if map is open
          (_MAP_ATTRIBUTE extends { [$open]: true } ? Record<string, ResolvedAttribute> : {}))
  : O.Required<
      O.Partial<
        {
          // Keep all attributes
          [KEY in keyof _MAP_ATTRIBUTE[$attributes]]: _AttributePutItem<
            _MAP_ATTRIBUTE[$attributes][KEY]
          >
        }
      >,
      // Enforce Required attributes
      | O.SelectKeys<_MAP_ATTRIBUTE[$attributes], { [$required]: AtLeastOnce | OnlyOnce | Always }>
      // Enforce attributes that have hard default
      | O.FilterKeys<_MAP_ATTRIBUTE[$attributes], { [$default]: undefined | ComputedDefault }>
    > & // Add Record<string, ResolvedAttribute> if map is open
      (_MAP_ATTRIBUTE extends { [$open]: true } ? Record<string, ResolvedAttribute> : {})
