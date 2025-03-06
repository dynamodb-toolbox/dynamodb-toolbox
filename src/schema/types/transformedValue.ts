import type { Call } from 'hotscript'

import type {
  Always,
  AnyOfSchema,
  AnySchema,
  BinarySchema,
  BooleanSchema,
  ItemSchema,
  ListSchema,
  MapSchema,
  Never,
  NullSchema,
  NumberSchema,
  PrimitiveSchema,
  RecordSchema,
  ResolveAnySchema,
  ResolveBinarySchema,
  ResolveBooleanSchema,
  ResolveNumberSchema,
  ResolveStringSchema,
  ResolvedNullSchema,
  ResolvedPrimitiveSchema,
  Schema,
  SetSchema,
  StringSchema
} from '~/schema/index.js'
import type { Transformer, TypeModifier } from '~/transformers/index.js'
import type { Extends, If, Not, Optional, Overwrite, SelectKeys } from '~/types/index.js'

import type { SchemaExtendedWriteValue, WriteValueOptions } from './options.js'

export type TransformedValue<
  SCHEMA extends Schema,
  OPTIONS extends WriteValueOptions = {}
> = SCHEMA extends ItemSchema
  ? ItemSchemaTransformedValue<SCHEMA, OPTIONS>
  : SCHEMA extends Schema
    ? AttrTransformedValue<SCHEMA, OPTIONS>
    : never

type MustBeDefined<SCHEMA extends Schema, OPTIONS extends WriteValueOptions = {}> = If<
  Extends<OPTIONS, { defined: true }>,
  true,
  If<
    Extends<OPTIONS, { mode: 'update' | 'key' }>,
    Extends<SCHEMA['props'], { required: Always }>,
    Not<Extends<SCHEMA['props'], { required: Never }>>
  >
>

type OptionalKeys<SCHEMA extends MapSchema | ItemSchema, OPTIONS extends WriteValueOptions = {}> = {
  [KEY in keyof SCHEMA['attributes']]: If<
    MustBeDefined<SCHEMA['attributes'][KEY], OPTIONS>,
    never,
    SCHEMA['attributes'][KEY] extends { props: { savedAs: string } }
      ? // '& string' needed for old TS versions
        SCHEMA['attributes'][KEY]['props']['savedAs'] & string
      : KEY
  >
}[keyof SCHEMA['attributes']]

type ItemSchemaTransformedValue<
  SCHEMA extends ItemSchema,
  OPTIONS extends WriteValueOptions = {}
> = ItemSchema extends SCHEMA
  ? { [KEY: string]: AttrTransformedValue<Schema, Overwrite<OPTIONS, { defined: false }>> }
  : Optional<
      {
        [KEY in OPTIONS extends { mode: 'key' }
          ? SelectKeys<SCHEMA['attributes'], { props: { key: true } }>
          : keyof SCHEMA['attributes'] as SCHEMA['attributes'][KEY]['props'] extends {
          savedAs: string
        }
          ? SCHEMA['attributes'][KEY]['props']['savedAs']
          : KEY]: AttrTransformedValue<
          SCHEMA['attributes'][KEY],
          Overwrite<OPTIONS, { defined: false }>
        >
      },
      OptionalKeys<SCHEMA, Overwrite<OPTIONS, { defined: false }>>
    >

type AttrTransformedValue<
  SCHEMA extends Schema,
  OPTIONS extends WriteValueOptions = {}
> = Schema extends SCHEMA
  ? unknown
  :
      | (SCHEMA extends AnySchema ? AnySchemaTransformedValue<SCHEMA, OPTIONS> : never)
      | (SCHEMA extends PrimitiveSchema ? PrimitiveSchemaTransformedValue<SCHEMA, OPTIONS> : never)
      | (SCHEMA extends SetSchema ? SetSchemaTransformedValue<SCHEMA, OPTIONS> : never)
      | (SCHEMA extends ListSchema ? ListSchemaTransformedValue<SCHEMA, OPTIONS> : never)
      | (SCHEMA extends MapSchema ? MapSchemaTransformedValue<SCHEMA, OPTIONS> : never)
      | (SCHEMA extends RecordSchema ? RecordSchemaTransformedValue<SCHEMA, OPTIONS> : never)
      | (SCHEMA extends AnyOfSchema ? AnyOfSchemaTransformedValue<SCHEMA, OPTIONS> : never)

type AnySchemaTransformedValue<
  SCHEMA extends AnySchema,
  OPTIONS extends WriteValueOptions = {}
> = AnySchema extends SCHEMA
  ? unknown
  :
      | If<MustBeDefined<SCHEMA, OPTIONS>, never, undefined>
      | SchemaExtendedWriteValue<SCHEMA, OPTIONS>
      | (SCHEMA['props'] extends { transform: Transformer }
          ? Call<TypeModifier<SCHEMA['props']['transform']>, ResolveAnySchema<SCHEMA>>
          : ResolveAnySchema<SCHEMA>)

type PrimitiveSchemaTransformedValue<
  SCHEMA extends PrimitiveSchema,
  OPTIONS extends WriteValueOptions = {}
