import type { O } from 'ts-toolbelt'

import type { Schema, AtLeastOnce, Always, ComputedDefault, ResolvedMapAttribute } from 'v1/schema'

import type { AttributePutItem } from './attribute'

export type SchemaPutItem<SCHEMA extends Schema> = Schema extends SCHEMA
  ? ResolvedMapAttribute
  : O.Required<
      O.Partial<
        {
          // Keep all attributes
          [KEY in keyof SCHEMA['attributes']]: AttributePutItem<SCHEMA['attributes'][KEY]>
        }
      >,
      // Enforce Required attributes
      | O.SelectKeys<SCHEMA['attributes'], { required: AtLeastOnce | Always }>
      // Enforce attributes that have independent default
      | O.FilterKeys<SCHEMA['attributes'], { defaults: { put: undefined | ComputedDefault } }>
    >
