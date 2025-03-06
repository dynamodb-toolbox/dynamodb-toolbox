import type {
  Always,
  AnyOfSchema,
  AnySchema,
  ItemSchema,
  ListSchema,
  MapSchema,
  Never,
  PrimitiveSchema,
  RecordSchema,
  ResolveAnySchema,
  ResolvePrimitiveSchema,
  ResolveStringSchema,
  ResolvedPrimitiveSchema,
  Schema,
  SetSchema
} from '~/schema/index.js'
import type { Extends, If, Not, Optional, Overwrite, SelectKeys } from '~/types/index.js'

import type { SchemaExtendedWriteValue, WriteValueOptions } from './options.js'

export type InputValue<
  SCHEMA extends Schema,
  OPTIONS extends WriteValueOptions = {}
> = SCHEMA extends ItemSchema
  ? ItemSchemaInputValue<SCHEMA, OPTIONS>
  : SCHEMA extends Schema
    ? AttrInputValue<SCHEMA, OPTIONS>
    : never

type MustBeProvided<SCHEMA extends Schema, OPTIONS extends WriteValueOptions = {}> = If<
  Extends<OPTIONS, { defined: true }>,
  true,
  If<
    Extends<OPTIONS, { mode: 'update' | 'key' }>,
    If<
      Not<Extends<SCHEMA['props'], { required: Always }>>,
      false,
      If<
        Extends<SCHEMA['props'], { key: true }>,
        Not<Extends<SCHEMA['props'], { keyDefault: unknown } | { keyLink: unknown }>>,
        Not<Extends<SCHEMA['props'], { updateDefault: unknown } | { updateLink: unknown }>>
      >
    >,
    If<
      Extends<SCHEMA['props'], { required: Never }>,
      false,
      If<
        Extends<SCHEMA['props'], { key: true }>,
        Not<Extends<SCHEMA['props'], { keyDefault: unknown } | { keyLink: unknown }>>,
        Not<Extends<SCHEMA['props'], { putDefault: unknown } | { putLink: unknown }>>
      >
    >
  >
>

type OptionalKeys<SCHEMA extends MapSchema | ItemSchema, OPTIONS extends WriteValueOptions = {}> = {
  [KEY in keyof SCHEMA['attributes']]: If<
    MustBeProvided<SCHEMA['attributes'][KEY], OPTIONS>,
    never,
    KEY
  >
}[keyof SCHEMA['attributes']]

type ItemSchemaInputValue<
  SCHEMA extends ItemSchema,
  OPTIONS extends WriteValueOptions = {}
> = ItemSchema extends SCHEMA
  ? { [KEY: string]: AttrInputValue<Schema, Overwrite<OPTIONS, { defined: false }>> }
  : Optional<
      {
        [KEY in OPTIONS extends { mode: 'key' }
          ? SelectKeys<SCHEMA['attributes'], { props: { key: true } }>
          : keyof SCHEMA['attributes']]: AttrInputValue<
          SCHEMA['attributes'][KEY],
          Overwrite<OPTIONS, { defined: false }>
        >
      },
      OptionalKeys<SCHEMA, Overwrite<OPTIONS, { defined: false }>>
    >

type AttrInputValue<
  SCHEMA extends Schema,
  OPTIONS extends WriteValueOptions = {}
> = Schema extends SCHEMA
  ? unknown
  :
      | (SCHEMA extends AnySchema ? AnySchemaInputValue<SCHEMA, OPTIONS> : never)
      | (SCHEMA extends PrimitiveSchema ? PrimitiveSchemaInputValue<SCHEMA, OPTIONS> : never)
      | (SCHEMA extends SetSchema ? SetSchemaInputValue<SCHEMA, OPTIONS> : never)
      | (SCHEMA extends ListSchema ? ListSchemaInputValue<SCHEMA, OPTIONS> : never)
      | (SCHEMA extends MapSchema ? MapSchemaInputValue<SCHEMA, OPTIONS> : never)
      | (SCHEMA extends RecordSchema ? RecordSchemaInputValue<SCHEMA, OPTIONS> : never)
      | (SCHEMA extends AnyOfSchema ? AnyOfSchemaInputValue<SCHEMA, OPTIONS> : never)

type AnySchemaInputValue<
  SCHEMA extends AnySchema,
  OPTIONS extends WriteValueOptions = {}
