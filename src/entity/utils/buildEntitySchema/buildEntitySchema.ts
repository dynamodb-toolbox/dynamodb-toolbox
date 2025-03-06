import { $get } from '~/entity/actions/update/symbols/get.js'
import { DynamoDBToolboxError } from '~/errors/index.js'
import type { Schema } from '~/schema/index.js'
import { ItemSchema } from '~/schema/item/schema.js'
import { StringSchema } from '~/schema/string/schema.js'
import type { Table } from '~/table/index.js'

import type { EntityAttributes, SchemaOf } from '../entityAttributes.js'
import type { EntityAttrOptions, TimestampsOptions } from './options.js'
import type {
  BuildEntitySchema,
  EntityAttribute,
  EntitySchemaBuilder,
  TimestampAttribute
} from './types.js'
import type { TimestampOptionValue } from './utils.js'
import {
  getEntityAttrOptionValue,
  getTimestampOptionValue,
  isEntityAttrEnabled,
  isTimestampEnabled
} from './utils.js'

export const buildEntitySchema: EntitySchemaBuilder = <
  ATTRIBUTES extends EntityAttributes,
  TABLE extends Table,
  ENTITY_NAME extends string,
  ENTITY_ATTR_OPTIONS extends EntityAttrOptions,
  TIMESTAMP_OPTIONS extends TimestampsOptions
>({
  schema,
  table,
  entityName,
  entityAttribute,
  timestamps
}: {
  schema: SchemaOf<ATTRIBUTES>
  table: TABLE
  entityAttribute: ENTITY_ATTR_OPTIONS
  entityName: ENTITY_NAME
  timestamps: TIMESTAMP_OPTIONS
}) => {
  const internalAttributes: Record<string, Schema> = {}

  if (isEntityAttrEnabled(entityAttribute)) {
    const entityAttrName = getEntityAttrOptionValue(entityAttribute, 'name')
    const entityAttr: EntityAttribute<TABLE, ENTITY_NAME, ENTITY_ATTR_OPTIONS> = new StringSchema({
      hidden: getEntityAttrOptionValue(entityAttribute, 'hidden'),
      enum: [entityName] as [ENTITY_NAME],
      putDefault: entityName,
      updateDefault: () => $get(entityAttrName, entityName),
      savedAs: table.entityAttributeSavedAs
    })

    internalAttributes[entityAttrName] = entityAttr
  }

  if (isTimestampEnabled(timestamps, 'created')) {
    const createdName = getTimestampOptionValue(timestamps, 'created', 'name')

    const createdAttribute: TimestampAttribute<
      TimestampOptionValue<TIMESTAMP_OPTIONS, 'created', 'savedAs'>,
      TimestampOptionValue<TIMESTAMP_OPTIONS, 'created', 'hidden'>
    > = new StringSchema({
      hidden: getTimestampOptionValue(timestamps, 'created', 'hidden'),
      savedAs: getTimestampOptionValue(timestamps, 'created', 'savedAs'),
      putDefault: () => new Date().toISOString(),
      updateDefault: () => $get(createdName, new Date().toISOString())
    })

    internalAttributes[createdName] = createdAttribute
  }

  if (isTimestampEnabled(timestamps, 'modified')) {
    const modifiedName = getTimestampOptionValue(timestamps, 'modified', 'name')

    const modifiedAttribute: TimestampAttribute<
      TimestampOptionValue<TIMESTAMP_OPTIONS, 'modified', 'savedAs'>,
      TimestampOptionValue<TIMESTAMP_OPTIONS, 'modified', 'hidden'>
    > = new StringSchema({
      hidden: getTimestampOptionValue(timestamps, 'modified', 'hidden'),
      savedAs: getTimestampOptionValue(timestamps, 'modified', 'savedAs'),
      putDefault: () => new Date().toISOString(),
      updateDefault: () => new Date().toISOString()
    })

    internalAttributes[modifiedName] = modifiedAttribute
  }

  for (const [attributeName, attribute] of Object.entries(internalAttributes)) {
    if (attributeName in schema.attributes) {
      throw new DynamoDBToolboxError('entity.reservedAttributeName', {
        message: `'${attributeName}' is a reserved attribute name.`,
        path: attributeName
      })
    }

    const { savedAs: attributeSavedAs } = attribute.props
    if (attributeSavedAs !== undefined && schema.savedAttributeNames.has(attributeSavedAs)) {
      throw new DynamoDBToolboxError('entity.reservedAttributeSavedAs', {
        message: `'${attributeSavedAs}' is a reserved attribute alias (savedAs).`,
        path: attributeName
      })
    }
  }

  return new ItemSchema({ ...schema.attributes, ...internalAttributes }) as BuildEntitySchema<
    ATTRIBUTES,
    TABLE,
    ENTITY_NAME,
    ENTITY_ATTR_OPTIONS,
    TIMESTAMP_OPTIONS
  >
}
