import type { Schema } from 'v1/schema'

import { WithRootAttribute, addRootAttribute } from '../addRootAttribute'

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
  IS_MODIFIED_ENABLED extends boolean = IsTimestampEnabled<TIMESTAMP_OPTIONS, 'modified'>,
  MODIFIED_NAME extends string = TimestampOptionValue<TIMESTAMP_OPTIONS, 'modified', 'name'>,
  MODIFIED_SAVED_AS extends string = TimestampOptionValue<TIMESTAMP_OPTIONS, 'modified', 'savedAs'>
> = string extends ENTITY_NAME
  ? SCHEMA
  : IS_CREATED_ENABLED extends true
  ? IS_MODIFIED_ENABLED extends true
    ? WithRootAttribute<
        WithRootAttribute<SCHEMA, CREATED_NAME, TimestampAttribute<CREATED_SAVED_AS>>,
        MODIFIED_NAME,
        TimestampAttribute<MODIFIED_SAVED_AS>
      >
    : WithRootAttribute<SCHEMA, CREATED_NAME, TimestampAttribute<CREATED_SAVED_AS>>
  : IS_MODIFIED_ENABLED extends true
  ? WithRootAttribute<SCHEMA, MODIFIED_NAME, TimestampAttribute<MODIFIED_SAVED_AS>>
  : SCHEMA

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
    const createdSavedAs = getTimestampOptionValue(timestamps, 'created', 'savedAs')

    const createdAttribute: TimestampAttribute<
      TimestampOptionValue<TIMESTAMP_OPTIONS, 'created', 'savedAs'>
    > = {
      path: createdName,
      type: 'string',
      required: 'atLeastOnce',
      hidden: false,
      key: false,
      savedAs: createdSavedAs,
      enum: undefined,
      default: () => new Date().toISOString()
    }

    schemaWithTimestamps = addRootAttribute(schemaWithTimestamps, createdName, createdAttribute)
  }

  const isModifiedEnable = isTimestampEnabled(timestamps, 'modified')
  if (isModifiedEnable) {
    const modifiedName = getTimestampOptionValue(timestamps, 'modified', 'name')
    const modifiedSavedAs = getTimestampOptionValue(timestamps, 'modified', 'savedAs')

    const modifiedAttribute: TimestampAttribute<
      TimestampOptionValue<TIMESTAMP_OPTIONS, 'modified', 'savedAs'>
    > = {
      path: modifiedName,
      type: 'string',
      required: 'atLeastOnce',
      hidden: false,
      key: false,
      savedAs: modifiedSavedAs,
      enum: undefined,
      default: () => new Date().toISOString()
    }

    schemaWithTimestamps = addRootAttribute(schemaWithTimestamps, modifiedName, modifiedAttribute)
  }

  return schemaWithTimestamps as WithTimestampAttributes<SCHEMA, ENTITY_NAME, TIMESTAMP_OPTIONS>
}
