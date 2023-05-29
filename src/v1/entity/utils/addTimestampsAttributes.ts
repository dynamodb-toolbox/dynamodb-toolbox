import type { Schema, AtLeastOnce, PrimitiveAttribute } from 'v1/schema'

import { WithRootAttribute, addRootAttribute } from './addRootAttribute'

export type TimestampAttribute<SAVED_AS extends string> = PrimitiveAttribute<
  'string',
  {
    required: AtLeastOnce
    hidden: false
    key: false
    savedAs: SAVED_AS
    enum: undefined
    default: () => string
  }
>

export type WithTimestampAttributes<
  SCHEMA extends Schema,
  ENTITY_NAME extends string,
  CREATED_TIMESTAMP_ATTRIBUTE_NAME extends string,
  CREATED_TIMESTAMP_ATTRIBUTE_SAVED_AS extends string,
  MODIFIED_TIMESTAMP_ATTRIBUTE_NAME extends string,
  MODIFIED_TIMESTAMP_ATTRIBUTE_SAVED_AS extends string
> = string extends ENTITY_NAME
  ? SCHEMA
  : WithRootAttribute<
      WithRootAttribute<
        SCHEMA,
        CREATED_TIMESTAMP_ATTRIBUTE_NAME,
        TimestampAttribute<CREATED_TIMESTAMP_ATTRIBUTE_SAVED_AS>
      >,
      MODIFIED_TIMESTAMP_ATTRIBUTE_NAME,
      TimestampAttribute<MODIFIED_TIMESTAMP_ATTRIBUTE_SAVED_AS>
    >

type TimestampAttributesAdder = <
  SCHEMA extends Schema,
  ENTITY_NAME extends string,
  CREATED_TIMESTAMP_ATTRIBUTE_NAME extends string,
  CREATED_TIMESTAMP_ATTRIBUTE_SAVED_AS extends string,
  MODIFIED_TIMESTAMP_ATTRIBUTE_NAME extends string,
  MODIFIED_TIMESTAMP_ATTRIBUTE_SAVED_AS extends string
>(props: {
  schema: SCHEMA
  entityName: ENTITY_NAME
  createdTimestampAttributeName: CREATED_TIMESTAMP_ATTRIBUTE_NAME
  createdTimestampAttributeSavedAs: CREATED_TIMESTAMP_ATTRIBUTE_SAVED_AS
  modifiedTimestampAttributeName: MODIFIED_TIMESTAMP_ATTRIBUTE_NAME
  modifiedTimestampAttributeSavedAs: MODIFIED_TIMESTAMP_ATTRIBUTE_SAVED_AS
}) => WithTimestampAttributes<
  SCHEMA,
  ENTITY_NAME,
  CREATED_TIMESTAMP_ATTRIBUTE_NAME,
  CREATED_TIMESTAMP_ATTRIBUTE_SAVED_AS,
  MODIFIED_TIMESTAMP_ATTRIBUTE_NAME,
  MODIFIED_TIMESTAMP_ATTRIBUTE_SAVED_AS
>

export const addTimestampAttributes: TimestampAttributesAdder = <
  SCHEMA extends Schema,
  ENTITY_NAME extends string,
  CREATED_TIMESTAMP_ATTRIBUTE_NAME extends string,
  CREATED_TIMESTAMP_ATTRIBUTE_SAVED_AS extends string,
  MODIFIED_TIMESTAMP_ATTRIBUTE_NAME extends string,
  MODIFIED_TIMESTAMP_ATTRIBUTE_SAVED_AS extends string
>({
  schema,
  createdTimestampAttributeName,
  createdTimestampAttributeSavedAs,
  modifiedTimestampAttributeName,
  modifiedTimestampAttributeSavedAs
}: {
  schema: SCHEMA
  entityName: ENTITY_NAME
  createdTimestampAttributeName: CREATED_TIMESTAMP_ATTRIBUTE_NAME
  createdTimestampAttributeSavedAs: CREATED_TIMESTAMP_ATTRIBUTE_SAVED_AS
  modifiedTimestampAttributeName: MODIFIED_TIMESTAMP_ATTRIBUTE_NAME
  modifiedTimestampAttributeSavedAs: MODIFIED_TIMESTAMP_ATTRIBUTE_SAVED_AS
}) => {
  const createdAttribute: TimestampAttribute<CREATED_TIMESTAMP_ATTRIBUTE_SAVED_AS> = {
    path: createdTimestampAttributeName,
    type: 'string',
    required: 'atLeastOnce',
    hidden: false,
    key: false,
    savedAs: createdTimestampAttributeSavedAs,
    enum: undefined,
    default: () => new Date().toISOString()
  }

  const withCreatedAttribute = addRootAttribute(
    schema,
    createdTimestampAttributeName,
    createdAttribute
  )

  const lastModifiedAttribute: TimestampAttribute<MODIFIED_TIMESTAMP_ATTRIBUTE_SAVED_AS> = {
    path: modifiedTimestampAttributeName,
    type: 'string',
    required: 'atLeastOnce',
    hidden: false,
    key: false,
    savedAs: modifiedTimestampAttributeSavedAs,
    enum: undefined,
    default: () => new Date().toISOString()
  }

  const withTimestampAttributes = addRootAttribute(
    withCreatedAttribute,
    modifiedTimestampAttributeName,
    lastModifiedAttribute
  )

  return withTimestampAttributes as WithTimestampAttributes<
    SCHEMA,
    ENTITY_NAME,
    CREATED_TIMESTAMP_ATTRIBUTE_NAME,
    CREATED_TIMESTAMP_ATTRIBUTE_SAVED_AS,
    MODIFIED_TIMESTAMP_ATTRIBUTE_NAME,
    MODIFIED_TIMESTAMP_ATTRIBUTE_SAVED_AS
  >
}
