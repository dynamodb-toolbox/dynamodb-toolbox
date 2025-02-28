import type {
  Always,
  AnyOfSchema,
  AnySchema,
  AttrSchema,
  ItemSchema,
  ListSchema,
  MapSchema,
  Never,
  PrimitiveSchema,
  RecordSchema,
  ResolveAnySchema,
  ResolvePrimitiveSchema,
  ResolvedPrimitiveSchema,
  SetSchema
} from '~/attributes/index.js'
import type { Extends, If, Not, Optional, Overwrite, SelectKeys } from '~/types/index.js'

import type { SchemaExtendedWriteValue, WriteValueOptions } from './options.js'

export type ValidValue<
  SCHEMA extends AttrSchema,
  OPTIONS extends WriteValueOptions = {}
> = SCHEMA extends ItemSchema
  ? ItemSchemaValidValue<SCHEMA, OPTIONS>
  : SCHEMA extends AttrSchema
    ? AttrValidValue<SCHEMA, OPTIONS>
    : never

type MustBeDefined<SCHEMA extends AttrSchema, OPTIONS extends WriteValueOptions> = If<
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
    KEY
  >
}[keyof SCHEMA['attributes']]

type ItemSchemaValidValue<
  SCHEMA extends ItemSchema,
  OPTIONS extends WriteValueOptions
> = ItemSchema extends SCHEMA
  ? { [KEY: string]: unknown }
  : Optional<
      {
        [KEY in OPTIONS extends { mode: 'key' }
          ? SelectKeys<SCHEMA['attributes'], { props: { key: true } }>
          : keyof SCHEMA['attributes']]: AttrValidValue<
          SCHEMA['attributes'][KEY],
          Overwrite<OPTIONS, { defined: false }>
        >
      },
      OptionalKeys<SCHEMA, Overwrite<OPTIONS, { defined: false }>>
    >

type AttrValidValue<
  SCHEMA extends AttrSchema,
  OPTIONS extends WriteValueOptions = {}
> = AttrSchema extends SCHEMA
  ? unknown
  :
      | (SCHEMA extends AnySchema ? AnySchemaValidValue<SCHEMA, OPTIONS> : never)
      | (SCHEMA extends PrimitiveSchema ? PrimitiveSchemaValidValue<SCHEMA, OPTIONS> : never)
      | (SCHEMA extends SetSchema ? SetSchemaValidValue<SCHEMA, OPTIONS> : never)
      | (SCHEMA extends ListSchema ? ListSchemaValidValue<SCHEMA, OPTIONS> : never)
      | (SCHEMA extends MapSchema ? MapSchemaValidValue<SCHEMA, OPTIONS> : never)
      | (SCHEMA extends RecordSchema ? RecordSchemaValidValue<SCHEMA, OPTIONS> : never)
      | (SCHEMA extends AnyOfSchema ? AnyOfSchemaValidValue<SCHEMA, OPTIONS> : never)

type AnySchemaValidValue<
  SCHEMA extends AnySchema,
  OPTIONS extends WriteValueOptions = {}
> = AnySchema extends SCHEMA
  ? unknown
  :
      | If<MustBeDefined<SCHEMA, OPTIONS>, never, undefined>
      | SchemaExtendedWriteValue<SCHEMA, OPTIONS>
      | ResolveAnySchema<SCHEMA>

type PrimitiveSchemaValidValue<
  SCHEMA extends PrimitiveSchema,
  OPTIONS extends WriteValueOptions = {}
> = PrimitiveSchema extends SCHEMA
  ? undefined | SchemaExtendedWriteValue<SCHEMA, OPTIONS> | ResolvedPrimitiveSchema
  :
      | If<MustBeDefined<SCHEMA, OPTIONS>, never, undefined>
      | SchemaExtendedWriteValue<SCHEMA, OPTIONS>
      | ResolvePrimitiveSchema<SCHEMA>

type SetSchemaValidValue<
  SCHEMA extends SetSchema,
  OPTIONS extends WriteValueOptions = {}
