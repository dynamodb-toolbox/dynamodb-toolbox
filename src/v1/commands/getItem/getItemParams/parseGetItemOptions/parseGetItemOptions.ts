import type { GetCommandInput } from '@aws-sdk/lib-dynamodb'

import { DynamoDBToolboxError } from 'v1/errors/dynamoDBToolboxError'
import { parseCapacityOption } from 'v1/commands/utils/parseOptions/parseCapacityOption'
import { rejectExtraOptions } from 'v1/commands/utils/parseOptions/rejectExtraOptions'
import { isBoolean } from 'v1/utils/validation/isBoolean'

import type { GetItemOptions } from '../../options'

type CommandOptions = Omit<GetCommandInput, 'TableName' | 'Key'>

export const parseGetItemOptions = (putItemOptions: GetItemOptions): CommandOptions => {
  const commandOptions: CommandOptions = {}

  const { capacity, consistent, ...extraOptions } = putItemOptions

  if (capacity !== undefined) {
    commandOptions.ReturnConsumedCapacity = parseCapacityOption(capacity)
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

  rejectExtraOptions(extraOptions)

  return commandOptions
}
