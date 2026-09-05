import { DynamoDBToolboxError } from '~/errors/dynamoDBToolboxError.js'

/**
 * Throw if any unknown extra command option was provided.
 */
export const rejectExtraOptions = (extraOptions: {}): void => {
  const [extraOption] = Object.keys(extraOptions)

  if (extraOption !== undefined) {
    throw new DynamoDBToolboxError('options.unknownOption', {
      message: `Unknown option: ${extraOption}.`,
      payload: { option: extraOption }
    })
  }
}
