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
  Always
} from 'v1/item'

import type { EntityV2 } from '../class'

/**
 * User input of an UPDATE command for a given Entity, Item or Attribute
 *
 * @param Input Entity | Item | Attribute
 * @return Object
 */
export type UpdateItemInput<
  Input extends EntityV2 | FrozenItem | FrozenAttribute
> = Input extends FrozenAnyAttribute
  ? ResolvedAttribute
  : Input extends FrozenLeafAttribute
  ? NonNullable<Input['resolved']>
  : Input extends FrozenSetAttribute
  ? Set<UpdateItemInput<Input['elements']>>
  : Input extends FrozenListAttribute
  ? UpdateItemInput<Input['elements']>[]
  : Input extends FrozenMapAttribute | FrozenItem
  ? O.Required<
      O.Partial<
        {
          // Filter Required OnlyOnce attributes
          [key in O.FilterKeys<Input['attributes'], { required: OnlyOnce }>]: UpdateItemInput<
            Input['attributes'][key]
          >
        }
      >,
      Exclude<
        // Enforce Required Always attributes...
        O.SelectKeys<Input['attributes'], { required: Always }>,
        // ...Except those that have default (not required from user, can be provided by the lib)
        O.FilterKeys<Input['attributes'], { default: undefined }>
      >
    > & // Add Record<string, ResolvedAttribute> if map is open
      (Input extends { open: true } ? Record<string, ResolvedAttribute> : {})
  : Input extends EntityV2
  ? UpdateItemInput<Input['frozenItem']>
  : never
