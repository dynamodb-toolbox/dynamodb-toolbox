import { TableV2 } from 'v1/table'

export const getDefaultComputeKey = (table: TableV2) => (
  keyInput: Record<string, any>
): Record<string, any> => {
  const partitionKeyValue = keyInput[table.partitionKey.name]

  if (!table.sortKey?.name) {
    return { [table.partitionKey.name]: partitionKeyValue }
  }

  const sortKeyValue = keyInput[table.sortKey.name]

  return {
    [table.partitionKey.name]: partitionKeyValue,
    [table.sortKey.name]: sortKeyValue
  }
}
