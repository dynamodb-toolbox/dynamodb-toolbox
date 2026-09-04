import { DynamoDBToolboxError } from '~/errors/dynamoDBToolboxError.js'
import { isString } from '~/utils/validation/isString.js'

/**
 * Value type of the `clientRequestToken` command option.
 */
export type ClientRequestToken = string

/**
 * Validate a `clientRequestToken` option value, throwing if it is not a string.
 */
export const parseClientRequestToken = (clientRequestToken: unknown): ClientRequestToken => {
  if (!isString(clientRequestToken)) {
    throw new DynamoDBToolboxError('options.invalidClientRequestToken', {
      message: `Invalid client request token option: '${String(
        clientRequestToken
      )}'. 'clientRequestToken' must be a string.`,
      payload: { clientRequestToken }
    })
  }

  return clientRequestToken
}
