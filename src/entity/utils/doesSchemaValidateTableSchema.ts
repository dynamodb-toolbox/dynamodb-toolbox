import type { Schema } from '~/schema/index.js'
import type { Table } from '~/table/index.js'
import type { Key } from '~/table/types/index.js'

export const doesSchemaValidateTableSchemaKey = (schema: Schema, key?: Key): boolean => {
  if (key === undefined) return true

  const keyAttribute =
    schema.attributes[key.name] ??
    Object.values(schema.attributes).find(attribute => attribute.savedAs === key.name)

  return (
    keyAttribute !== undefined &&
    keyAttribute.key &&
    keyAttribute.type === key.type &&
    (keyAttribute.required === 'always' || keyAttribute.defaults.key !== undefined)
  )
}

export const doesSchemaValidateTableSchema = (schema: Schema, table: Table): boolean => {
  const { partitionKey, sortKey } = table

  return (
    doesSchemaValidateTableSchemaKey(schema, partitionKey) &&
    doesSchemaValidateTableSchemaKey(schema, sortKey)
  )
}
