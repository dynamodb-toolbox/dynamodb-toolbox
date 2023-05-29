import type { Schema, AtLeastOnce, PrimitiveAttribute } from 'v1/schema'
import type { EntityNameAttributeSavedAs, TableV2 } from 'v1/table'
import { DynamoDBToolboxError } from 'v1/errors'

import { WithRootAttribute, addRootAttribute } from './addRootAttribute'

export type EntityNameAttribute<
  TABLE extends TableV2,
  ENTITY_NAME extends string
> = PrimitiveAttribute<
  'string',
  {
    required: AtLeastOnce
    hidden: true
    key: false
    savedAs: EntityNameAttributeSavedAs<TABLE>
    enum: [ENTITY_NAME]
    default: ENTITY_NAME
  }
>

export type WithEntityNameAttribute<
  SCHEMA extends Schema,
  TABLE extends TableV2,
  ENTITY_NAME_ATTRIBUTE_NAME extends string,
  ENTITY_NAME extends string
> = string extends ENTITY_NAME
  ? SCHEMA
  : WithRootAttribute<SCHEMA, ENTITY_NAME_ATTRIBUTE_NAME, EntityNameAttribute<TABLE, ENTITY_NAME>>

type EntityNameAttributeAdder = <
  SCHEMA extends Schema,
  TABLE extends TableV2,
  ENTITY_NAME_ATTRIBUTE_NAME extends string,
  ENTITY_NAME extends string
>(props: {
  schema: SCHEMA
  table: TABLE
  entityNameAttributeName: ENTITY_NAME_ATTRIBUTE_NAME
  entityName: ENTITY_NAME
}) => WithEntityNameAttribute<SCHEMA, TABLE, ENTITY_NAME_ATTRIBUTE_NAME, ENTITY_NAME>

export const addEntityNameAttribute: EntityNameAttributeAdder = <
  SCHEMA extends Schema,
  TABLE extends TableV2,
  ENTITY_NAME_ATTRIBUTE_NAME extends string,
  ENTITY_NAME extends string
>({
  schema,
  table,
  entityNameAttributeName,
  entityName
}: {
  schema: SCHEMA
  table: TABLE
  entityNameAttributeName: ENTITY_NAME_ATTRIBUTE_NAME
  entityName: ENTITY_NAME
}) => {
  if (entityNameAttributeName in schema.attributes) {
    throw new DynamoDBToolboxError('entity.reservedAttributeName', {
      message: `${entityNameAttributeName} is a reserved attribute name. Use a different attribute name or set a different entityNameAttributeName option in your Entity constructor.`,
      path: entityNameAttributeName
    })
  }

  const entityNameAttribute: EntityNameAttribute<TABLE, ENTITY_NAME> = {
    path: entityNameAttributeName,
    type: 'string',
    required: 'atLeastOnce',
    hidden: true,
    key: false,
    savedAs: table.entityNameAttributeSavedAs,
    enum: [entityName],
    default: entityName
  }

  return addRootAttribute(
    schema,
    entityNameAttributeName,
    entityNameAttribute
  ) as WithEntityNameAttribute<SCHEMA, TABLE, ENTITY_NAME_ATTRIBUTE_NAME, ENTITY_NAME>
}
