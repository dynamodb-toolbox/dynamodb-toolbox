import type { Schema } from 'v1/schema'
import type { TableV2 } from 'v1/table'
import type { EntityAttributeSavedAs } from 'v1/table/types'
import type { AtLeastOnce, $Attribute, $PrimitiveAttribute } from 'v1/schema/attributes'
import type { FreezeAttribute } from 'v1/schema/attributes/freeze'
import type { If } from 'v1/types/if'

import type { TimestampsOptions } from './options'
import type { IsTimestampEnabled, TimestampOptionValue } from './utils'

export type WithInternalAttribute<
  SCHEMA extends Schema,
  ATTRIBUTE_NAME extends string,
  $ATTRIBUTE extends $Attribute
> = Schema<
  {
    [KEY in keyof SCHEMA['attributes'] | ATTRIBUTE_NAME]: KEY extends ATTRIBUTE_NAME
      ? FreezeAttribute<$ATTRIBUTE>
      : KEY extends keyof SCHEMA['attributes']
      ? SCHEMA['attributes'][KEY]
      : never
  }
>

export type $EntityAttribute<
  TABLE extends TableV2,
  ENTITY_NAME extends string
> = $PrimitiveAttribute<
  'string',
  {
    required: AtLeastOnce
    hidden: true
    key: false
    savedAs: EntityAttributeSavedAs<TABLE>
    enum: [ENTITY_NAME]
    defaults: {
      key: undefined
      put: unknown
      update: unknown
    }
    links: {
      key: undefined
      put: undefined
      update: undefined
    }
    transform: undefined
  }
>

export type WithEntityAttribute<
  SCHEMA extends Schema,
  TABLE extends TableV2,
  ENTITY_ATTRIBUTE_NAME extends string,
  ENTITY_NAME extends string
> = string extends ENTITY_NAME
  ? SCHEMA
  : WithInternalAttribute<SCHEMA, ENTITY_ATTRIBUTE_NAME, $EntityAttribute<TABLE, ENTITY_NAME>>

export type $TimestampAttribute<
  SAVED_AS extends string,
  HIDDEN extends boolean
> = $PrimitiveAttribute<
  'string',
  {
    required: AtLeastOnce
    hidden: HIDDEN
    key: false
    savedAs: SAVED_AS
    enum: undefined
    defaults: {
      key: undefined
      put: unknown
      update: unknown
    }
    links: {
      key: undefined
      put: undefined
      update: undefined
    }
    transform: undefined
  }
>

export type WithTimestampAttributes<
  SCHEMA extends Schema,
  ENTITY_NAME extends string,
  TIMESTAMP_OPTIONS extends TimestampsOptions,
  IS_CREATED_ENABLED extends boolean = IsTimestampEnabled<TIMESTAMP_OPTIONS, 'created'>,
  CREATED_NAME extends string = TimestampOptionValue<TIMESTAMP_OPTIONS, 'created', 'name'>,
  CREATED_SAVED_AS extends string = TimestampOptionValue<TIMESTAMP_OPTIONS, 'created', 'savedAs'>,
  CREATED_HIDDEN extends boolean = TimestampOptionValue<TIMESTAMP_OPTIONS, 'created', 'hidden'>,
  IS_MODIFIED_ENABLED extends boolean = IsTimestampEnabled<TIMESTAMP_OPTIONS, 'modified'>,
  MODIFIED_NAME extends string = TimestampOptionValue<TIMESTAMP_OPTIONS, 'modified', 'name'>,
  MODIFIED_SAVED_AS extends string = TimestampOptionValue<TIMESTAMP_OPTIONS, 'modified', 'savedAs'>,
  MODIFIED_HIDDEN extends boolean = TimestampOptionValue<TIMESTAMP_OPTIONS, 'modified', 'hidden'>
> = string extends ENTITY_NAME
  ? SCHEMA
  : If<
      IS_CREATED_ENABLED,
      If<
        IS_MODIFIED_ENABLED,
        WithInternalAttribute<
          WithInternalAttribute<
            SCHEMA,
            CREATED_NAME,
            $TimestampAttribute<CREATED_SAVED_AS, CREATED_HIDDEN>
          >,
          MODIFIED_NAME,
          $TimestampAttribute<MODIFIED_SAVED_AS, MODIFIED_HIDDEN>
        >,
        WithInternalAttribute<
          SCHEMA,
          CREATED_NAME,
          $TimestampAttribute<CREATED_SAVED_AS, CREATED_HIDDEN>
        >
      >,
      If<
        IS_MODIFIED_ENABLED,
        WithInternalAttribute<
          SCHEMA,
          MODIFIED_NAME,
          $TimestampAttribute<MODIFIED_SAVED_AS, MODIFIED_HIDDEN>
        >,
        SCHEMA
      >
    >

export type WithInternalAttributes<
  SCHEMA extends Schema,
  TABLE extends TableV2,
  ENTITY_ATTRIBUTE_NAME extends string,
  ENTITY_NAME extends string,
  TIMESTAMP_OPTIONS extends TimestampsOptions
> = string extends ENTITY_NAME
  ? SCHEMA
  : TIMESTAMP_OPTIONS extends false
  ? WithEntityAttribute<SCHEMA, TABLE, ENTITY_ATTRIBUTE_NAME, ENTITY_NAME>
  : WithTimestampAttributes<
      WithEntityAttribute<SCHEMA, TABLE, ENTITY_ATTRIBUTE_NAME, ENTITY_NAME>,
      ENTITY_NAME,
      TIMESTAMP_OPTIONS
    >

export type InternalAttributesAdder = <
  SCHEMA extends Schema,
  TABLE extends TableV2,
  ENTITY_ATTRIBUTE_NAME extends string,
  ENTITY_NAME extends string,
  TIMESTAMP_OPTIONS extends TimestampsOptions
>({
  schema,
  table,
  entityAttributeName,
  entityName
}: {
  schema: SCHEMA
  table: TABLE
  entityAttributeName: ENTITY_ATTRIBUTE_NAME
  entityName: ENTITY_NAME
  timestamps: TIMESTAMP_OPTIONS
}) => WithInternalAttributes<SCHEMA, TABLE, ENTITY_ATTRIBUTE_NAME, ENTITY_NAME, TIMESTAMP_OPTIONS>
