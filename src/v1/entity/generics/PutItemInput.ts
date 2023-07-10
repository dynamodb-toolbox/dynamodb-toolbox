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
 * @param RequireIndependentDefaults Boolean
 * @return Object
 */
export type PutItemInput<
  SCHEMA extends EntityV2 | Schema,
  REQUIRE_INDEPENDENT_DEFAULTS extends boolean = false
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
            REQUIRE_INDEPENDENT_DEFAULTS
          >
        }
      >,
      // Enforce Required attributes that don't have default values
      | O.SelectKeys<
          SCHEMA['attributes'],
          { required: AtLeastOnce | Always } & (
            | { key: true; defaults: { key: undefined } }
            | { key: false; defaults: { put: undefined } }
          )
        >
      // Add attributes with independent defaults if REQUIRE_INDEPENDENT_DEFAULTS is true
      | (REQUIRE_INDEPENDENT_DEFAULTS extends true
          ? O.FilterKeys<
              SCHEMA['attributes'],
              | { key: true; defaults: { key: undefined | ComputedDefault } }
              | { key: false; defaults: { put: undefined | ComputedDefault } }
            >
          : never)
    >
  : SCHEMA extends EntityV2
  ? PutItemInput<SCHEMA['schema'], REQUIRE_INDEPENDENT_DEFAULTS>
  : never

/**
 * User input of a PUT command for a given Attribute
 *
 * @param Attribute Attribute
 * @param RequireIndependentDefaults Boolean
 * @return Any
 */
export type AttributePutItemInput<
  ATTRIBUTE extends Attribute,
  REQUIRE_INDEPENDENT_DEFAULTS extends boolean = false
> = Attribute extends ATTRIBUTE
  ? ResolvedAttribute
  : ATTRIBUTE extends AnyAttribute
  ? unknown
  : ATTRIBUTE extends PrimitiveAttribute
  ? ResolvePrimitiveAttribute<ATTRIBUTE>
  : ATTRIBUTE extends SetAttribute
  ? Set<AttributePutItemInput<ATTRIBUTE['elements'], REQUIRE_INDEPENDENT_DEFAULTS>>
  : ATTRIBUTE extends ListAttribute
  ? AttributePutItemInput<ATTRIBUTE['elements'], REQUIRE_INDEPENDENT_DEFAULTS>[]
  : ATTRIBUTE extends MapAttribute
  ? O.Required<
      O.Partial<
        {
          // Keep all attributes
          [KEY in keyof ATTRIBUTE['attributes']]: AttributePutItemInput<
            ATTRIBUTE['attributes'][KEY],
            REQUIRE_INDEPENDENT_DEFAULTS
          >
        }
      >,
      // Enforce Required attributes that don't have default values (will be provided by the lib)
      | O.SelectKeys<
          ATTRIBUTE['attributes'],
          { required: AtLeastOnce | Always } & (
            | { key: true; defaults: { key: undefined } }
            | { key: false; defaults: { put: undefined } }
          )
        >
      // Add attributes with independent defaults if REQUIRE_INDEPENDENT_DEFAULTS is true
      | (REQUIRE_INDEPENDENT_DEFAULTS extends true
          ? O.FilterKeys<
              ATTRIBUTE['attributes'],
              | { key: true; defaults: { key: undefined | ComputedDefault } }
              | { key: false; defaults: { put: undefined | ComputedDefault } }
            >
          : never)
    >
  : ATTRIBUTE extends RecordAttribute
  ? {
      [KEY in ResolvePrimitiveAttribute<ATTRIBUTE['keys']>]?: AttributePutItemInput<
        ATTRIBUTE['elements'],
        REQUIRE_INDEPENDENT_DEFAULTS
      >
    }
  : ATTRIBUTE extends AnyOfAttribute
  ? AttributePutItemInput<ATTRIBUTE['elements'][number], REQUIRE_INDEPENDENT_DEFAULTS>
  : never
