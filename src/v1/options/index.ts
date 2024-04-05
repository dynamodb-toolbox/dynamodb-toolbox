import type { TableV2 } from 'v1/table'

import { DynamoDBToolboxError } from 'v1/errors/dynamoDBToolboxError'
import { isString } from 'v1/utils/validation/isString'

export const parseIndexOption = (table: TableV2, index: string): string => {
  if (!isString(index)) {
    throw new DynamoDBToolboxError('options.invalidIndexOption', {
      message: `Invalid index option: '${String(index)}'. 'index' must be a string.`,
      payload: { index }
    })
  }

  if (table.indexes[index] === undefined) {
    throw new DynamoDBToolboxError('options.invalidIndexOption', {
      message: `Invalid index option: '${String(
        index
      )}'. Index is not defined on Table, please provide an 'indexes' option to its constructor.`,
      payload: { index }
    })
  }

  return index
}
