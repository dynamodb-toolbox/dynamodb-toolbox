import { $get } from '~/entity/actions/commands/updateItem/utils.js'
import { DynamoDBToolboxError } from '~/errors/index.js'
import { $state } from '~/schema/attributes/constants/attributeOptions.js'
import type { $Attribute } from '~/schema/attributes/index.js'
import { string } from '~/schema/attributes/primitive/index.js'
import type { Schema } from '~/schema/index.js'
import type { TableV2 } from '~/table/index.js'

import type { TimestampsOptions } from './options.js'
import type {
  $EntityAttribute,
  $TimestampAttribute,
  InternalAttributesAdder,
  WithInternalAttributes
} from './types.js'
import { TimestampOptionValue, getTimestampOptionValue, isTimestampEnabled } from './utils.js'

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
  const internalAttributes: Record<string, $Attribute> = {}

  const entityAttribute: $EntityAttribute<TABLE, ENTITY_NAME> = string({
    required: 'atLeastOnce',
    hidden: true,
    defaults: {
      key: undefined,
      put: entityName,
      update: () => $get(entityAttributeName, entityName)
    }
  })
    .enum(entityName as ENTITY_NAME)
    /**
     * @debt type "when provided in options, savedAs is inferred as potentially undefined"
     */
    .savedAs(table.entityAttributeSavedAs)

  internalAttributes[entityAttributeName] = entityAttribute

  if (isTimestampEnabled(timestamps, 'created')) {
    const createdName = getTimestampOptionValue(timestamps, 'created', 'name')

    const createdAttribute: $TimestampAttribute<
      TimestampOptionValue<TIMESTAMP_OPTIONS, 'created', 'savedAs'>,
      TimestampOptionValue<TIMESTAMP_OPTIONS, 'created', 'hidden'>
    > = string({
      required: 'atLeastOnce',
      defaults: {
        key: undefined,
        put: () => new Date().toISOString(),
        update: () => $get(createdName, new Date().toISOString())
      }
    })
      /**
       * @debt type "when provided in options, 'hidden' is not correctly inferred"
       */
      .hidden(getTimestampOptionValue(timestamps, 'created', 'hidden'))
      /**
       * @debt type "when provided in options, 'savedAs' is inferred as potentially undefined"
       */
      .savedAs(getTimestampOptionValue(timestamps, 'created', 'savedAs'))

    internalAttributes[createdName] = createdAttribute
  }

  if (isTimestampEnabled(timestamps, 'modified')) {
    const modifiedName = getTimestampOptionValue(timestamps, 'modified', 'name')

    const modifiedAttribute: $TimestampAttribute<
      TimestampOptionValue<TIMESTAMP_OPTIONS, 'modified', 'savedAs'>,
      TimestampOptionValue<TIMESTAMP_OPTIONS, 'modified', 'hidden'>
    > = string({
      required: 'atLeastOnce',
      defaults: {
        key: undefined,
        put: () => new Date().toISOString(),
        update: () => new Date().toISOString()
      }
    })
      /**
       * @debt type "when provided in options, 'hidden' is not correctly inferred"
       */
      .hidden(getTimestampOptionValue(timestamps, 'modified', 'hidden'))
      /**
       * @debt type "when provided in options, 'savedAs' is inferred as potentially undefined"
       */
      .savedAs(getTimestampOptionValue(timestamps, 'modified', 'savedAs'))

    internalAttributes[modifiedName] = modifiedAttribute
  }

  for (const [attributeName, attribute] of Object.entries(internalAttributes)) {
    if (attributeName in schema.attributes) {
      throw new DynamoDBToolboxError('entity.reservedAttributeName', {
        message: `'${attributeName}' is a reserved attribute name.`,
        path: attributeName
      })
    }

    const { savedAs: attributeSavedAs } = attribute[$state]
    if (attributeSavedAs !== undefined && schema.savedAttributeNames.has(attributeSavedAs)) {
      throw new DynamoDBToolboxError('entity.reservedAttributeSavedAs', {
        message: `'${attribute.savedAs}' is a reserved attribute alias (savedAs).`,
        path: attributeName
      })
    }
  }

  return schema.and(internalAttributes) as WithInternalAttributes<
    SCHEMA,
    TABLE,
    ENTITY_ATTRIBUTE_NAME,
    ENTITY_NAME,
    TIMESTAMP_OPTIONS
  >
}
