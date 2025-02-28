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
  ResolveStringSchema,
  ResolvedPrimitiveSchema,
  SetSchema
} from '~/attributes/index.js'
import type { Extends, If, Not, Optional, Overwrite, SelectKeys } from '~/types/index.js'

import type { AttrExtendedWriteValue, WriteValueOptions } from './options.js'

export type InputValue<
  SCHEMA extends AttrSchema,
  OPTIONS extends WriteValueOptions = {}
> = SCHEMA extends ItemSchema
  ? ItemSchemaInputValue<SCHEMA, OPTIONS>
  : SCHEMA extends AttrSchema
    ? AttrInputValue<SCHEMA, OPTIONS>
    : never

type MustBeProvided<ATTRIBUTE extends AttrSchema, OPTIONS extends WriteValueOptions = {}> = If<
  Extends<OPTIONS, { defined: true }>,
  true,
  If<
    Extends<OPTIONS, { mode: 'update' | 'key' }>,
    If<
      Not<Extends<ATTRIBUTE['props'], { required: Always }>>,
      false,
      If<
        Extends<ATTRIBUTE['props'], { key: true }>,
        Not<Extends<ATTRIBUTE['props'], { keyDefault: unknown } | { keyLink: unknown }>>,
        Not<Extends<ATTRIBUTE['props'], { updateDefault: unknown } | { updateLink: unknown }>>
      >
    >,
    If<
      Extends<ATTRIBUTE['props'], { required: Never }>,
      false,
      If<
        Extends<ATTRIBUTE['props'], { key: true }>,
        Not<Extends<ATTRIBUTE['props'], { keyDefault: unknown } | { keyLink: unknown }>>,
        Not<Extends<ATTRIBUTE['props'], { putDefault: unknown } | { putLink: unknown }>>
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
  ? { [KEY: string]: AttrInputValue<AttrSchema, Overwrite<OPTIONS, { defined: false }>> }
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
  ATTRIBUTE extends AttrSchema,
  OPTIONS extends WriteValueOptions = {}
> = AttrSchema extends ATTRIBUTE
  ? unknown
  :
      | (ATTRIBUTE extends AnySchema ? AnySchemaInputValue<ATTRIBUTE, OPTIONS> : never)
      | (ATTRIBUTE extends PrimitiveSchema ? PrimitiveSchemaInputValue<ATTRIBUTE, OPTIONS> : never)
      | (ATTRIBUTE extends SetSchema ? SetSchemaInputValue<ATTRIBUTE, OPTIONS> : never)
      | (ATTRIBUTE extends ListSchema ? ListSchemaInputValue<ATTRIBUTE, OPTIONS> : never)
      | (ATTRIBUTE extends MapSchema ? MapSchemaInputValue<ATTRIBUTE, OPTIONS> : never)
      | (ATTRIBUTE extends RecordSchema ? RecordSchemaInputValue<ATTRIBUTE, OPTIONS> : never)
      | (ATTRIBUTE extends AnyOfSchema ? AnyOfSchemaInputValue<ATTRIBUTE, OPTIONS> : never)

type AnySchemaInputValue<
  ATTRIBUTE extends AnySchema,
  OPTIONS extends WriteValueOptions = {}
> = AnySchema extends ATTRIBUTE
  ? unknown
  :
      | If<MustBeProvided<ATTRIBUTE, OPTIONS>, never, undefined>
      | AttrExtendedWriteValue<ATTRIBUTE, OPTIONS>
      | ResolveAnySchema<ATTRIBUTE>

type PrimitiveSchemaInputValue<
  ATTRIBUTE extends PrimitiveSchema,
  OPTIONS extends WriteValueOptions = {}
> = PrimitiveSchema extends ATTRIBUTE
  ? undefined | ResolvedPrimitiveSchema | AttrExtendedWriteValue<ATTRIBUTE, OPTIONS>
  :
      | If<MustBeProvided<ATTRIBUTE, OPTIONS>, never, undefined>
      | AttrExtendedWriteValue<ATTRIBUTE, OPTIONS>
      | ResolvePrimitiveSchema<ATTRIBUTE>

type SetSchemaInputValue<
  ATTRIBUTE extends SetSchema,
  OPTIONS extends WriteValueOptions = {}
> = SetSchema extends ATTRIBUTE
  ?
      | undefined
      | AttrExtendedWriteValue<ATTRIBUTE, OPTIONS>
      | Set<
          AttrInputValue<SetSchema['elements'], Overwrite<OPTIONS, { mode: 'put'; defined: false }>>
        >
  :
      | If<MustBeProvided<ATTRIBUTE, OPTIONS>, never, undefined>
      | AttrExtendedWriteValue<ATTRIBUTE, OPTIONS>
      | Set<
          AttrInputValue<ATTRIBUTE['elements'], Overwrite<OPTIONS, { mode: 'put'; defined: false }>>
        >

type ListSchemaInputValue<
  ATTRIBUTE extends ListSchema,
  OPTIONS extends WriteValueOptions = {}
> = ListSchema extends ATTRIBUTE
  ? undefined | AttrExtendedWriteValue<ATTRIBUTE, OPTIONS> | unknown[]
  :
      | If<MustBeProvided<ATTRIBUTE, OPTIONS>, never, undefined>
      | AttrExtendedWriteValue<ATTRIBUTE, OPTIONS>
      | AttrInputValue<ATTRIBUTE['elements'], Overwrite<OPTIONS, { defined: false }>>[]

type MapSchemaInputValue<
  ATTRIBUTE extends MapSchema,
  OPTIONS extends WriteValueOptions = {}
> = MapSchema extends ATTRIBUTE
  ? undefined | AttrExtendedWriteValue<ATTRIBUTE, OPTIONS> | { [KEY: string]: unknown }
  :
      | If<MustBeProvided<ATTRIBUTE, OPTIONS>, never, undefined>
      | AttrExtendedWriteValue<ATTRIBUTE, OPTIONS>
      | Optional<
          {
            [KEY in OPTIONS extends { mode: 'key' }
              ? SelectKeys<ATTRIBUTE['attributes'], { props: { key: true } }>
              : keyof ATTRIBUTE['attributes']]: AttrInputValue<
              ATTRIBUTE['attributes'][KEY],
              Overwrite<OPTIONS, { defined: false }>
            >
          },
          OptionalKeys<ATTRIBUTE, Overwrite<OPTIONS, { defined: false }>>
        >

type RecordSchemaInputValue<
  ATTRIBUTE extends RecordSchema,
  OPTIONS extends WriteValueOptions = {}
> = RecordSchema extends ATTRIBUTE
  ? undefined | AttrExtendedWriteValue<ATTRIBUTE, OPTIONS> | { [KEY: string]: unknown }
  :
      | If<MustBeProvided<ATTRIBUTE, OPTIONS>, never, undefined>
      | AttrExtendedWriteValue<ATTRIBUTE, OPTIONS>
      | {
          [KEY in ResolveStringSchema<ATTRIBUTE['keys']>]?: AttrInputValue<
            ATTRIBUTE['elements'],
            Overwrite<OPTIONS, { defined: false }>
          >
        }

type AnyOfSchemaInputValue<
  ATTRIBUTE extends AnyOfSchema,
  OPTIONS extends WriteValueOptions = {}
> = AnyOfSchema extends ATTRIBUTE
  ? unknown
  :
      | If<MustBeProvided<ATTRIBUTE, OPTIONS>, never, undefined>
      | AttrExtendedWriteValue<ATTRIBUTE, OPTIONS>
      | AttrInputValue<ATTRIBUTE['elements'][number], OPTIONS>
