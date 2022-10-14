import type { O } from 'ts-toolbelt'

import type { Item } from 'v1/item/interface'
import type {
  Attribute,
  ResolvedAttribute,
  AnyAttribute,
  LeafAttribute,
  SetAttribute,
  ListAttribute,
  MapAttribute,
  AtLeastOnce,
  OnlyOnce,
  Always,
  ComputedDefault
} from 'v1/item'

import type { EntityV2 } from '../class'

/**
 * User input of a PUT command for a given Entity, Item or Attribute
 *
 * @param Input Entity | Item | Attribute
 * @param RequireInitialDefaults Boolean
 * @return Object
 */
export type PutItemInput<
  Input extends EntityV2 | Item | Attribute,
  RequireInitialDefaults extends boolean = false
> = Input extends AnyAttribute
  ? ResolvedAttribute
  : Input extends LeafAttribute
  ? NonNullable<Input['_resolved']>
  : Input extends SetAttribute
  ? Set<PutItemInput<Input['_elements'], RequireInitialDefaults>>
  : Input extends ListAttribute
  ? PutItemInput<Input['_elements'], RequireInitialDefaults>[]
  : Input extends MapAttribute | Item
  ? O.Required<
      O.Partial<{
        // Keep all attributes
        [key in keyof Input['_attributes']]: PutItemInput<
          Input['_attributes'][key],
          RequireInitialDefaults
        >
      }>,
      // Enforce Required attributes except those that have default (will be provided by the lib)
      | O.SelectKeys<
          Input['_attributes'],
          { _required: AtLeastOnce | OnlyOnce | Always; _default: undefined }
        >
      // Add attributes with initial (non-computed) defaults if RequireInitialDefaults is true
      | (RequireInitialDefaults extends true
          ? O.FilterKeys<Input['_attributes'], { _default: undefined | ComputedDefault }>
          : never)
    > & // Add Record<string, ResolvedAttribute> if map is open
      (Input extends { _open: true } ? Record<string, ResolvedAttribute> : {})
  : Input extends EntityV2
  ? PutItemInput<Input['item'], RequireInitialDefaults>
  : never
