import type { UpdateCommandInput } from '@aws-sdk/lib-dynamodb'

import type { EntityV2 } from 'v1/entity'
import { EntityConditionParser } from 'v1/entity/actions/parseCondition'
import { parseCapacityOption } from 'v1/options/capacity'
import { parseMetricsOption } from 'v1/options/metrics'
import { parseReturnValuesOption } from 'v1/options/returnValues'
import { rejectExtraOptions } from 'v1/options/rejectExtraOptions'

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
    } = entity.build(EntityConditionParser).parse(condition).toCommandOptions()

    commandOptions.ExpressionAttributeNames = ExpressionAttributeNames
    commandOptions.ExpressionAttributeValues = ExpressionAttributeValues
    commandOptions.ConditionExpression = ConditionExpression
  }

  return commandOptions
}
