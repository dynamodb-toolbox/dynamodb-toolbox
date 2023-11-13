import type { TableV2 } from 'v1/table'

import { DynamoDBToolboxError } from 'v1/errors/dynamoDBToolboxError'
import { isString } from 'v1/utils/validation/isString'

export const parseIndexNameOption = (table: TableV2, indexName: string): string => {
  if (!isString(indexName)) {
    throw new DynamoDBToolboxError('commands.invalidIndexNameOption', {
      message: `Invalid indexName option: '${String(indexName)}'. 'indexName' must be a string.`,
      payload: { indexName }
    })
  }

  if (table.indexes[indexName] === undefined) {
    throw new DynamoDBToolboxError('commands.invalidIndexNameOption', {
      message: `Invalid indexName option: '${String(
        indexName
      )}'. Index is not defined on Table, please provide an 'indexes' option to its constructor.`,
      payload: { indexName }
    })
  }

  return indexName
}
