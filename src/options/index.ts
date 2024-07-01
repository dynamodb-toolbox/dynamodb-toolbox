import { DynamoDBToolboxError } from '~/errors/dynamoDBToolboxError.js'
import type { Table } from '~/table/index.js'
import { isString } from '~/utils/validation/isString.js'

export const parseIndexOption = (table: Table, index: string): string => {
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
