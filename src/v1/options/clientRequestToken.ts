import { DynamoDBToolboxError } from 'v1/errors/dynamoDBToolboxError'
import { isString } from 'v1/utils/validation/isString'

export type ClientRequestToken = string

export const parseClientRequestToken = (clientRequestToken: unknown): ClientRequestToken => {
  if (!isString(clientRequestToken)) {
    throw new DynamoDBToolboxError('operations.invalidClientRequestTokenOption', {
      message: `Invalid client request token option: '${String(
        clientRequestToken
      )}'. 'clientRequestToken' must be a string.`,
      payload: { clientRequestToken }
    })
  }

  return clientRequestToken
}
