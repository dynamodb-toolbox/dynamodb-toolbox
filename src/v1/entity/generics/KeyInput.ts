import type { O } from 'ts-toolbelt'

import type {
  Item,
  $Item,
  Attribute,
  $Attribute,
  ResolvedAttribute,
  ResolvedMapAttribute,
  AnyAttribute,
  $AnyAttribute,
  ConstantAttribute,
  $ConstantAttribute,
  PrimitiveAttribute,
  $PrimitiveAttribute,
  SetAttribute,
  $SetAttribute,
  ListAttribute,
  $ListAttribute,
  MapAttribute,
  $MapAttribute,
  AnyOfAttribute,
  $AnyOfAttribute,
  Always,
  $ResolveConstantAttribute,
  ResolveConstantAttribute,
  $ResolvePrimitiveAttribute,
  ResolvePrimitiveAttribute
} from 'v1/item'
import type {
  $elements,
  $attributes,
  $required,
  $key,
  $default
} from 'v1/item/attributes/constants/attributeOptions'

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
  : ATTRIBUTE extends AnyOfAttribute
  ? AttributeKeyInput<ATTRIBUTE['elements'][number]>
  : never

// TODO: Required in Entity constructor... See if possible to use only KeyInput w. Item
export type $KeyInput<SCHEMA extends EntityV2 | $Item> = EntityV2 extends SCHEMA
  ? ResolvedMapAttribute
  : $Item extends SCHEMA
  ? ResolvedMapAttribute
  : SCHEMA extends $Item
  ? O.Required<
      O.Partial<
        {
          // Keep only key attributes
          [KEY in O.SelectKeys<SCHEMA[$attributes], { [$key]: true }>]: $AttributeKeyInput<
            SCHEMA[$attributes][KEY]
          >
        }
      >,
      Exclude<
        // Enforce Always Required attributes
        O.SelectKeys<SCHEMA[$attributes], { [$required]: Always }>,
        // ...Except those that have default (not required from user, can be provided by the lib)
        O.FilterKeys<SCHEMA[$attributes], { [$default]: undefined }>
      >
    >
  : SCHEMA extends EntityV2
  ? $KeyInput<SCHEMA['$item']>
  : never

// TODO: Required in Entity constructor... See if possible to use only KeyInput w. Item
export type $AttributeKeyInput<ATTRIBUTE extends $Attribute> = $Attribute extends ATTRIBUTE
  ? ResolvedAttribute
  : ATTRIBUTE extends $AnyAttribute
  ? ResolvedAttribute
  : ATTRIBUTE extends $ConstantAttribute
  ? $ResolveConstantAttribute<ATTRIBUTE>
  : ATTRIBUTE extends $PrimitiveAttribute
  ? $ResolvePrimitiveAttribute<ATTRIBUTE>
  : ATTRIBUTE extends $SetAttribute
  ? Set<$AttributeKeyInput<ATTRIBUTE[$elements]>>
  : ATTRIBUTE extends $ListAttribute
  ? $AttributeKeyInput<ATTRIBUTE[$elements]>[]
  : ATTRIBUTE extends $MapAttribute
  ? O.Required<
      O.Partial<
        {
          // Keep only key attributes
          [key in O.SelectKeys<ATTRIBUTE[$attributes], { [$key]: true }>]: $AttributeKeyInput<
            ATTRIBUTE[$attributes][key]
          >
        }
      >,
      Exclude<
        // Enforce Always Required attributes
        O.SelectKeys<ATTRIBUTE[$attributes], { [$required]: Always }>,
        // ...Except those that have default (not required from user, can be provided by the lib)
        O.FilterKeys<ATTRIBUTE[$attributes], { [$default]: undefined }>
      >
    >
  : ATTRIBUTE extends $AnyOfAttribute
  ? $AttributeKeyInput<ATTRIBUTE[$elements][number]>
  : never
