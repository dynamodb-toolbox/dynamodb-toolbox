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
  OnlyOnce,
  Always
} from 'v1/item'

import type { EntityV2 } from '../class'

/**
 * User input of an UPDATE command for a given Entity, Item or Attribute
 *
 * @param Input Entity | Item | Attribute
 * @return Object
 */
export type UpdateItemInput<Input extends EntityV2 | Item | Attribute> = Input extends AnyAttribute
  ? ResolvedAttribute
  : Input extends LeafAttribute
  ? NonNullable<Input['_resolved']>
  : Input extends SetAttribute
  ? Set<UpdateItemInput<Input['_elements']>>
  : Input extends ListAttribute
  ? UpdateItemInput<Input['_elements']>[]
  : Input extends MapAttribute | Item
  ? O.Required<
      O.Partial<{
        // Filter Required OnlyOnce attributes
        [key in O.FilterKeys<Input['_attributes'], { _required: OnlyOnce }>]: UpdateItemInput<
          Input['_attributes'][key]
        >
      }>,
      Exclude<
        // Enforce Required Always attributes...
        O.SelectKeys<Input['_attributes'], { _required: Always }>,
        // ...Except those that have default (not required from user, can be provided by the lib)
        O.FilterKeys<Input['_attributes'], { _default: undefined }>
      >
    > & // Add Record<string, ResolvedAttribute> if map is open
      (Input extends { _open: true } ? Record<string, ResolvedAttribute> : {})
  : Input extends EntityV2
  ? UpdateItemInput<Input['item']>
  : never
