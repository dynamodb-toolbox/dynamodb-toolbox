import type { O } from 'ts-toolbelt'

import type {
  Item,
  $Item,
  Attribute,
  $Attribute,
  ResolvedAttribute,
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
  $open,
  $default
} from 'v1/item/attributes/constants/attributeOptions'

import { EntityV2 } from '../class'

/**
 * Key input of a single item command (GET, DELETE ...) for an Entity, Item or Attribute
 *
 * @param Schema Entity | Item | Attribute
 * @return Object
 */
export type KeyInput<SCHEMA extends EntityV2 | Item | Attribute> = SCHEMA extends AnyAttribute
  ? ResolvedAttribute
  : SCHEMA extends ConstantAttribute
  ? ResolveConstantAttribute<SCHEMA>
  : SCHEMA extends PrimitiveAttribute
  ? ResolvePrimitiveAttribute<SCHEMA>
  : SCHEMA extends SetAttribute
  ? Set<KeyInput<SCHEMA['elements']>>
  : SCHEMA extends ListAttribute
  ? KeyInput<SCHEMA['elements']>[]
  : SCHEMA extends MapAttribute | Item
  ? O.Required<
      O.Partial<
        {
          // Keep only key attributes
          [key in O.SelectKeys<SCHEMA['attributes'], { key: true }>]: KeyInput<
            SCHEMA['attributes'][key]
          >
        }
      >,
      Exclude<
        // Enforce Always Required attributes
        O.SelectKeys<SCHEMA['attributes'], { required: Always }>,
        // ...Except those that have default (not required from user, can be provided by the lib)
        O.FilterKeys<SCHEMA['attributes'], { default: undefined }>
      >
    > & // Add Record<string, ResolvedAttribute> if map is open
      (SCHEMA extends { open: true } ? Record<string, ResolvedAttribute> : unknown)
  : SCHEMA extends EntityV2
  ? KeyInput<SCHEMA['item']>
  : never

// TODO: Required in Entity constructor... See if possible to use only KeyInput w. Item
export type $KeyInput<SCHEMA extends EntityV2 | $Item | $Attribute> = SCHEMA extends $AnyAttribute
  ? ResolvedAttribute
  : SCHEMA extends $ConstantAttribute
  ? $ResolveConstantAttribute<SCHEMA>
  : SCHEMA extends $PrimitiveAttribute
  ? $ResolvePrimitiveAttribute<SCHEMA>
  : SCHEMA extends $SetAttribute
  ? Set<$KeyInput<SCHEMA[$elements]>>
  : SCHEMA extends $ListAttribute
  ? $KeyInput<SCHEMA[$elements]>[]
  : SCHEMA extends $MapAttribute | $Item
  ? O.Required<
      O.Partial<
        {
          // Keep only key attributes
          [key in O.SelectKeys<SCHEMA[$attributes], { [$key]: true }>]: $KeyInput<
            SCHEMA[$attributes][key]
          >
        }
      >,
      Exclude<
        // Enforce Always Required attributes
        O.SelectKeys<SCHEMA[$attributes], { [$required]: Always }>,
        // ...Except those that have default (not required from user, can be provided by the lib)
        O.FilterKeys<SCHEMA[$attributes], { [$default]: undefined }>
      >
    > & // Add Record<string, ResolvedAttribute> if map is open
      (SCHEMA extends { [$open]: true } ? Record<string, ResolvedAttribute> : unknown)
  : SCHEMA extends EntityV2
  ? $KeyInput<SCHEMA['$item']>
  : never
