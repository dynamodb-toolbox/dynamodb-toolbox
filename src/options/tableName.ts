import { DynamoDBToolboxError } from '~/errors/dynamoDBToolboxError.js'
import { isString } from '~/utils/validation/isString.js'

export const parseTableNameOption = (tableName: string): string => {
  if (!isString(tableName)) {
    throw new DynamoDBToolboxError('options.invalidTableNameOption', {
      message: `Invalid tableName option: '${String(tableName)}'. 'tableName' must be a string.`,
      payload: { tableName }
    })
  }

  return tableName
}
