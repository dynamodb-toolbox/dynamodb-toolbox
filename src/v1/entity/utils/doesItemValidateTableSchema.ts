import type { TableV2, Key } from 'v1/table'
import type { Item } from 'v1/item'

const doesItemValidateTableSchemaKey = (item: Item, key?: Key): boolean => {
  if (key === undefined) return true

  const keyAttribute =
    item.attributes[key.name] ??
    Object.values(item.attributes).find(attribute => attribute.savedAs === key.name)

  return (
    keyAttribute !== undefined &&
    keyAttribute.key &&
    keyAttribute.type === key.type &&
    (keyAttribute.required === 'always' || keyAttribute.default !== undefined)
  )
}

export const doesItemValidateTableSchema = (item: Item, table: TableV2): boolean => {
  const { partitionKey, sortKey } = table

  return (
    doesItemValidateTableSchemaKey(item, partitionKey) &&
    doesItemValidateTableSchemaKey(item, sortKey)
  )
}
