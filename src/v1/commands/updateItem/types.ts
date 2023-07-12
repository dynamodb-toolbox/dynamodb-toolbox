import type { O } from 'ts-toolbelt'

import type {
  Schema,
  Attribute,
  ResolvedAttribute,
  ResolvePrimitiveAttribute,
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
  Never,
  ComputedDefault
} from 'v1/schema'
import type { OptionalizeUndefinableProperties } from 'v1/types/optionalizeUndefinableProperties'
import type { EntityV2 } from 'v1/entity/class'

type MustBeDefined<
  ATTRIBUTE extends Attribute,
  REQUIRE_INDEPENDENT_DEFAULTS extends boolean = false
> =
  // Enforce Required attributes that don't have default values
  ATTRIBUTE extends { required: Always } & (
    | { key: true; defaults: { key: undefined } }
    | { key: false; defaults: { update: undefined } }
  )
    ? true
    : REQUIRE_INDEPENDENT_DEFAULTS extends true
    ? // Add attributes with independent defaults if REQUIRE_INDEPENDENT_DEFAULTS is true
      ATTRIBUTE extends
        | { key: true; defaults: { key: undefined | ComputedDefault } }
        | { key: false; defaults: { update: undefined | ComputedDefault } }
      ? false
      : true
    : false

/**
 * User input of an UPDATE command for a given Entity or Schema
 *
 * @param Schema Entity | Schema
 * @param RequireIndependentDefaults Boolean
 * @return Object
 */
export type UpdateItemInput<
  SCHEMA extends EntityV2 | Schema,
  REQUIRE_INDEPENDENT_DEFAULTS extends boolean = false
> = EntityV2 extends SCHEMA
  ? ResolvedMapAttribute
  : Schema extends SCHEMA
  ? ResolvedMapAttribute
  : SCHEMA extends Schema
  ? OptionalizeUndefinableProperties<
      {
        [KEY in keyof SCHEMA['attributes']]: AttributeUpdateItemInput<
          SCHEMA['attributes'][KEY],
          REQUIRE_INDEPENDENT_DEFAULTS
        >
      },
      // Sadly we override optional AnyAttributes as 'unknown | undefined' => 'unknown' (undefined lost in the process)
      O.SelectKeys<SCHEMA['attributes'], AnyAttribute & { required: AtLeastOnce | Never }>
    >
  : SCHEMA extends EntityV2
  ? UpdateItemInput<SCHEMA['schema'], REQUIRE_INDEPENDENT_DEFAULTS>
  : never

/**
 * User input of an UPDATE command for a given Attribute
 *
 * @param Attribute Attribute
 * @param RequireIndependentDefaults Boolean
 * @return Any
 */
export type AttributeUpdateItemInput<
  ATTRIBUTE extends Attribute,
  REQUIRE_INDEPENDENT_DEFAULTS extends boolean = false
> = Attribute extends ATTRIBUTE
  ? ResolvedAttribute | undefined
  :
      | (MustBeDefined<ATTRIBUTE, REQUIRE_INDEPENDENT_DEFAULTS> extends true ? never : undefined)
      | (ATTRIBUTE extends AnyAttribute
          ? unknown
          : ATTRIBUTE extends PrimitiveAttribute
          ? ResolvePrimitiveAttribute<ATTRIBUTE>
          : ATTRIBUTE extends SetAttribute
          ? Set<AttributeUpdateItemInput<ATTRIBUTE['elements'], REQUIRE_INDEPENDENT_DEFAULTS>>
          : ATTRIBUTE extends ListAttribute
          ? AttributeUpdateItemInput<ATTRIBUTE['elements'], REQUIRE_INDEPENDENT_DEFAULTS>[]
          : ATTRIBUTE extends MapAttribute
          ? OptionalizeUndefinableProperties<
              {
                [KEY in keyof ATTRIBUTE['attributes']]: AttributeUpdateItemInput<
                  ATTRIBUTE['attributes'][KEY],
                  REQUIRE_INDEPENDENT_DEFAULTS
                >
              },
              // Sadly we override optional AnyAttributes as 'unknown | undefined' => 'unknown' (undefined lost in the process)
              O.SelectKeys<
                ATTRIBUTE['attributes'],
                AnyAttribute & { required: AtLeastOnce | Never }
              >
            >
          : ATTRIBUTE extends RecordAttribute
          ? {
              [KEY in ResolvePrimitiveAttribute<ATTRIBUTE['keys']>]?: AttributeUpdateItemInput<
                ATTRIBUTE['elements'],
                REQUIRE_INDEPENDENT_DEFAULTS
              >
            }
          : ATTRIBUTE extends AnyOfAttribute
          ? AttributeUpdateItemInput<ATTRIBUTE['elements'][number], REQUIRE_INDEPENDENT_DEFAULTS>
          : never)
