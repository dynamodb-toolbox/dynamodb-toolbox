import type { TableV2 } from 'v1/table/class'
import type { Key } from 'v1/table/types'
import type { Schema } from 'v1/schema/schema'

const doesSchemaValidateTableSchemaKey = (schema: Schema, key?: Key): boolean => {
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

export const doesSchemaValidateTableSchema = (schema: Schema, table: TableV2): boolean => {
  const { partitionKey, sortKey } = table

  return (
    doesSchemaValidateTableSchemaKey(schema, partitionKey) &&
    doesSchemaValidateTableSchemaKey(schema, sortKey)
  )
}
