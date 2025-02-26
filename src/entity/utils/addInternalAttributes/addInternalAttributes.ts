import type { AttrSchema } from '~/attributes/index.js'
import { string } from '~/attributes/string/index.js'
import { $get } from '~/entity/actions/update/symbols/get.js'
import { DynamoDBToolboxError } from '~/errors/index.js'
import type { Schema } from '~/schema/index.js'
import type { Table } from '~/table/index.js'

import type { TimestampsOptions } from './options.js'
import type {
  $EntityAttribute,
  $TimestampAttribute,
  InternalAttributesAdder,
  WithInternalAttributes
} from './types.js'
import type { TimestampOptionValue } from './utils.js'
import { getTimestampOptionValue, isTimestampEnabled } from './utils.js'

export const addInternalAttributes: InternalAttributesAdder = <
  SCHEMA extends Schema,
  TABLE extends Table,
  ENTITY_ATTRIBUTE_NAME extends string,
  ENTITY_ATTRIBUTE_HIDDEN extends boolean,
  ENTITY_NAME extends string,
  TIMESTAMP_OPTIONS extends TimestampsOptions
>({
  schema,
  table,
  entityAttributeName,
  entityAttributeHidden,
  entityName,
  timestamps
}: {
  schema: SCHEMA
  table: TABLE
  entityAttributeName: ENTITY_ATTRIBUTE_NAME
  entityAttributeHidden: ENTITY_ATTRIBUTE_HIDDEN
  entityName: ENTITY_NAME
  timestamps: TIMESTAMP_OPTIONS
}) => {
  const internalAttributes: Record<string, AttrSchema> = {}

  const entityAttribute: $EntityAttribute<TABLE, ENTITY_NAME, ENTITY_ATTRIBUTE_HIDDEN> = string({
    hidden: entityAttributeHidden,
    enum: [entityName] as [ENTITY_NAME],
    putDefault: entityName,
    updateDefault: () => $get(entityAttributeName, entityName),
    savedAs: table.entityAttributeSavedAs
  })

  internalAttributes[entityAttributeName] = entityAttribute

  if (isTimestampEnabled(timestamps, 'created')) {
    const createdName = getTimestampOptionValue(timestamps, 'created', 'name')

    const createdAttribute: $TimestampAttribute<
      TimestampOptionValue<TIMESTAMP_OPTIONS, 'created', 'savedAs'>,
      TimestampOptionValue<TIMESTAMP_OPTIONS, 'created', 'hidden'>
    > = string({
      hidden: getTimestampOptionValue(timestamps, 'created', 'hidden'),
      savedAs: getTimestampOptionValue(timestamps, 'created', 'savedAs'),
      putDefault: () => new Date().toISOString(),
      updateDefault: () => $get(createdName, new Date().toISOString())
    })

    internalAttributes[createdName] = createdAttribute
  }

  if (isTimestampEnabled(timestamps, 'modified')) {
    const modifiedName = getTimestampOptionValue(timestamps, 'modified', 'name')

    const modifiedAttribute: $TimestampAttribute<
      TimestampOptionValue<TIMESTAMP_OPTIONS, 'modified', 'savedAs'>,
      TimestampOptionValue<TIMESTAMP_OPTIONS, 'modified', 'hidden'>
    > = string({
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

    const { savedAs: attributeSavedAs } = attribute.state
    if (attributeSavedAs !== undefined && schema.savedAttributeNames.has(attributeSavedAs)) {
      throw new DynamoDBToolboxError('entity.reservedAttributeSavedAs', {
        message: `'${attributeSavedAs}' is a reserved attribute alias (savedAs).`,
        path: attributeName
      })
    }
  }

  return schema.and(internalAttributes) as WithInternalAttributes<
    SCHEMA,
    TABLE,
    ENTITY_ATTRIBUTE_NAME,
    ENTITY_ATTRIBUTE_HIDDEN,
    ENTITY_NAME,
    TIMESTAMP_OPTIONS
  >
}
