import { DynamoDBToolboxError } from 'v1/errors/dynamoDBToolboxError'

export const rejectExtraOptions = (extraOptions: {}): void => {
  const [extraOption] = Object.keys(extraOptions)

  if (extraOption !== undefined) {
    throw new DynamoDBToolboxError('unknownCommandOption', {
      message: `Unkown option: ${extraOption}.`,
      payload: { option: extraOption }
    })
  }
}
