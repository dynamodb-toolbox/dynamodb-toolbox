import type { O } from 'ts-toolbelt'

import type { MapAttribute, AtLeastOnce, Always, ComputedDefault } from 'v1/schema'

import type { AttributePutItem } from './attribute'

export type MapAttributePutItem<MAP_ATTRIBUTE extends MapAttribute> = MAP_ATTRIBUTE extends {
  required: 'never'
}
  ?
      | undefined
      | O.Required<
          O.Partial<
            {
              // Keep all attributes
              [KEY in keyof MAP_ATTRIBUTE['attributes']]: AttributePutItem<
                MAP_ATTRIBUTE['attributes'][KEY]
              >
            }
          >,
          // Enforce Required attributes
          | O.SelectKeys<MAP_ATTRIBUTE['attributes'], { required: AtLeastOnce | Always }>
          // Enforce attributes that have hard default
          | O.FilterKeys<
              MAP_ATTRIBUTE['attributes'],
              { defaults: { put: undefined | ComputedDefault } }
            >
        >
  : O.Required<
      O.Partial<
        {
          // Keep all attributes
          [KEY in keyof MAP_ATTRIBUTE['attributes']]: AttributePutItem<
            MAP_ATTRIBUTE['attributes'][KEY]
          >
        }
      >,
      // Enforce Required attributes
      | O.SelectKeys<MAP_ATTRIBUTE['attributes'], { required: AtLeastOnce | Always }>
      // Enforce attributes that have hard default
      | O.FilterKeys<
          MAP_ATTRIBUTE['attributes'],
          { defaults: { put: undefined | ComputedDefault } }
        >
    >
