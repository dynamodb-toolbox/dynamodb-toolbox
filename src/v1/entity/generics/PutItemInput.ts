import type { O } from 'ts-toolbelt'

import type {
  Schema,
  Attribute,
  ResolvedAttribute,
  ResolvedMapAttribute,
  AnyAttribute,
  PrimitiveAttribute,
  SetAttribute,
  ListAttribute,
  MapAttribute,
  RecordAttribute,
  AnyOfAttribute,
  AtLeastOnce,
  Always,
  ComputedDefault,
  ResolvePrimitiveAttribute
} from 'v1/schema'

import type { EntityV2 } from '../class'

/**
 * User input of a PUT command for a given Entity or Schema
 *
 * @param Schema Entity | Schema
 * @param RequireHardDefaults Boolean
 * @return Object
 */
export type PutItemInput<
  SCHEMA extends EntityV2 | Schema,
  REQUIRE_HARD_DEFAULTS extends boolean = false
> = EntityV2 extends SCHEMA
  ? ResolvedMapAttribute
  : Schema extends SCHEMA
  ? ResolvedMapAttribute
  : SCHEMA extends Schema
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
          {
            required: AtLeastOnce | Always
            // TODO: Use defaults from get/update etc...
            defaults: { put: undefined }
          }
        >
      // Add attributes with hard (non-computed) defaults if REQUIRE_HARD_DEFAULTS is true
      | (REQUIRE_HARD_DEFAULTS extends true
          ? // TODO: Use defaults from get/update etc...
            O.FilterKeys<SCHEMA['attributes'], { defaults: { put: undefined | ComputedDefault } }>
          : never)
    >
  : SCHEMA extends EntityV2
  ? PutItemInput<SCHEMA['schema'], REQUIRE_HARD_DEFAULTS>
  : never

/**
 * User input of a PUT command for a given Attribute
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
  ? unknown
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
          {
            required: AtLeastOnce | Always
            // TODO: Use defaults from get/update etc...
            defaults: { put: undefined }
          }
        >
      // Add attributes with hard (non-computed) defaults if REQUIRE_HARD_DEFAULTS is true
      | (REQUIRE_HARD_DEFAULTS extends true
          ? O.FilterKeys<
              ATTRIBUTE['attributes'],
              {
                // TODO: Use defaults from get/update etc...
                defaults: { put: undefined | ComputedDefault }
              }
            >
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
