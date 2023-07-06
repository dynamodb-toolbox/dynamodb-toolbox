import type { O } from 'ts-toolbelt'

import type {
  Schema,
  Attribute,
  AnyAttribute,
  PrimitiveAttribute,
  SetAttribute,
  ListAttribute,
  MapAttribute,
  RecordAttribute,
  AnyOfAttribute,
  Always,
  ResolvePrimitiveAttribute,
  ComputedDefault
} from 'v1/schema'

import type { EntityV2 } from '../class'

/**
 * User input of an UPDATE command for a given Entity, Schema or Attribute
 *
 * @param Schema Entity | Schema | Attribute
 * @return Object
 */
export type UpdateItemInput<
  SCHEMA extends EntityV2 | Schema | Attribute,
  REQUIRE_INDEPENDENT_DEFAULTS extends boolean = false
> = SCHEMA extends AnyAttribute
  ? unknown
  : SCHEMA extends PrimitiveAttribute
  ? ResolvePrimitiveAttribute<SCHEMA>
  : SCHEMA extends SetAttribute
  ? Set<UpdateItemInput<SCHEMA['elements'], REQUIRE_INDEPENDENT_DEFAULTS>>
  : SCHEMA extends ListAttribute
  ? UpdateItemInput<SCHEMA['elements'], REQUIRE_INDEPENDENT_DEFAULTS>[]
  : SCHEMA extends MapAttribute | Schema
  ? O.Required<
      O.Partial<
        {
          [KEY in keyof SCHEMA['attributes']]: UpdateItemInput<
            SCHEMA['attributes'][KEY],
            REQUIRE_INDEPENDENT_DEFAULTS
          >
        }
      >,
      Exclude<
        // Enforce Required attributes that don't have default values
        O.SelectKeys<
          SCHEMA['attributes'],
          { required: Always } & (
            | { key: true; defaults: { key: undefined } }
            | { key: false; defaults: { update: undefined } }
          )
        >,
        // Add attributes with independent defaults if REQUIRE_INDEPENDENT_DEFAULTS is true
        REQUIRE_INDEPENDENT_DEFAULTS extends true
          ? O.FilterKeys<
              SCHEMA['attributes'],
              | { key: true; defaults: { key: undefined | ComputedDefault } }
              | { key: false; defaults: { update: undefined | ComputedDefault } }
            >
          : never
      >
    >
  : SCHEMA extends RecordAttribute
  ? {
      [KEY in ResolvePrimitiveAttribute<SCHEMA['keys']>]?: UpdateItemInput<
        SCHEMA['elements'],
        REQUIRE_INDEPENDENT_DEFAULTS
      >
    }
  : SCHEMA extends AnyOfAttribute
  ? UpdateItemInput<SCHEMA['elements'][number], REQUIRE_INDEPENDENT_DEFAULTS>
  : SCHEMA extends EntityV2
  ? UpdateItemInput<SCHEMA['schema'], REQUIRE_INDEPENDENT_DEFAULTS>
  : never
