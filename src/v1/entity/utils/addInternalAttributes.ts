import type { Item } from 'v1/item'
import type { TableV2 } from 'v1/table'

import { WithEntityNameAttribute, addEntityNameAttribute } from './addEntityNameAttribute'
import { addTimestampAttributes, WithTimestampAttributes } from './addTimestampsAttributes'

export type WithInternalAttributes<
  ITEM extends Item,
  TABLE extends TableV2,
  ENTITY_NAME_ATTRIBUTE_NAME extends string,
  ENTITY_NAME extends string,
  TIMESTAMPS extends boolean
> = string extends ENTITY_NAME
  ? ITEM
  : TIMESTAMPS extends true
  ? WithTimestampAttributes<
      WithEntityNameAttribute<ITEM, TABLE, ENTITY_NAME_ATTRIBUTE_NAME, ENTITY_NAME>,
      ENTITY_NAME
    >
  : WithEntityNameAttribute<ITEM, TABLE, ENTITY_NAME_ATTRIBUTE_NAME, ENTITY_NAME>

type InternalAttributesAdder = <
  ITEM extends Item,
  TABLE extends TableV2,
  ENTITY_NAME_ATTRIBUTE_NAME extends string,
  ENTITY_NAME extends string,
  TIMESTAMPS extends boolean
>({
  item,
  table,
  entityNameAttributeName,
  entityName
}: {
  item: ITEM
  table: TABLE
  entityNameAttributeName: ENTITY_NAME_ATTRIBUTE_NAME
  entityName: ENTITY_NAME
  timestamps: TIMESTAMPS
}) => WithInternalAttributes<ITEM, TABLE, ENTITY_NAME_ATTRIBUTE_NAME, ENTITY_NAME, TIMESTAMPS>

export const addInternalAttributes: InternalAttributesAdder = <
  ITEM extends Item,
  TABLE extends TableV2,
  ENTITY_NAME_ATTRIBUTE_NAME extends string,
  ENTITY_NAME extends string,
  TIMESTAMPS extends boolean
>({
  item,
  table,
  entityNameAttributeName,
  entityName,
  timestamps
}: {
  item: ITEM
  table: TABLE
  entityNameAttributeName: ENTITY_NAME_ATTRIBUTE_NAME
  entityName: ENTITY_NAME
  timestamps: TIMESTAMPS
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
      TIMESTAMPS
    >
  }

  const withTimestampAttributes = addTimestampAttributes({
    item: withEntityNameAttribute,
    entityName
  })

  return withTimestampAttributes as WithInternalAttributes<
    ITEM,
    TABLE,
    ENTITY_NAME_ATTRIBUTE_NAME,
    ENTITY_NAME,
    TIMESTAMPS
  >
}
