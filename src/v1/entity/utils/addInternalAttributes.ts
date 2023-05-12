import type { Item } from 'v1/item'
import type { TableV2 } from 'v1/table'

import { WithEntityNameAttribute, addEntityNameAttribute } from './addEntityNameAttribute'
import { addTimestampAttributes, WithTimestampAttributes } from './addTimestampsAttributes'

export type WithInternalAttributes<
  ITEM extends Item,
  TABLE extends TableV2,
  ENTITY_NAME_ATTRIBUTE_NAME extends string,
  ENTITY_NAME extends string,
  TIMESTAMPS extends boolean,
  CREATED_TIMESTAMP_ATTRIBUTE_NAME extends string,
  CREATED_TIMESTAMP_ATTRIBUTE_SAVED_AS extends string,
  MODIFIED_TIMESTAMP_ATTRIBUTE_NAME extends string,
  MODIFIED_TIMESTAMP_ATTRIBUTE_SAVED_AS extends string
> = string extends ENTITY_NAME
  ? ITEM
  : TIMESTAMPS extends true
  ? WithTimestampAttributes<
      WithEntityNameAttribute<ITEM, TABLE, ENTITY_NAME_ATTRIBUTE_NAME, ENTITY_NAME>,
      ENTITY_NAME,
      CREATED_TIMESTAMP_ATTRIBUTE_NAME,
      CREATED_TIMESTAMP_ATTRIBUTE_SAVED_AS,
      MODIFIED_TIMESTAMP_ATTRIBUTE_NAME,
      MODIFIED_TIMESTAMP_ATTRIBUTE_SAVED_AS
    >
  : WithEntityNameAttribute<ITEM, TABLE, ENTITY_NAME_ATTRIBUTE_NAME, ENTITY_NAME>

type InternalAttributesAdder = <
  ITEM extends Item,
  TABLE extends TableV2,
  ENTITY_NAME_ATTRIBUTE_NAME extends string,
  ENTITY_NAME extends string,
  TIMESTAMPS extends boolean,
  CREATED_TIMESTAMP_ATTRIBUTE_NAME extends string,
  CREATED_TIMESTAMP_ATTRIBUTE_SAVED_AS extends string,
  MODIFIED_TIMESTAMP_ATTRIBUTE_NAME extends string,
  MODIFIED_TIMESTAMP_ATTRIBUTE_SAVED_AS extends string
>({
  item,
  table,
  entityNameAttributeName,
  entityName,
  createdTimestampAttributeName,
  createdTimestampAttributeSavedAs,
  modifiedTimestampAttributeName,
  modifiedTimestampAttributeSavedAs
}: {
  item: ITEM
  table: TABLE
  entityNameAttributeName: ENTITY_NAME_ATTRIBUTE_NAME
  entityName: ENTITY_NAME
  timestamps: TIMESTAMPS
  createdTimestampAttributeName: CREATED_TIMESTAMP_ATTRIBUTE_NAME
  createdTimestampAttributeSavedAs: CREATED_TIMESTAMP_ATTRIBUTE_SAVED_AS
  modifiedTimestampAttributeName: MODIFIED_TIMESTAMP_ATTRIBUTE_NAME
  modifiedTimestampAttributeSavedAs: MODIFIED_TIMESTAMP_ATTRIBUTE_SAVED_AS
}) => WithInternalAttributes<
  ITEM,
  TABLE,
  ENTITY_NAME_ATTRIBUTE_NAME,
  ENTITY_NAME,
  TIMESTAMPS,
  CREATED_TIMESTAMP_ATTRIBUTE_NAME,
  CREATED_TIMESTAMP_ATTRIBUTE_SAVED_AS,
  MODIFIED_TIMESTAMP_ATTRIBUTE_NAME,
  MODIFIED_TIMESTAMP_ATTRIBUTE_SAVED_AS
>

export const addInternalAttributes: InternalAttributesAdder = <
  ITEM extends Item,
  TABLE extends TableV2,
  ENTITY_NAME_ATTRIBUTE_NAME extends string,
  ENTITY_NAME extends string,
  TIMESTAMPS extends boolean,
  CREATED_TIMESTAMP_ATTRIBUTE_NAME extends string,
  CREATED_TIMESTAMP_ATTRIBUTE_SAVED_AS extends string,
  MODIFIED_TIMESTAMP_ATTRIBUTE_NAME extends string,
  MODIFIED_TIMESTAMP_ATTRIBUTE_SAVED_AS extends string
>({
  item,
  table,
  entityNameAttributeName,
  entityName,
  timestamps,
  createdTimestampAttributeName,
  createdTimestampAttributeSavedAs,
  modifiedTimestampAttributeName,
  modifiedTimestampAttributeSavedAs
}: {
  item: ITEM
  table: TABLE
  entityNameAttributeName: ENTITY_NAME_ATTRIBUTE_NAME
  entityName: ENTITY_NAME
  timestamps: TIMESTAMPS
  createdTimestampAttributeName: CREATED_TIMESTAMP_ATTRIBUTE_NAME
  createdTimestampAttributeSavedAs: CREATED_TIMESTAMP_ATTRIBUTE_SAVED_AS
  modifiedTimestampAttributeName: MODIFIED_TIMESTAMP_ATTRIBUTE_NAME
  modifiedTimestampAttributeSavedAs: MODIFIED_TIMESTAMP_ATTRIBUTE_SAVED_AS
}) => {
  const withEntityNameAttribute = addEntityNameAttribute({
    item,
    table,
    entityNameAttributeName,
    entityName
  })

  if (timestamps === false) {
    return withEntityNameAttribute as WithInternalAttributes<
      ITEM,
      TABLE,
      ENTITY_NAME_ATTRIBUTE_NAME,
      ENTITY_NAME,
      TIMESTAMPS,
      CREATED_TIMESTAMP_ATTRIBUTE_NAME,
      CREATED_TIMESTAMP_ATTRIBUTE_SAVED_AS,
      MODIFIED_TIMESTAMP_ATTRIBUTE_NAME,
      MODIFIED_TIMESTAMP_ATTRIBUTE_SAVED_AS
    >
  }

  const withTimestampAttributes = addTimestampAttributes({
    item: withEntityNameAttribute,
    entityName,
    createdTimestampAttributeName,
    createdTimestampAttributeSavedAs,
    modifiedTimestampAttributeName,
    modifiedTimestampAttributeSavedAs
  })

  return withTimestampAttributes as WithInternalAttributes<
    ITEM,
    TABLE,
    ENTITY_NAME_ATTRIBUTE_NAME,
    ENTITY_NAME,
    TIMESTAMPS,
    CREATED_TIMESTAMP_ATTRIBUTE_NAME,
    CREATED_TIMESTAMP_ATTRIBUTE_SAVED_AS,
    MODIFIED_TIMESTAMP_ATTRIBUTE_NAME,
    MODIFIED_TIMESTAMP_ATTRIBUTE_SAVED_AS
  >
}
