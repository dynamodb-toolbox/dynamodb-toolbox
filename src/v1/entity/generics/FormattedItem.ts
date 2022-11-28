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
  AtLeastOnce,
  OnlyOnce,
  Always
} from 'v1/item'

import { EntityV2 } from '../class'

/**
 * Returned item of a fetch command (GET, QUERY ...) for a given Entity, Item or Attribute
 *
 * @param Input Entity | Item | Attribute
 * @return Object
 */
export type FormattedItem<
  Input extends EntityV2 | FrozenItem | FrozenAttribute
> = Input extends FrozenAnyAttribute
  ? ResolvedAttribute
  : Input extends FrozenLeafAttribute
  ? NonNullable<Input['resolved']>
  : Input extends FrozenSetAttribute
  ? Set<FormattedItem<Input['elements']>>
  : Input extends FrozenListAttribute
  ? FormattedItem<Input['elements']>[]
  : Input extends FrozenMapAttribute | FrozenItem
  ? O.Required<
      O.Partial<
        {
          // Keep only non-hidden attributes
          [key in O.SelectKeys<Input['attributes'], { hidden: false }>]: FormattedItem<
            Input['attributes'][key]
          >
        }
      >,
      // Enforce Required attributes
      | O.SelectKeys<Input['attributes'], { required: AtLeastOnce | OnlyOnce | Always }>
      // Enforce attributes that have defined default (initial or computed)
      // (...but not so sure about that anymore, props can have computed default but still be optional)
      | O.FilterKeys<Input['attributes'], { default: undefined }>
    > & // Add Record<string, ResolvedAttribute> if map is open
      (Input extends { open: true } ? Record<string, ResolvedAttribute> : {})
  : Input extends EntityV2
  ? FormattedItem<Input['frozenItem']>
  : never
