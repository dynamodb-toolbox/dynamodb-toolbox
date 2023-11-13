import { DynamoDBToolboxError } from 'v1/errors/dynamoDBToolboxError'
import { isBoolean } from 'v1/utils/validation/isBoolean'

export const parseConsistentOption = (consistent: boolean, indexName?: string): boolean => {
  if (!isBoolean(consistent)) {
    throw new DynamoDBToolboxError('commands.invalidConsistentOption', {
      message: `Invalid consistent option: '${String(consistent)}'. 'consistent' must be boolean.`,
      payload: { consistent }
    })
  }

  if (consistent && indexName !== undefined) {
    throw new DynamoDBToolboxError('commands.invalidConsistentOption', {
      message: `Invalid consistent option: '${String(
        consistent
      )}'. Queries on secondary indexes cannot be consistent.`,
      payload: { consistent }
    })
  }

  return consistent
}
