import { DynamoDBToolboxError } from 'v1/errors/dynamoDBToolboxError'
import { isBoolean } from 'v1/utils/validation/isBoolean'

export const parseConsistentOption = (consistent: boolean): boolean => {
  if (!isBoolean(consistent)) {
    throw new DynamoDBToolboxError('commands.invalidConsistentOption', {
      message: `Invalid consistent option: '${String(consistent)}'. 'consistent' must be boolean.`,
      payload: { consistent }
    })
  }

  return consistent
}
