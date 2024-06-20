import { DynamoDBToolboxError } from 'v1/errors/dynamoDBToolboxError.js'

export const rejectExtraOptions = (extraOptions: {}): void => {
  const [extraOption] = Object.keys(extraOptions)

  if (extraOption !== undefined) {
    throw new DynamoDBToolboxError('options.unknownOption', {
      message: `Unkown option: ${extraOption}.`,
      payload: { option: extraOption }
    })
  }
}
