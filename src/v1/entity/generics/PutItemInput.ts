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
 * User input of a PUT command for a given Entity or Item
 *
 * @param Schema Entity | Item
 * @param RequireHardDefaults Boolean
 * @return Object
 */
export type PutItemInput<
  SCHEMA extends EntityV2 | Item,
  REQUIRE_HARD_DEFAULTS extends boolean = false
> = EntityV2 extends SCHEMA
  ? ResolvedMapAttribute
  : Item extends SCHEMA
  ? ResolvedMapAttribute
  : SCHEMA extends Item
  ? O.Required<
      O.Partial<
        {
          // Keep all attributes
          [KEY in keyof SCHEMA['attributes']]: AttributePutItemInput<
            SCHEMA['attributes'][KEY],
            REQUIRE_HARD_DEFAULTS
          >
        }
      >,
      // Enforce Required attributes except those that have default (will be provided by the lib)
      | O.SelectKeys<
          SCHEMA['attributes'],
          { required: AtLeastOnce | OnlyOnce | Always; default: undefined }
        >
      // Add attributes with hard (non-computed) defaults if REQUIRE_HARD_DEFAULTS is true
      | (REQUIRE_HARD_DEFAULTS extends true
          ? O.FilterKeys<SCHEMA['attributes'], { default: undefined | ComputedDefault }>
          : never)
    >
  : SCHEMA extends EntityV2
  ? PutItemInput<SCHEMA['item'], REQUIRE_HARD_DEFAULTS>
  : never

/**
 * User input of a PUT command for a given Entity, Item or Attribute
 *
 * @param Attribute Attribute
 * @param RequireHardDefaults Boolean
 * @return Any
 */
export type AttributePutItemInput<
  ATTRIBUTE extends Attribute,
  REQUIRE_HARD_DEFAULTS extends boolean = false
> = Attribute extends ATTRIBUTE
  ? ResolvedAttribute
  : ATTRIBUTE extends AnyAttribute
  ? ResolvedAttribute
  : ATTRIBUTE extends ConstantAttribute
  ? ResolveConstantAttribute<ATTRIBUTE>
  : ATTRIBUTE extends PrimitiveAttribute
  ? ResolvePrimitiveAttribute<ATTRIBUTE>
  : ATTRIBUTE extends SetAttribute
  ? Set<AttributePutItemInput<ATTRIBUTE['elements'], REQUIRE_HARD_DEFAULTS>>
  : ATTRIBUTE extends ListAttribute
  ? AttributePutItemInput<ATTRIBUTE['elements'], REQUIRE_HARD_DEFAULTS>[]
  : ATTRIBUTE extends MapAttribute
  ? O.Required<
      O.Partial<
        {
          // Keep all attributes
          [KEY in keyof ATTRIBUTE['attributes']]: AttributePutItemInput<
            ATTRIBUTE['attributes'][KEY],
            REQUIRE_HARD_DEFAULTS
          >
        }
      >,
      // Enforce Required attributes except those that have default (will be provided by the lib)
      | O.SelectKeys<
          ATTRIBUTE['attributes'],
          { required: AtLeastOnce | OnlyOnce | Always; default: undefined }
        >
      // Add attributes with hard (non-computed) defaults if REQUIRE_HARD_DEFAULTS is true
      | (REQUIRE_HARD_DEFAULTS extends true
          ? O.FilterKeys<ATTRIBUTE['attributes'], { default: undefined | ComputedDefault }>
          : never)
    >
  : ATTRIBUTE extends RecordAttribute
  ? {
      [KEY in ResolvePrimitiveAttribute<ATTRIBUTE['keys']>]?: AttributePutItemInput<
        ATTRIBUTE['elements'],
        REQUIRE_HARD_DEFAULTS
      >
    }
  : ATTRIBUTE extends AnyOfAttribute
  ? AttributePutItemInput<ATTRIBUTE['elements'][number], REQUIRE_HARD_DEFAULTS>
  : never
