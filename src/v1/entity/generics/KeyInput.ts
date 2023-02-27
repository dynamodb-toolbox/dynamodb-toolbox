import type { O } from 'ts-toolbelt'

import type {
  Item,
  Attribute,
  ResolvedAttribute,
  AnyAttribute,
  ConstantAttribute,
  PrimitiveAttribute,
  SetAttribute,
  ListAttribute,
  MapAttribute,
  RecordAttribute,
  AnyOfAttribute,
  Always,
  ResolveConstantAttribute,
  ResolvePrimitiveAttribute
} from 'v1/item'

import type { EntityV2 } from '../class'

/**
 * Key input of a single item command (GET, DELETE ...) for an Entity or Item
 *
 * @param Schema Entity | Item
 * @return Object
 */
export type KeyInput<SCHEMA extends EntityV2 | Item> = SCHEMA extends Item
  ? // NOTE: For some obscure reason, checking that SCHEMA is not EntityV2 or Item (constraint) triggers an error
    O.Required<
      O.Partial<
        {
          // Keep only key attributes
          [KEY in O.SelectKeys<SCHEMA['attributes'], { key: true }>]: AttributeKeyInput<
            SCHEMA['attributes'][KEY]
          >
        }
      >,
      Exclude<
        // Enforce Always Required attributes
        O.SelectKeys<SCHEMA['attributes'], { required: Always }>,
        // ...Except those that have default (not required from user, can be provided by the lib)
        O.FilterKeys<SCHEMA['attributes'], { default: undefined }>
      >
    >
  : SCHEMA extends EntityV2
  ? KeyInput<SCHEMA['item']>
  : never

/**
 * Key input of a single item command (GET, DELETE ...) for an Attribute
 *
 * @param Attribute Attribute
 * @return Any
 */
export type AttributeKeyInput<ATTRIBUTE extends Attribute> = Attribute extends ATTRIBUTE
  ? ResolvedAttribute
  : ATTRIBUTE extends AnyAttribute
  ? ResolvedAttribute
  : ATTRIBUTE extends ConstantAttribute
  ? ResolveConstantAttribute<ATTRIBUTE>
  : ATTRIBUTE extends PrimitiveAttribute
  ? ResolvePrimitiveAttribute<ATTRIBUTE>
  : ATTRIBUTE extends SetAttribute
  ? Set<AttributeKeyInput<ATTRIBUTE['elements']>>
  : ATTRIBUTE extends ListAttribute
  ? AttributeKeyInput<ATTRIBUTE['elements']>[]
  : ATTRIBUTE extends MapAttribute
  ? O.Required<
      O.Partial<
        {
          // Keep only key attributes
          [KEY in O.SelectKeys<ATTRIBUTE['attributes'], { key: true }>]: AttributeKeyInput<
            ATTRIBUTE['attributes'][KEY]
          >
        }
      >,
      Exclude<
        // Enforce Always Required attributes
        O.SelectKeys<ATTRIBUTE['attributes'], { required: Always }>,
        // ...Except those that have default (not required from user, can be provided by the lib)
        O.FilterKeys<ATTRIBUTE['attributes'], { default: undefined }>
      >
    >
  : ATTRIBUTE extends RecordAttribute
  ? {
      [KEY in ResolvePrimitiveAttribute<ATTRIBUTE['keys']>]?: AttributeKeyInput<
        ATTRIBUTE['elements']
      >
    }
  : ATTRIBUTE extends AnyOfAttribute
  ? AttributeKeyInput<ATTRIBUTE['elements'][number]>
  : never
