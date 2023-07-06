import type { O } from 'ts-toolbelt'

import type {
  Schema,
  Attribute,
  ResolvedAttribute,
  AnyAttribute,
  PrimitiveAttribute,
  SetAttribute,
  ListAttribute,
  MapAttribute,
  RecordAttribute,
  AnyOfAttribute,
  Always,
  ResolvePrimitiveAttribute
} from 'v1/schema'

import type { EntityV2 } from '../class'

/**
 * Key input of a single item command (GET, DELETE ...) for an Entity or Schema
 *
 * @param Schema Entity | Schema
 * @return Object
 */
export type KeyInput<SCHEMA extends EntityV2 | Schema> = SCHEMA extends Schema
  ? // NOTE: For some obscure reason, checking that SCHEMA is not EntityV2 or Schema (constraint) triggers an error
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
        O.FilterKeys<SCHEMA['attributes'], { defaults: { key: undefined } }>
      >
    >
  : SCHEMA extends EntityV2
  ? KeyInput<SCHEMA['schema']>
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
  ? unknown
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
        O.FilterKeys<ATTRIBUTE['attributes'], { defaults: { key: undefined } }>
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
