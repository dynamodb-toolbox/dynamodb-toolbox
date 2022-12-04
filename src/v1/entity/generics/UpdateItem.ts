import type { O } from 'ts-toolbelt'

import type {
  FrozenItem,
  FrozenAttribute,
  ResolvedAttribute,
  FrozenAnyAttribute,
  FrozenLeafAttribute,
  FrozenSetAttribute,
  FrozenListAttribute,
  FrozenMapAttribute,
  OnlyOnce,
  Always,
  ComputedDefault
} from 'v1/item'

import type { EntityV2 } from '../class'

/**
 * Formatted input of an UPDATE command for a given Entity, Item or Attribute
 *
 * @param Input Entity | Item | Attribute
 * @return Object
 */
export type UpdateItem<
  Input extends EntityV2 | FrozenItem | FrozenAttribute
> = Input extends FrozenAnyAttribute
  ? ResolvedAttribute
  : Input extends FrozenLeafAttribute
  ? NonNullable<Input['resolved']>
  : Input extends FrozenSetAttribute
  ? Set<UpdateItem<Input['elements']>>
  : Input extends FrozenListAttribute
  ? UpdateItem<Input['elements']>[]
  : Input extends FrozenMapAttribute | FrozenItem
  ? O.Required<
      O.Partial<
        {
          // Filter Required OnlyOnce attributes
          [key in O.FilterKeys<Input['attributes'], { required: OnlyOnce }>]: UpdateItem<
            Input['attributes'][key]
          >
        }
      >,
      // Enforce Always Required attributes
      | O.SelectKeys<Input['attributes'], { required: Always }>
      // Enforce attributes that have initial default
      | O.FilterKeys<Input['attributes'], { default: undefined | ComputedDefault }>
    > & // Add Record<string, ResolvedAttribute> if map is open
      (Input extends { open: true } ? Record<string, ResolvedAttribute> : {})
  : Input extends EntityV2
  ? UpdateItem<Input['frozenItem']>
  : never
