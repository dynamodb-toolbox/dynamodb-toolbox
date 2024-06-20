import { DynamoDBToolboxError } from '~/errors/dynamoDBToolboxError.js'
import { isString } from '~/utils/validation/isString.js'

export type ClientRequestToken = string

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
