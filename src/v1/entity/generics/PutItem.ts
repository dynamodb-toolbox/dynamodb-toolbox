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
 * Formatted input of a PUT command for a given Entity, Item or Attribute
 *
 * @param Input Entity | Item | Attribute
 * @return Object
 */
export type PutItem<Input extends EntityV2 | Item | Attribute> = Input extends AnyAttribute
  ? ResolvedAttribute
  : Input extends LeafAttribute
  ? NonNullable<Input['_resolved']>
  : Input extends SetAttribute
  ? Set<PutItem<Input['_elements']>>
  : Input extends ListAttribute
  ? PutItem<Input['_elements']>[]
  : Input extends MapAttribute | Item
  ? O.Required<
      O.Partial<{
        // Keep all attributes
        [key in keyof Input['_attributes']]: PutItem<Input['_attributes'][key]>
      }>,
      // Enforce Required attributes
      | O.SelectKeys<Input['_attributes'], { _required: AtLeastOnce | OnlyOnce | Always }>
      // Enforce attributes that have initial default
      | O.FilterKeys<Input['_attributes'], { _default: undefined | ComputedDefault }>
    > & // Add Record<string, ResolvedAttribute> if map is open
      (Input extends { _open: true } ? Record<string, ResolvedAttribute> : {})
  : Input extends EntityV2
  ? PutItem<Input['item']>
  : never