> = SetSchema extends SCHEMA
  ?
      | undefined
      | SchemaExtendedWriteValue<SCHEMA, OPTIONS>
      | Set<
          AttrValidValue<SetSchema['elements'], Overwrite<OPTIONS, { mode: 'put'; defined: false }>>
        >
  :
      | If<MustBeDefined<SCHEMA, OPTIONS>, never, undefined>
      | SchemaExtendedWriteValue<SCHEMA, OPTIONS>
      | Set<AttrValidValue<SCHEMA['elements'], Overwrite<OPTIONS, { mode: 'put'; defined: false }>>>

type ListSchemaValidValue<
  SCHEMA extends ListSchema,
  OPTIONS extends WriteValueOptions = {}
> = ListSchema extends SCHEMA
  ? undefined | SchemaExtendedWriteValue<SCHEMA, OPTIONS> | unknown[]
  :
      | If<MustBeDefined<SCHEMA, OPTIONS>, never, undefined>
      | SchemaExtendedWriteValue<SCHEMA, OPTIONS>
      | AttrValidValue<SCHEMA['elements'], Overwrite<OPTIONS, { defined: false }>>[]

type MapSchemaValidValue<
  SCHEMA extends MapSchema,
  OPTIONS extends WriteValueOptions = {}
> = MapSchema extends SCHEMA
  ? undefined | SchemaExtendedWriteValue<SCHEMA, OPTIONS> | { [KEY: string]: unknown }
  :
      | If<MustBeDefined<SCHEMA, OPTIONS>, never, undefined>
      | SchemaExtendedWriteValue<SCHEMA, OPTIONS>
      | Optional<
          {
            [KEY in OPTIONS extends { mode: 'key' }
              ? SelectKeys<SCHEMA['attributes'], { props: { key: true } }>
              : keyof SCHEMA['attributes']]: AttrValidValue<
              SCHEMA['attributes'][KEY],
              Overwrite<OPTIONS, { defined: false }>
            >
          },
          OptionalKeys<SCHEMA, Overwrite<OPTIONS, { defined: false }>>
        >

type RecordSchemaValidValue<
  SCHEMA extends RecordSchema,
  OPTIONS extends WriteValueOptions = {},
  KEYS extends string = Extract<AttrValidValue<SCHEMA['keys'], OPTIONS>, string>
> = RecordSchema extends SCHEMA
  ? undefined | SchemaExtendedWriteValue<SCHEMA, OPTIONS> | { [KEY: string]: unknown }
  :
      | If<MustBeDefined<SCHEMA, OPTIONS>, never, undefined>
      | SchemaExtendedWriteValue<SCHEMA, OPTIONS>
      // We cannot use Record type as it messes up map resolution down the line
      | {
          [KEY in KEYS]?: AttrValidValue<SCHEMA['elements'], Overwrite<OPTIONS, { defined: false }>>
        }

type AnyOfSchemaValidValue<
  SCHEMA extends AnyOfSchema,
  OPTIONS extends WriteValueOptions = {}
> = AnyOfSchema extends SCHEMA
  ? unknown
  :
      | If<MustBeDefined<SCHEMA, OPTIONS>, never, undefined>
      | SchemaExtendedWriteValue<SCHEMA, OPTIONS>
      | MapAnyOfSchemaValidValue<SCHEMA['elements'], OPTIONS>

type MapAnyOfSchemaValidValue<
  ELEMENTS extends AttrSchema[],
  OPTIONS extends WriteValueOptions = {},
  RESULTS = never
> = ELEMENTS extends [infer ELEMENTS_HEAD, ...infer ELEMENTS_TAIL]
  ? ELEMENTS_HEAD extends AttrSchema
    ? ELEMENTS_TAIL extends AttrSchema[]
      ? MapAnyOfSchemaValidValue<
          ELEMENTS_TAIL,
          OPTIONS,
          RESULTS | AttrValidValue<ELEMENTS_HEAD, OPTIONS>
        >
      : never
    : never
  : [RESULTS] extends [never]
    ? unknown
    : RESULTS
