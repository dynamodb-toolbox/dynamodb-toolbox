import { DynamoDBToolboxError } from 'v1/errors/dynamoDBToolboxError'
import { isInteger } from 'v1/utils/validation/isInteger'

export const parseLimitOption = (limit: number): number => {
  if (!isInteger(limit) || limit <= 0) {
    throw new DynamoDBToolboxError('commands.invalidLimitOption', {
      message: `Invalid limit option: '${String(limit)}'. 'limit' must be an integer > 0.`,
      payload: { limit }
    })
  }

  return limit
}
