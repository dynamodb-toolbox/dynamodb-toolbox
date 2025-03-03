import type { ItemSchema, Schema, StringSchema } from '~/schema/index.js'
import type { Table } from '~/table/index.js'
import type { ComputeObject } from '~/types/computeObject.js'
import type { If } from '~/types/if.js'

import type { EntityAttributes, SchemaOf } from '../entityAttributes.js'
import type { EntityAttrOptions, TimestampsOptions } from './options.js'
import type { EntityAttrOptionValue, IsTimestampEnabled, TimestampOptionValue } from './utils.js'

export type WithInternalAttribute<
  ATTRIBUTES extends EntityAttributes,
  ATTRIBUTE_NAME extends string,
  ATTRIBUTE_SCHEMA extends Schema
> = ComputeObject<{
  [KEY in keyof ATTRIBUTES | ATTRIBUTE_NAME]: KEY extends ATTRIBUTE_NAME
    ? ATTRIBUTE_SCHEMA
    : KEY extends keyof ATTRIBUTES
      ? ATTRIBUTES[KEY]
      : never
}>

export type $EntityAttribute<
  TABLE extends Table,
  ENTITY_NAME extends string,
  ENTITY_ATTR_OPTIONS extends EntityAttrOptions
> = StringSchema<{
  hidden: EntityAttrOptionValue<ENTITY_ATTR_OPTIONS, 'hidden'>
  savedAs: TABLE['entityAttributeSavedAs']
  enum: [ENTITY_NAME]
  putDefault: unknown
  updateDefault: unknown
}>

export type WithEntityAttribute<
  ATTRIBUTES extends EntityAttributes,
  TABLE extends Table,
  ENTITY_NAME extends string,
  ENTITY_ATTR_OPTIONS extends EntityAttrOptions
> = string extends ENTITY_NAME
  ? EntityAttributes
  : WithInternalAttribute<
      ATTRIBUTES,
      EntityAttrOptionValue<ENTITY_ATTR_OPTIONS, 'name'>,
      $EntityAttribute<TABLE, ENTITY_NAME, ENTITY_ATTR_OPTIONS>
    >

export type $TimestampAttribute<SAVED_AS extends string, HIDDEN extends boolean> = StringSchema<{
  hidden: HIDDEN
  savedAs: SAVED_AS
  putDefault: unknown
  updateDefault: unknown
}>

export type WithTimestampAttributes<
  ATTRIBUTES extends EntityAttributes,
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
  ? EntityAttributes
  : If<
      IS_CREATED_ENABLED,
      If<
        IS_MODIFIED_ENABLED,
        WithInternalAttribute<
          WithInternalAttribute<
            ATTRIBUTES,
            CREATED_NAME,
            $TimestampAttribute<CREATED_SAVED_AS, CREATED_HIDDEN>
          >,
          MODIFIED_NAME,
          $TimestampAttribute<MODIFIED_SAVED_AS, MODIFIED_HIDDEN>
        >,
        WithInternalAttribute<
          ATTRIBUTES,
          CREATED_NAME,
          $TimestampAttribute<CREATED_SAVED_AS, CREATED_HIDDEN>
        >
      >,
      If<
        IS_MODIFIED_ENABLED,
        WithInternalAttribute<
          ATTRIBUTES,
          MODIFIED_NAME,
          $TimestampAttribute<MODIFIED_SAVED_AS, MODIFIED_HIDDEN>
        >,
        ATTRIBUTES
      >
    >

export type BuildEntitySchema<
  ATTRIBUTES extends EntityAttributes,
  TABLE extends Table,
  ENTITY_NAME extends string,
  ENTITY_ATTR_OPTIONS extends EntityAttrOptions,
  TIMESTAMP_OPTIONS extends TimestampsOptions
> = string extends ENTITY_NAME
  ? ItemSchema
  : TIMESTAMP_OPTIONS extends false
    ? ENTITY_ATTR_OPTIONS extends false
      ? ItemSchema<ATTRIBUTES>
      : ItemSchema<WithEntityAttribute<ATTRIBUTES, TABLE, ENTITY_NAME, ENTITY_ATTR_OPTIONS>>
    : ENTITY_ATTR_OPTIONS extends false
      ? ItemSchema<WithTimestampAttributes<ATTRIBUTES, ENTITY_NAME, TIMESTAMP_OPTIONS>>
      : ItemSchema<
          WithTimestampAttributes<
            WithEntityAttribute<ATTRIBUTES, TABLE, ENTITY_NAME, ENTITY_ATTR_OPTIONS>,
            ENTITY_NAME,
            TIMESTAMP_OPTIONS
          >
        >

export type EntitySchemaBuilder = <
  ATTRIBUTES extends EntityAttributes,
  TABLE extends Table,
  ENTITY_NAME extends string,
  ENTITY_ATTR_OPTIONS extends EntityAttrOptions,
  TIMESTAMP_OPTIONS extends TimestampsOptions
>(args: {
  schema: SchemaOf<ATTRIBUTES>
  table: TABLE
  entityName: ENTITY_NAME
  entityAttribute: ENTITY_ATTR_OPTIONS
  timestamps: TIMESTAMP_OPTIONS
}) => BuildEntitySchema<ATTRIBUTES, TABLE, ENTITY_NAME, ENTITY_ATTR_OPTIONS, TIMESTAMP_OPTIONS>
