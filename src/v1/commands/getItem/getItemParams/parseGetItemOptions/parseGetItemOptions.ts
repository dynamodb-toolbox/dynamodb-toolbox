import type { GetCommandInput } from '@aws-sdk/lib-dynamodb'

import { DynamoDBToolboxError } from 'v1/errors/dynamoDBToolboxError'
import { parseCapacityOption } from 'v1/commands/utils/parseOptions/parseCapacityOption'
import { rejectExtraOptions } from 'v1/commands/utils/parseOptions/rejectExtraOptions'
import { isBoolean } from 'v1/utils/validation/isBoolean'
import { EntityV2 } from 'v1/entity'

import type { GetItemOptions } from '../../options'

type CommandOptions = Omit<GetCommandInput, 'TableName' | 'Key'>

export const parseGetItemOptions = <ENTITY extends EntityV2>(
  entity: ENTITY,
  getItemOptions: GetItemOptions<ENTITY>
): CommandOptions => {
  const commandOptions: CommandOptions = {}

  const { capacity, consistent, attributes, ...extraOptions } = getItemOptions

  if (capacity !== undefined) {
    commandOptions.ReturnConsumedCapacity = parseCapacityOption(capacity)
  }

  if (consistent !== undefined) {
    if (!isBoolean(consistent)) {
      throw new DynamoDBToolboxError('getItemCommand.invalidConsistentOption', {
        message: `Invalid consistent option: '${String(
          consistent
        )}'. 'consistent' must be boolean.`,
        payload: { consistent }
      })
    } else {
      commandOptions.ConsistentRead = consistent
    }
  }

  // TODO validate projection expression attributes
  entity
  attributes

  rejectExtraOptions(extraOptions)

  return commandOptions
}
