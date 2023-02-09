import type { GetCommandInput } from '@aws-sdk/lib-dynamodb'

import { DynamoDBToolboxError } from 'v1/errors/dynamoDBToolboxError'
import { capacityOptionsSet } from 'v1/commands/options'
import { isBoolean } from 'v1/utils/validation/isBoolean'

import type { GetItemOptions } from '../../options'

type CommandOptions = Omit<GetCommandInput, 'TableName' | 'Key'>

export const parseGetItemOptions = (putItemOptions: GetItemOptions): CommandOptions => {
  const commandOptions: CommandOptions = {}

  const { capacity, consistent, ...extraOptions } = putItemOptions

  if (capacity !== undefined) {
    // TODO Factorize with parsePutItemOptions
    if (!capacityOptionsSet.has(capacity)) {
      throw new DynamoDBToolboxError('invalidCommandCapacityOption', {
        message: `Invalid capacity option: '${String(capacity)}'. 'capacity' must be one of: ${[
          ...capacityOptionsSet
        ].join(', ')}.`,
        payload: { capacity }
      })
    } else {
      commandOptions.ReturnConsumedCapacity = capacity
    }
  }

  if (consistent !== undefined) {
    if (!isBoolean(consistent)) {
      throw new DynamoDBToolboxError('invalidGetItemCommandConsistentOption', {
        message: `Invalid consistent option: '${String(
          consistent
        )}'. 'consistent' must be boolean.`,
        payload: { consistent }
      })
    } else {
      commandOptions.ConsistentRead = consistent
    }
  }

  const [extraOption] = Object.keys(extraOptions)
  if (extraOption !== undefined) {
    // TODO Factorize with parsePutItemOptions
    throw new DynamoDBToolboxError('unknownCommandOption', {
      message: `Unkown option: ${extraOption}.`,
      payload: { option: extraOption }
    })
  }

  return commandOptions
}
