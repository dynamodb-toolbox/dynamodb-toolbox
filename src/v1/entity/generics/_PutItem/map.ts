import type { O } from 'ts-toolbelt'

import type {
  ResolvedAttribute,
  _MapAttribute,
  AtLeastOnce,
  OnlyOnce,
  Always,
  ComputedDefault
} from 'v1/item'

import type { _AttributePutItem } from './attribute'

export type _MapAttributePutItem<_MAP_ATTRIBUTE extends _MapAttribute> = _MAP_ATTRIBUTE extends {
  _required: 'never'
}
  ?
      | undefined
      | (O.Required<
          O.Partial<
            {
              // Keep all attributes
              [key in keyof _MAP_ATTRIBUTE['_attributes']]: _AttributePutItem<
                _MAP_ATTRIBUTE['_attributes'][key]
              >
            }
          >,
          // Enforce Required attributes
          | O.SelectKeys<
              _MAP_ATTRIBUTE['_attributes'],
              { _required: AtLeastOnce | OnlyOnce | Always }
            >
          // Enforce attributes that have initial default
          | O.FilterKeys<_MAP_ATTRIBUTE['_attributes'], { _default: undefined | ComputedDefault }>
        > & // Add Record<string, ResolvedAttribute> if map is open
          (_MAP_ATTRIBUTE extends { _open: true } ? Record<string, ResolvedAttribute> : {}))
  : O.Required<
      O.Partial<
        {
          // Keep all attributes
          [key in keyof _MAP_ATTRIBUTE['_attributes']]: _AttributePutItem<
            _MAP_ATTRIBUTE['_attributes'][key]
          >
        }
      >,
      // Enforce Required attributes
      | O.SelectKeys<_MAP_ATTRIBUTE['_attributes'], { _required: AtLeastOnce | OnlyOnce | Always }>
      // Enforce attributes that have initial default
      | O.FilterKeys<_MAP_ATTRIBUTE['_attributes'], { _default: undefined | ComputedDefault }>
    > & // Add Record<string, ResolvedAttribute> if map is open
      (_MAP_ATTRIBUTE extends { _open: true } ? Record<string, ResolvedAttribute> : {})
