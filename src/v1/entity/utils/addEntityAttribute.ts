import type { Schema, AtLeastOnce } from 'v1/schema'
import type { EntityAttributeSavedAs, TableV2 } from 'v1/table'
import { PrimitiveAttribute } from 'v1/schema/attributes/primitive'
import { DynamoDBToolboxError } from 'v1/errors'
import { $get } from 'v1/operations/updateItem/utils'

import { WithInternalAttribute, addInternalAttribute } from './addInternalAttribute'

export type EntityAttribute<TABLE extends TableV2, ENTITY_NAME extends string> = PrimitiveAttribute<
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
  : WithInternalAttribute<SCHEMA, ENTITY_ATTRIBUTE_NAME, EntityAttribute<TABLE, ENTITY_NAME>>

type EntityAttributeAdder = <
  SCHEMA extends Schema,
  TABLE extends TableV2,
  ENTITY_ATTRIBUTE_NAME extends string,
  ENTITY_NAME extends string
>(props: {
  schema: SCHEMA
  table: TABLE
  entityAttributeName: ENTITY_ATTRIBUTE_NAME
  entityName: ENTITY_NAME
}) => WithEntityAttribute<SCHEMA, TABLE, ENTITY_ATTRIBUTE_NAME, ENTITY_NAME>

export const addEntityAttribute: EntityAttributeAdder = <
  SCHEMA extends Schema,
  TABLE extends TableV2,
  ENTITY_ATTRIBUTE_NAME extends string,
  ENTITY_NAME extends string
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
}) => {
  if (entityAttributeName in schema.attributes) {
    throw new DynamoDBToolboxError('entity.reservedAttributeName', {
      message: `${entityAttributeName} is a reserved attribute name. Use a different attribute name or set a different entityAttributeName option in your Entity constructor.`,
      path: entityAttributeName
    })
  }

  const entityAttribute: EntityAttribute<TABLE, ENTITY_NAME> = new PrimitiveAttribute({
    path: entityAttributeName,
    type: 'string',
    required: 'atLeastOnce',
    hidden: true,
    key: false,
    savedAs: table.entityAttributeSavedAs,
    enum: [entityName],
    defaults: {
      key: undefined,
      put: entityName,
      update: () => $get(entityAttributeName, entityName)
    },
    links: {
      key: undefined,
      put: undefined,
      update: undefined
    },
    transform: undefined
  })

  return addInternalAttribute(schema, entityAttributeName, entityAttribute) as WithEntityAttribute<
    SCHEMA,
    TABLE,
    ENTITY_ATTRIBUTE_NAME,
    ENTITY_NAME
  >
}
