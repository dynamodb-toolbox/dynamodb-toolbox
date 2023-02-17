import type { O } from 'ts-toolbelt'

import type {
  Item,
  Attribute,
  ResolvedAttribute,
  ResolvedMapAttribute,
  AnyAttribute,
  ConstantAttribute,
  PrimitiveAttribute,
  SetAttribute,
  ListAttribute,
  MapAttribute,
  RecordAttribute,
  AnyOfAttribute,
  AtLeastOnce,
  OnlyOnce,
  Always,
  ComputedDefault,
  ResolveConstantAttribute,
  ResolvePrimitiveAttribute
} from 'v1/item'

import type { EntityV2 } from '../class'

/**
 * Formatted input of a PUT command for a given Entity or Item
 *
 * @param SCHEMA Entity | Item
 * @return Object
 */
export type PutItem<SCHEMA extends EntityV2 | Item> = EntityV2 extends SCHEMA
  ? ResolvedMapAttribute
  : Item extends SCHEMA
  ? ResolvedMapAttribute
  : SCHEMA extends Item
  ? O.Required<
      O.Partial<
        {
          // Keep all attributes
          [KEY in keyof SCHEMA['attributes']]: AttributePutItem<SCHEMA['attributes'][KEY]>
        }
      >,
      // Enforce Required attributes
      | O.SelectKeys<SCHEMA['attributes'], { required: AtLeastOnce | OnlyOnce | Always }>
      // Enforce attributes that have hard default
      | O.FilterKeys<SCHEMA['attributes'], { default: undefined | ComputedDefault }>
    >
  : SCHEMA extends EntityV2
  ? PutItem<SCHEMA['item']>
  : never

/**
 * Formatted input of a PUT command for a given Attribute
 *
 * @param Attribute Attribute
 * @return Any
 */
export type AttributePutItem<ATTRIBUTE extends Attribute> = Attribute extends ATTRIBUTE
  ? ResolvedAttribute
  : ATTRIBUTE extends AnyAttribute
  ? ResolvedAttribute
  : ATTRIBUTE extends ConstantAttribute
  ? ResolveConstantAttribute<ATTRIBUTE>
  : ATTRIBUTE extends PrimitiveAttribute
  ? ResolvePrimitiveAttribute<ATTRIBUTE>
  : ATTRIBUTE extends SetAttribute
  ? Set<AttributePutItem<ATTRIBUTE['elements']>>
  : ATTRIBUTE extends ListAttribute
  ? AttributePutItem<ATTRIBUTE['elements']>[]
  : ATTRIBUTE extends MapAttribute
  ? O.Required<
      O.Partial<
        {
          // Keep all attributes
          [KEY in keyof ATTRIBUTE['attributes']]: AttributePutItem<ATTRIBUTE['attributes'][KEY]>
        }
      >,
      // Enforce Required attributes
      | O.SelectKeys<ATTRIBUTE['attributes'], { required: AtLeastOnce | OnlyOnce | Always }>
      // Enforce attributes that have hard default
      | O.FilterKeys<ATTRIBUTE['attributes'], { default: undefined | ComputedDefault }>
    >
  : ATTRIBUTE extends RecordAttribute
  ? {
      [KEY in ResolvePrimitiveAttribute<ATTRIBUTE['keys']>]?: AttributePutItem<
        ATTRIBUTE['elements']
      >
    }
  : ATTRIBUTE extends AnyOfAttribute
  ? AttributePutItem<ATTRIBUTE['elements'][number]>
  : never
