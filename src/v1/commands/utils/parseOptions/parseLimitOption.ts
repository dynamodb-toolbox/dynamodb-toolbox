import { DynamoDBToolboxError } from 'v1/errors/dynamoDBToolboxError'
import { isNumber } from 'v1/utils/validation/isNumber'

export const parseLimitOption = (limit: number): number => {
  if (!isNumber(limit)) {
    throw new DynamoDBToolboxError('commands.invalidLimitOption', {
      message: `Invalid limit option: '${String(limit)}'. 'limit' must be a number.`,
      payload: { limit }
    })
  }

  return limit
}
