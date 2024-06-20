import { DynamoDBToolboxError } from 'v1/errors/dynamoDBToolboxError.js'
import { isInteger } from 'v1/utils/validation/isInteger.js'

export const parseLimitOption = (limit: number): number => {
  if (!isInteger(limit) || limit <= 0) {
    throw new DynamoDBToolboxError('options.invalidLimitOption', {
      message: `Invalid limit option: '${String(limit)}'. 'limit' must be an integer > 0.`,
      payload: { limit }
    })
  }

  return limit
}
