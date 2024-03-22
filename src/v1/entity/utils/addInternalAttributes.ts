import type { Schema } from 'v1/schema/schema'
import type { TableV2 } from 'v1/table'

import { WithEntityAttribute, addEntityAttribute } from './addEntityAttribute'
import {
  WithTimestampAttributes,
  addTimestampAttributes,
  TimestampsOptions
} from './addTimestampAttributes'

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

type InternalAttributesAdder = <
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

export const addInternalAttributes: InternalAttributesAdder = <
  SCHEMA extends Schema,
  TABLE extends TableV2,
  ENTITY_ATTRIBUTE_NAME extends string,
  ENTITY_NAME extends string,
  TIMESTAMP_OPTIONS extends TimestampsOptions
>({
  schema,
  table,
  entityAttributeName,
  entityName,
  timestamps
}: {
  schema: SCHEMA
  table: TABLE
  entityAttributeName: ENTITY_ATTRIBUTE_NAME
  entityName: ENTITY_NAME
  timestamps: TIMESTAMP_OPTIONS
}) => {
  const withEntityAttribute = addEntityAttribute({
    schema,
    table,
    entityAttributeName,
    entityName
  })

  if (timestamps === false) {
    return withEntityAttribute as WithInternalAttributes<
      SCHEMA,
      TABLE,
      ENTITY_ATTRIBUTE_NAME,
      ENTITY_NAME,
      TIMESTAMP_OPTIONS
    >
  }

  const withTimestampAttributes = addTimestampAttributes({
    schema: withEntityAttribute,
    entityName,
    timestamps
  })

  return withTimestampAttributes as WithInternalAttributes<
    SCHEMA,
    TABLE,
    ENTITY_ATTRIBUTE_NAME,
    ENTITY_NAME,
    TIMESTAMP_OPTIONS
  >
}
