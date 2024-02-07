import type { Schema } from 'v1/schema'
import type { If } from 'v1/types/if'
import { string } from 'v1/schema/attributes/primitive'
import { $get } from 'v1/operations/updateItem/utils'

import { WithInternalAttribute, addInternalAttribute } from '../addInternalAttribute'

import type { TimestampsOptions } from './timestampOptions'
import type { TimestampAttribute } from './timestampAttribute'
import {
  IsTimestampEnabled,
  isTimestampEnabled,
  TimestampOptionValue,
  getTimestampOptionValue
} from './utils'

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
            TimestampAttribute<CREATED_SAVED_AS, CREATED_HIDDEN>
          >,
          MODIFIED_NAME,
          TimestampAttribute<MODIFIED_SAVED_AS, MODIFIED_HIDDEN>
        >,
        WithInternalAttribute<
          SCHEMA,
          CREATED_NAME,
          TimestampAttribute<CREATED_SAVED_AS, CREATED_HIDDEN>
        >
      >,
      If<
        IS_MODIFIED_ENABLED,
        WithInternalAttribute<
          SCHEMA,
          MODIFIED_NAME,
          TimestampAttribute<MODIFIED_SAVED_AS, MODIFIED_HIDDEN>
        >,
        SCHEMA
      >
    >

type TimestampAttributesAdder = <
  SCHEMA extends Schema,
  ENTITY_NAME extends string,
  TIMESTAMP_OPTIONS extends TimestampsOptions
>(props: {
  schema: SCHEMA
  entityName: ENTITY_NAME
  timestamps: TIMESTAMP_OPTIONS
}) => WithTimestampAttributes<SCHEMA, ENTITY_NAME, TIMESTAMP_OPTIONS>

export const addTimestampAttributes: TimestampAttributesAdder = <
  SCHEMA extends Schema,
  ENTITY_NAME extends string,
  TIMESTAMP_OPTIONS extends TimestampsOptions
>({
  schema,
  timestamps: $timestamps
}: {
  schema: SCHEMA
  entityName: ENTITY_NAME
  timestamps: TIMESTAMP_OPTIONS
}) => {
  let schemaWithTimestamps: Schema = schema

  const timestamps = $timestamps as TIMESTAMP_OPTIONS

  const isCreatedEnable = isTimestampEnabled(timestamps, 'created')
  if (isCreatedEnable) {
    const createdName = getTimestampOptionValue(timestamps, 'created', 'name')

    const createdAttribute = string({
      hidden: getTimestampOptionValue(timestamps, 'created', 'hidden'),
      savedAs: getTimestampOptionValue(timestamps, 'created', 'savedAs'),
      defaults: {
        put: () => new Date().toISOString(),
        update: () => $get(createdName, new Date().toISOString()),
        key: undefined
      }
    }).freeze(createdName)

    schemaWithTimestamps = addInternalAttribute(schemaWithTimestamps, createdName, createdAttribute)
  }

  const isModifiedEnable = isTimestampEnabled(timestamps, 'modified')
  if (isModifiedEnable) {
    const modifiedName = getTimestampOptionValue(timestamps, 'modified', 'name')

    const modifiedAttribute = string({
      hidden: getTimestampOptionValue(timestamps, 'modified', 'hidden'),
      savedAs: getTimestampOptionValue(timestamps, 'modified', 'savedAs'),
      defaults: {
        put: () => new Date().toISOString(),
        update: () => new Date().toISOString(),
        key: undefined
      }
    }).freeze(modifiedName)

    schemaWithTimestamps = addInternalAttribute(
      schemaWithTimestamps,
      modifiedName,
      modifiedAttribute
    )
  }

  return schemaWithTimestamps as WithTimestampAttributes<SCHEMA, ENTITY_NAME, TIMESTAMP_OPTIONS>
}
