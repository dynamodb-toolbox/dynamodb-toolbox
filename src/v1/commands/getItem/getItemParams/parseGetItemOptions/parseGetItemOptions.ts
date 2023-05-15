import type { GetCommandInput } from '@aws-sdk/lib-dynamodb'
import isEmpty from 'lodash.isempty'

import { DynamoDBToolboxError } from 'v1/errors/dynamoDBToolboxError'
import { parseCapacityOption } from 'v1/commands/utils/parseOptions/parseCapacityOption'
import { rejectExtraOptions } from 'v1/commands/utils/parseOptions/rejectExtraOptions'
import { parseProjection } from 'v1/commands/utils/parseProjection'
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

  if (attributes !== undefined) {
    const { ExpressionAttributeNames, ProjectionExpression } = parseProjection(
      entity.item,
      attributes
    )

    if (!isEmpty(ExpressionAttributeNames)) {
      commandOptions.ExpressionAttributeNames = ExpressionAttributeNames
    }
    commandOptions.ProjectionExpression = ProjectionExpression
  }

  rejectExtraOptions(extraOptions)

  return commandOptions
}
