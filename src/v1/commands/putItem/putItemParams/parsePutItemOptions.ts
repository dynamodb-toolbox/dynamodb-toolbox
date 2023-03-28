import type { PutCommandInput } from '@aws-sdk/lib-dynamodb'

import type { EntityV2 } from 'v1/entity'
import { parseCapacityOption } from 'v1/commands/utils/parseOptions/parseCapacityOption'
import { parseMetricsOption } from 'v1/commands/utils/parseOptions/parseMetricsOption'
import { parseReturnValuesOption } from 'v1/commands/utils/parseOptions/parseReturnValuesOption'
import { rejectExtraOptions } from 'v1/commands/utils/parseOptions/rejectExtraOptions'

import { putItemCommandReturnValuesOptionsSet, PutItemOptions } from '../options'
import { parseCondition } from './parseCondition'

type CommandOptions = Omit<PutCommandInput, 'TableName' | 'Item'>

export const parsePutItemOptions = <ENTITY extends EntityV2>(
  entity: ENTITY,
  putItemOptions: PutItemOptions<ENTITY>
): CommandOptions => {
  const commandOptions: CommandOptions = {}

  const { capacity, metrics, returnValues, condition, ...extraOptions } = putItemOptions
  rejectExtraOptions(extraOptions)

  if (capacity !== undefined) {
    commandOptions.ReturnConsumedCapacity = parseCapacityOption(capacity)
  }

  if (metrics !== undefined) {
    commandOptions.ReturnItemCollectionMetrics = parseMetricsOption(metrics)
  }

  if (returnValues !== undefined) {
    commandOptions.ReturnValues = parseReturnValuesOption(
      putItemCommandReturnValuesOptionsSet,
      returnValues
    )
  }

  if (condition !== undefined) {
    const {
      ExpressionAttributeNames,
      ExpressionAttributeValues,
      ConditionExpression
    } = parseCondition(entity.item, condition)

    commandOptions.ExpressionAttributeNames = ExpressionAttributeNames
    commandOptions.ExpressionAttributeValues = ExpressionAttributeValues
    commandOptions.ConditionExpression = ConditionExpression
  }

  return commandOptions
}