> = AnySchema extends SCHEMA
  ? unknown
  :
      | If<MustBeProvided<SCHEMA, OPTIONS>, never, undefined>
      | SchemaExtendedWriteValue<SCHEMA, OPTIONS>
      | ResolveAnySchema<SCHEMA>

type PrimitiveSchemaInputValue<
  SCHEMA extends PrimitiveSchema,
  OPTIONS extends WriteValueOptions = {}
> = PrimitiveSchema extends SCHEMA
  ? undefined | ResolvedPrimitiveSchema | SchemaExtendedWriteValue<SCHEMA, OPTIONS>
  :
      | If<MustBeProvided<SCHEMA, OPTIONS>, never, undefined>
      | SchemaExtendedWriteValue<SCHEMA, OPTIONS>
      | ResolvePrimitiveSchema<SCHEMA>

type SetSchemaInputValue<
  SCHEMA extends SetSchema,
  OPTIONS extends WriteValueOptions = {}
> = SetSchema extends SCHEMA
  ?
      | undefined
      | SchemaExtendedWriteValue<SCHEMA, OPTIONS>
      | Set<
          AttrInputValue<SetSchema['elements'], Overwrite<OPTIONS, { mode: 'put'; defined: false }>>
        >
  :
      | If<MustBeProvided<SCHEMA, OPTIONS>, never, undefined>
      | SchemaExtendedWriteValue<SCHEMA, OPTIONS>
      | Set<AttrInputValue<SCHEMA['elements'], Overwrite<OPTIONS, { mode: 'put'; defined: false }>>>

type ListSchemaInputValue<
  SCHEMA extends ListSchema,
  OPTIONS extends WriteValueOptions = {}
> = ListSchema extends SCHEMA
  ? undefined | SchemaExtendedWriteValue<SCHEMA, OPTIONS> | unknown[]
  :
      | If<MustBeProvided<SCHEMA, OPTIONS>, never, undefined>
      | SchemaExtendedWriteValue<SCHEMA, OPTIONS>
      | AttrInputValue<SCHEMA['elements'], Overwrite<OPTIONS, { defined: false }>>[]

type MapSchemaInputValue<
  SCHEMA extends MapSchema,
  OPTIONS extends WriteValueOptions = {}
> = MapSchema extends SCHEMA
  ? undefined | SchemaExtendedWriteValue<SCHEMA, OPTIONS> | { [KEY: string]: unknown }
  :
      | If<MustBeProvided<SCHEMA, OPTIONS>, never, undefined>
      | SchemaExtendedWriteValue<SCHEMA, OPTIONS>
      | Optional<
          {
            [KEY in OPTIONS extends { mode: 'key' }
              ? SelectKeys<SCHEMA['attributes'], { props: { key: true } }>
              : keyof SCHEMA['attributes']]: AttrInputValue<
              SCHEMA['attributes'][KEY],
              Overwrite<OPTIONS, { defined: false }>
            >
          },
          OptionalKeys<SCHEMA, Overwrite<OPTIONS, { defined: false }>>
        >

type RecordSchemaInputValue<
  SCHEMA extends RecordSchema,
  OPTIONS extends WriteValueOptions = {}
> = RecordSchema extends SCHEMA
  ? undefined | SchemaExtendedWriteValue<SCHEMA, OPTIONS> | Record<string, unknown>
  :
      | If<MustBeProvided<SCHEMA, OPTIONS>, never, undefined>
      | SchemaExtendedWriteValue<SCHEMA, OPTIONS>
      | Optional<
          Record<
            ResolveStringSchema<SCHEMA['keys']>,
            AttrInputValue<SCHEMA['elements'], Overwrite<OPTIONS, { defined: false }>>
          >,
          | (SCHEMA['props'] extends { partial: true } ? string : never)
          | (OPTIONS extends { mode: 'update' } ? string : never)
        >

type AnyOfSchemaInputValue<
  SCHEMA extends AnyOfSchema,
  OPTIONS extends WriteValueOptions = {}
> = AnyOfSchema extends SCHEMA
  ? unknown
  :
      | If<MustBeProvided<SCHEMA, OPTIONS>, never, undefined>
      | SchemaExtendedWriteValue<SCHEMA, OPTIONS>
      | AttrInputValue<SCHEMA['elements'][number], OPTIONS>