> = PrimitiveSchema extends SCHEMA
  ? undefined | SchemaExtendedWriteValue<SCHEMA, OPTIONS> | ResolvedPrimitiveSchema
  :
      | If<MustBeDefined<SCHEMA, OPTIONS>, never, undefined>
      | SchemaExtendedWriteValue<SCHEMA, OPTIONS>
      | (SCHEMA extends NullSchema ? ResolvedNullSchema : never)
      | (SCHEMA extends NumberSchema
          ? SCHEMA['props'] extends { transform: Transformer }
            ? Call<TypeModifier<SCHEMA['props']['transform']>, ResolveNumberSchema<SCHEMA>>
            : ResolveNumberSchema<SCHEMA>
          : never)
      | (SCHEMA extends BooleanSchema
          ? SCHEMA['props'] extends { transform: Transformer }
            ? Call<TypeModifier<SCHEMA['props']['transform']>, ResolveBooleanSchema<SCHEMA>>
            : ResolveBooleanSchema<SCHEMA>
          : never)
      | (SCHEMA extends StringSchema
          ? SCHEMA['props'] extends { transform: Transformer }
            ? Call<TypeModifier<SCHEMA['props']['transform']>, ResolveStringSchema<SCHEMA>>
            : ResolveStringSchema<SCHEMA>
          : never)
      | (SCHEMA extends BinarySchema
          ? SCHEMA['props'] extends { transform: Transformer }
            ? Call<TypeModifier<SCHEMA['props']['transform']>, ResolveBinarySchema<SCHEMA>>
            : ResolveBinarySchema<SCHEMA>
          : never)

type SetSchemaTransformedValue<
  SCHEMA extends SetSchema,
  OPTIONS extends WriteValueOptions = {}
> = SetSchema extends SCHEMA
  ?
      | If<MustBeDefined<SCHEMA, OPTIONS>, never, undefined>
      | SchemaExtendedWriteValue<SCHEMA, OPTIONS>
      | Set<
          AttrTransformedValue<
            SetSchema['elements'],
            Overwrite<OPTIONS, { mode: 'put'; defined: false }>
          >
        >
  :
      | If<MustBeDefined<SCHEMA, OPTIONS>, never, undefined>
      | SchemaExtendedWriteValue<SCHEMA, OPTIONS>
      | Set<
          AttrTransformedValue<
            SCHEMA['elements'],
            Overwrite<OPTIONS, { mode: 'put'; defined: false }>
          >
        >

type ListSchemaTransformedValue<
  SCHEMA extends ListSchema,
  OPTIONS extends WriteValueOptions = {}
> = ListSchema extends SCHEMA
  ?
      | If<MustBeDefined<SCHEMA, OPTIONS>, never, undefined>
      | SchemaExtendedWriteValue<SCHEMA, OPTIONS>
      | unknown[]
  :
      | If<MustBeDefined<SCHEMA, OPTIONS>, never, undefined>
      | SchemaExtendedWriteValue<SCHEMA, OPTIONS>
      | AttrTransformedValue<SCHEMA['elements'], Overwrite<OPTIONS, { defined: false }>>[]

type MapSchemaTransformedValue<
  SCHEMA extends MapSchema,
  OPTIONS extends WriteValueOptions = {}
> = MapSchema extends SCHEMA
  ?
      | If<MustBeDefined<SCHEMA, OPTIONS>, never, undefined>
      | SchemaExtendedWriteValue<SCHEMA, OPTIONS>
      | { [KEY: string]: unknown }
  :
      | If<MustBeDefined<SCHEMA, OPTIONS>, never, undefined>
      | SchemaExtendedWriteValue<SCHEMA, OPTIONS>
      | Optional<
          {
            [KEY in OPTIONS extends { mode: 'key' }
              ? SelectKeys<SCHEMA['attributes'], { props: { key: true } }>
              : keyof SCHEMA['attributes'] as SCHEMA['attributes'][KEY]['props'] extends {
              savedAs: string
            }
              ? SCHEMA['attributes'][KEY]['props']['savedAs']
              : KEY]: AttrTransformedValue<
              SCHEMA['attributes'][KEY],
              Overwrite<OPTIONS, { defined: false }>
            >
          },
          OptionalKeys<SCHEMA, Overwrite<OPTIONS, { defined: false }>>
        >

type RecordSchemaTransformedValue<
  SCHEMA extends RecordSchema,
  OPTIONS extends WriteValueOptions = {}
> = RecordSchema extends SCHEMA
  ?
      | If<MustBeDefined<SCHEMA, OPTIONS>, never, undefined>
      | SchemaExtendedWriteValue<SCHEMA, OPTIONS>
      | Record<string, unknown>
  :
      | If<MustBeDefined<SCHEMA, OPTIONS>, never, undefined>
      | SchemaExtendedWriteValue<SCHEMA, OPTIONS>
      | Optional<
          Record<
            Extract<AttrTransformedValue<SCHEMA['keys'], OPTIONS>, string>,
            AttrTransformedValue<SCHEMA['elements'], Overwrite<OPTIONS, { defined: false }>>
          >,
          | (SCHEMA['props'] extends { partial: true } ? string : never)
          | (OPTIONS extends { mode: 'update' } ? string : never)
        >

type AnyOfSchemaTransformedValue<
  SCHEMA extends AnyOfSchema,
  OPTIONS extends WriteValueOptions = {}
> = AnyOfSchema extends SCHEMA
  ? unknown
  :
      | If<MustBeDefined<SCHEMA, OPTIONS>, never, undefined>
      | SchemaExtendedWriteValue<SCHEMA, OPTIONS>
      | MapAnyOfSchemaTransformedValue<SCHEMA['elements'], OPTIONS>

type MapAnyOfSchemaTransformedValue<
  ELEMENTS extends Schema[],
  OPTIONS extends WriteValueOptions = {},
  RESULTS = never
> = ELEMENTS extends [infer ELEMENTS_HEAD, ...infer ELEMENTS_TAIL]
  ? ELEMENTS_HEAD extends Schema
    ? ELEMENTS_TAIL extends Schema[]
      ? MapAnyOfSchemaTransformedValue<
          ELEMENTS_TAIL,
          OPTIONS,
          RESULTS | AttrTransformedValue<ELEMENTS_HEAD, OPTIONS>
        >
      : never
    : never
  : [RESULTS] extends [never]
    ? unknown
    : RESULTS
