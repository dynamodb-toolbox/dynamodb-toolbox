import type { UpdateCommandInput } from '@aws-sdk/lib-dynamodb'

import type { EntityV2 } from 'v1/entity'
import { parseCapacityOption } from 'v1/operations/utils/parseOptions/parseCapacityOption'
import { parseMetricsOption } from 'v1/operations/utils/parseOptions/parseMetricsOption'
import { parseReturnValuesOption } from 'v1/operations/utils/parseOptions/parseReturnValuesOption'
import { rejectExtraOptions } from 'v1/operations/utils/parseOptions/rejectExtraOptions'
import { parseCondition } from 'v1/operations/expression/condition/parse'

import { updateItemCommandReturnValuesOptionsSet, UpdateItemOptions } from '../options'

type CommandOptions = Omit<UpdateCommandInput, 'TableName' | 'Item' | 'Key'>

export const parseUpdateItemOptions = <ENTITY extends EntityV2>(
  entity: ENTITY,
  updateItemOptions: UpdateItemOptions<ENTITY>
): CommandOptions => {
  const commandOptions: CommandOptions = {}

  const { capacity, metrics, returnValues, condition, ...extraOptions } = updateItemOptions
  rejectExtraOptions(extraOptions)

  if (capacity !== undefined) {
    commandOptions.ReturnConsumedCapacity = parseCapacityOption(capacity)
  }

  if (metrics !== undefined) {
    commandOptions.ReturnItemCollectionMetrics = parseMetricsOption(metrics)
  }

  if (returnValues !== undefined) {
    commandOptions.ReturnValues = parseReturnValuesOption(
      updateItemCommandReturnValuesOptionsSet,
      returnValues
    )
  }

  if (condition !== undefined) {
    const {
      ExpressionAttributeNames,
      ExpressionAttributeValues,
      ConditionExpression
    } = parseCondition(entity, condition)

    commandOptions.ExpressionAttributeNames = ExpressionAttributeNames
    commandOptions.ExpressionAttributeValues = ExpressionAttributeValues
    commandOptions.ConditionExpression = ConditionExpression
  }

  return commandOptions
}
