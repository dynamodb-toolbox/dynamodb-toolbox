import { DynamoDBToolboxError } from 'v1/errors/dynamoDBToolboxError'
import { isBoolean } from 'v1/utils/validation/isBoolean'

export const parseConsistentOption = (consistent: boolean, index?: string): boolean => {
  if (!isBoolean(consistent)) {
    throw new DynamoDBToolboxError('options.invalidConsistentOption', {
      message: `Invalid consistent option: '${String(consistent)}'. 'consistent' must be boolean.`,
      payload: { consistent }
    })
  }

  if (consistent && index !== undefined) {
    throw new DynamoDBToolboxError('options.invalidConsistentOption', {
      message: `Invalid consistent option: '${String(
        consistent
      )}'. Queries on secondary indexes cannot be consistent.`,
      payload: { consistent }
    })
  }

  return consistent
}
