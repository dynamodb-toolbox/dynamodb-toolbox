import { DynamoDBToolboxError } from '~/errors/dynamoDBToolboxError.js'
import type { Index } from '~/table/index.js'
import { isBoolean } from '~/utils/validation/isBoolean.js'

export const parseConsistentOption = (consistent: boolean, index?: Index): boolean => {
  if (!isBoolean(consistent)) {
    throw new DynamoDBToolboxError('options.invalidConsistentOption', {
      message: `Invalid consistent option: '${String(consistent)}'. 'consistent' must be boolean.`,
      payload: { consistent }
    })
  }

  if (consistent && index !== undefined && index.type !== 'local') {
    throw new DynamoDBToolboxError('options.invalidConsistentOption', {
      message: `Invalid consistent option: '${String(
        consistent
      )}'. Queries on global secondary indexes cannot be consistent.`,
      payload: { consistent }
    })
  }

  return consistent
}
