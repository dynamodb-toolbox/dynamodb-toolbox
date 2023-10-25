import { DynamoDBToolboxError } from 'v1/errors/dynamoDBToolboxError'
import { isString } from 'v1/utils/validation/isString'

export const parseIndexNameOption = (indexName: string): string => {
  if (!isString(indexName)) {
    throw new DynamoDBToolboxError('commands.invalidIndexNameOption', {
      message: `Invalid indexName option: '${String(indexName)}'. 'indexName' must be a string.`,
      payload: { indexName }
    })
  }

  return indexName
}
