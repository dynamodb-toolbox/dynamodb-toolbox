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

import type { AttrExtendedWriteValue, WriteValueOptions } from './options.js'

export type ValidValue<
  SCHEMA extends AttrSchema,
  OPTIONS extends WriteValueOptions = {}
> = SCHEMA extends ItemSchema
  ? ItemSchemaValidValue<SCHEMA, OPTIONS>
  : SCHEMA extends AttrSchema
    ? AttrValidValue<SCHEMA, OPTIONS>
    : never

type MustBeDefined<ATTRIBUTE extends AttrSchema, OPTIONS extends WriteValueOptions> = If<
  Extends<OPTIONS, { defined: true }>,
  true,
  If<
    Extends<OPTIONS, { mode: 'update' | 'key' }>,
    Extends<ATTRIBUTE['props'], { required: Always }>,
    Not<Extends<ATTRIBUTE['props'], { required: Never }>>
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
  ATTRIBUTE extends AttrSchema,
  OPTIONS extends WriteValueOptions = {}
> = AttrSchema extends ATTRIBUTE
  ? unknown
  :
      | (ATTRIBUTE extends AnySchema ? AnySchemaValidValue<ATTRIBUTE, OPTIONS> : never)
      | (ATTRIBUTE extends PrimitiveSchema ? PrimitiveSchemaValidValue<ATTRIBUTE, OPTIONS> : never)
      | (ATTRIBUTE extends SetSchema ? SetSchemaValidValue<ATTRIBUTE, OPTIONS> : never)
      | (ATTRIBUTE extends ListSchema ? ListSchemaValidValue<ATTRIBUTE, OPTIONS> : never)
      | (ATTRIBUTE extends MapSchema ? MapSchemaValidValue<ATTRIBUTE, OPTIONS> : never)
      | (ATTRIBUTE extends RecordSchema ? RecordSchemaValidValue<ATTRIBUTE, OPTIONS> : never)
      | (ATTRIBUTE extends AnyOfSchema ? AnyOfSchemaValidValue<ATTRIBUTE, OPTIONS> : never)

type AnySchemaValidValue<
  ATTRIBUTE extends AnySchema,
  OPTIONS extends WriteValueOptions = {}
> = AnySchema extends ATTRIBUTE
  ? unknown
  :
      | If<MustBeDefined<ATTRIBUTE, OPTIONS>, never, undefined>
      | AttrExtendedWriteValue<ATTRIBUTE, OPTIONS>
      | ResolveAnySchema<ATTRIBUTE>

type PrimitiveSchemaValidValue<
  ATTRIBUTE extends PrimitiveSchema,
  OPTIONS extends WriteValueOptions = {}
> = PrimitiveSchema extends ATTRIBUTE
  ? undefined | AttrExtendedWriteValue<ATTRIBUTE, OPTIONS> | ResolvedPrimitiveSchema
  :
      | If<MustBeDefined<ATTRIBUTE, OPTIONS>, never, undefined>
      | AttrExtendedWriteValue<ATTRIBUTE, OPTIONS>
      | ResolvePrimitiveSchema<ATTRIBUTE>

type SetSchemaValidValue<
  ATTRIBUTE extends SetSchema,
  OPTIONS extends WriteValueOptions = {}
> = SetSchema extends ATTRIBUTE
  ?
      | undefined
      | AttrExtendedWriteValue<ATTRIBUTE, OPTIONS>
      | Set<
          AttrValidValue<SetSchema['elements'], Overwrite<OPTIONS, { mode: 'put'; defined: false }>>
        >
  :
      | If<MustBeDefined<ATTRIBUTE, OPTIONS>, never, undefined>
      | AttrExtendedWriteValue<ATTRIBUTE, OPTIONS>
      | Set<
          AttrValidValue<ATTRIBUTE['elements'], Overwrite<OPTIONS, { mode: 'put'; defined: false }>>
        >

type ListSchemaValidValue<
  ATTRIBUTE extends ListSchema,
  OPTIONS extends WriteValueOptions = {}
> = ListSchema extends ATTRIBUTE
  ? undefined | AttrExtendedWriteValue<ATTRIBUTE, OPTIONS> | unknown[]
  :
      | If<MustBeDefined<ATTRIBUTE, OPTIONS>, never, undefined>
      | AttrExtendedWriteValue<ATTRIBUTE, OPTIONS>
      | AttrValidValue<ATTRIBUTE['elements'], Overwrite<OPTIONS, { defined: false }>>[]

type MapSchemaValidValue<
  ATTRIBUTE extends MapSchema,
  OPTIONS extends WriteValueOptions = {}
> = MapSchema extends ATTRIBUTE
  ? undefined | AttrExtendedWriteValue<ATTRIBUTE, OPTIONS> | { [KEY: string]: unknown }
  :
      | If<MustBeDefined<ATTRIBUTE, OPTIONS>, never, undefined>
      | AttrExtendedWriteValue<ATTRIBUTE, OPTIONS>
      | Optional<
          {
            [KEY in OPTIONS extends { mode: 'key' }
              ? SelectKeys<ATTRIBUTE['attributes'], { props: { key: true } }>
              : keyof ATTRIBUTE['attributes']]: AttrValidValue<
              ATTRIBUTE['attributes'][KEY],
              Overwrite<OPTIONS, { defined: false }>
            >
          },
          OptionalKeys<ATTRIBUTE, Overwrite<OPTIONS, { defined: false }>>
        >

type RecordSchemaValidValue<
  ATTRIBUTE extends RecordSchema,
  OPTIONS extends WriteValueOptions = {},
  KEYS extends string = Extract<AttrValidValue<ATTRIBUTE['keys'], OPTIONS>, string>
> = RecordSchema extends ATTRIBUTE
  ? undefined | AttrExtendedWriteValue<ATTRIBUTE, OPTIONS> | { [KEY: string]: unknown }
  :
      | If<MustBeDefined<ATTRIBUTE, OPTIONS>, never, undefined>
      | AttrExtendedWriteValue<ATTRIBUTE, OPTIONS>
      // We cannot use Record type as it messes up map resolution down the line
      | {
          [KEY in KEYS]?: AttrValidValue<
            ATTRIBUTE['elements'],
            Overwrite<OPTIONS, { defined: false }>
          >
        }

type AnyOfSchemaValidValue<
  ATTRIBUTE extends AnyOfSchema,
  OPTIONS extends WriteValueOptions = {}
> = AnyOfSchema extends ATTRIBUTE
  ? unknown
  :
      | If<MustBeDefined<ATTRIBUTE, OPTIONS>, never, undefined>
      | AttrExtendedWriteValue<ATTRIBUTE, OPTIONS>
      | MapAnyOfSchemaValidValue<ATTRIBUTE['elements'], OPTIONS>

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
