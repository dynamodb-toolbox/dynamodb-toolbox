import type { AttrSchema } from '~/attributes/index.js'
import type { Schema } from '~/schema/index.js'
import type { Table } from '~/table/index.js'
import type { Key } from '~/table/types/index.js'

export const doesSchemaValidateTableSchemaKey = (schema: Schema, key?: Key): boolean => {
  if (key === undefined) return true

  const keyAttributeEntry = [...schema.keyAttributeNames.values()]
    .map(attributeName => [attributeName, schema.attributes[attributeName]] as [string, AttrSchema])
    .find(
      ([attributeName, { props }]) =>
        props.savedAs === key.name || (props.savedAs === undefined && attributeName === key.name)
    )

  if (keyAttributeEntry === undefined) {
    return false
  }

  const [, keyAttribute] = keyAttributeEntry

  return (
    keyAttribute !== undefined &&
    keyAttribute.type === key.type &&
    keyAttribute.props.key === true &&
    (keyAttribute.props.required === 'always' || keyAttribute.props.keyDefault !== undefined)
  )
}

export const doesSchemaValidateTableSchema = (schema: Schema, table: Table): boolean => {
  const { partitionKey, sortKey } = table

  return (
    doesSchemaValidateTableSchemaKey(schema, partitionKey) &&
    doesSchemaValidateTableSchemaKey(schema, sortKey)
  )
}
